define(['module'], function (module) {
	"use strict";

	var MODULE_RELATIVE_PREFIX = "./", MODULE_PARENT_RELATIVE_PREFIX = "../";
	
	/** RequireJS module loader entry point. */
	function load(name, parentRequire, onload, config) {
		parentRequire([name], function(m) {
			if( config.isBuild ) {
				onload({});
			}
			else {
				var deps = transformDeps(m.deps),
					angModule;
				
				name = handleName(name,m);
				angModule = angular.module(name, deps);
				
				if( angular.isArray(m.configs) ) configAll(angModule, m.configs);
				if( angular.isObject(m.values) ) register(angModule, "value", m.values);
				if( angular.isObject(m.directives) ) register(angModule, "directive", m.directives); // TODO Directives need special namespacing
				if( angular.isObject(m.controllers) ) register(angModule, "controller", m.controllers);
				// TODO Process each available module method
				if( angular.isArray(m.run) ) runAll(angModule, m.run);
				
				onload(angModule);
			}
		}); // TODO: errback()
	}
	
	
	function handleName(name,module) {
		var ret = name;
		if( typeof(module.name) === "string" ) {
			if( module.name === ".." ) ret = name.substring(0,name.lastIndexOf("/"));
			else ret = module.name;
		}
		return ret;
	}
	
	/** Register the appropriate angular subsystem from the given map. */
	function register(angModule, methodName, map) {
		for( var x in map ) {
			if( !map.hasOwnProperty(x) ) continue;
			angModule[methodName](namespace(angModule,x), namespace(angModule,map[x]));
		}
	}
	
	/** Transform an array of either module names (strings) or modules to an array of pure names. */
	function transformDeps(deps) {
		var ret = [], i;
		for( i=0; deps != null && i < deps.length; i++ ) {
			if( typeof(deps[i]) === "string" ) ret.push(deps[i]);
			else if( angular.isObject(deps[i]) && typeof(deps[i].name) === "string" ) ret.push(deps[i].name);
		}
		return ret;
	}
	
	/** Execute angular config() for the given module. */
	function configAll(angModule, arr) {
		for( var i=0; i < arr.length; i++ ) {
			angModule.config(arr[i]);
		}
	}
	
	/** Execute angular run() for the given module. */
	function runAll(angModule, arr) {
		for( var i=0; i < arr.length; i++ ) {
			angModule.run(arr[i]);
		}
	}
	
	/** Namespacing: if a dependency name starts with "#", prepend the module name. */
	function namespace(angModule, x) {
		if( typeof(x) === "string" ) return namespaceString(angModule,x);
		else if( angular.isArray(x) ) return namespaceArray(angModule,x);
		else return x;
	}
	
	function namespaceString(angModule, s) {
		if( s.indexOf(MODULE_RELATIVE_PREFIX) === 0 ) s = angModule.name + "/" + s.substr(MODULE_RELATIVE_PREFIX.length);
		else if( s.indexOf(MODULE_PARENT_RELATIVE_PREFIX) === 0 ) s = angModule.name.substring(0,angModule.name.lastIndexOf("/")) + "/" + s.substr(MODULE_PARENT_RELATIVE_PREFIX.length);
		return s;
	}
	
	function namespaceArray(angModule, a) {
		var ret = [], i;
		for( i=0; i < a.length; i++ ) {
			ret[i] = namespace(angModule,a[i]);
		}
		return ret;
	}
	
	
	return {
		load: load
	};

});
