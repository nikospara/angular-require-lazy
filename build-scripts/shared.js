/*!
 * node.extend
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * @fileoverview
 * Port of jQuery.extend that actually works on node.js
 */
//var fs = require( 'fs' );

function is_plain_obj( obj ){
  if( !obj ||
      {}.toString.call( obj ) !== '[object Object]' ||
      obj.nodeType ||
      obj.setInterval ){
    return false;
  }

  var has_own                   = {}.hasOwnProperty;
  var has_own_constructor       = has_own.call( obj, 'constructor' );
  var has_is_property_of_method = has_own.call( obj.constructor.prototype, 'isPrototypeOf' );

  // Not own constructor property must be Object
  if( obj.constructor &&
      !has_own_constructor &&
      !has_is_property_of_method ){
    return false;
  }

  // Own properties are enumerated firstly, so to speed up,
  // if last one is own, then all properties are own.
  var key;
  for( key in obj ){}

  return key === undefined || has_own.call( obj, key );
};

function extend (){
  var target = arguments[ 0 ] || {};
  var i      = 1;
  var length = arguments.length;
  var deep   = false;
  var options, name, src, copy, copy_is_array, clone;

  // Handle a deep copy situation
  if( typeof target === 'boolean' ){
    deep   = target;
    target = arguments[ 1 ] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if( typeof target !== 'object' && typeof target !== 'function' ){
    target = {};
  }

  for( ; i < length; i++ ){
    // Only deal with non-null/undefined values
    if(( options = arguments[ i ]) != null ){
      // Extend the base object
      for( name in options ){
        src  = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if( target === copy ){
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if( deep && copy && ( is_plain_obj( copy ) || ( copy_is_array = Array.isArray( copy )))){
          if( copy_is_array ){
            copy_is_array = false;
            clone = src && Array.isArray( src ) ? src : [];
          }else{
            clone = src && is_plain_obj( src ) ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = extend( deep, clone, copy );

        // Don't bring in undefined values
        }else if( copy !== undefined ){
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};









console.log("STILL USING LOCAL shared.js - CHANGE:\n\t1) require-lazy to export createModulesRegistryText()\n\t2) package.json#devDependencies add require-lazy\n\t3) Use shared = require(\"require-lazy\").shared\n");
// shared code
var
	LIB_LAZY = "lazy",
	
	DEFAULT_MODULES_REGISTRY_LOCAL_OPTIONS = {
		inludeModuleName: false,
		generateBody: false,
		nullBundleDeps: false,
		writeBundleRegistrations: false
	},
	
	ROOT_IMPLICIT_DEPS = ["promise-adaptor","lazy-registry"];

/**
 * localOptions:
 * - inludeModuleName         [false]: Use the named module define: define('name',[deps],function(){})
 * - generateBody             [false]: Actually generate the body (if false it creates a dummy module, e.g. for the findDeps phase)
 * - nullBundleDeps           [false]: Always write `null` as the bundleDeps (i.e. non-built mode)
 * - writeBundleRegistrations [false]: 
 */
function createModulesRegistryText(pmresult, options, localOptions) {
	var text;
	localOptions = extend(true, {}, DEFAULT_MODULES_REGISTRY_LOCAL_OPTIONS, localOptions);
	text = makeRawText();
	return text;
	
	function makeRawText() {
		var text, i, a;
		
		text = "define(";
		
		if( localOptions.inludeModuleName ) text += "'lazy-registry',";
		
		text += "['" + LIB_LAZY + "','require','promise-adaptor'], function(lazy,require,promiseAdaptor) {";
		
		if( localOptions.generateBody ) {
			text +=
				"\nvar moduleList = [];\n" +
				"function registerModule(m) {\n" +
					"\tmoduleList.push(m);\n" +
					"\tlazy.registerModule(m);\n" +
				"}\n";
			
			if( localOptions.writeBundleRegistrations ) {
				a = pmresult.bundles.bundlesArray;
				for( i=0; i < a.length; i++ ) {
					if( !(a[i].exclusive || a[i].includedIn) ) text += "lazy.registerBundle('" + a[i].id + "','" + a[i].hash + "');\n";
				}
			}
			
			a = pmresult.modulesArray;
			for( i=0; i < a.length; i++ ) {
				if( a[i].parents.length > 0 ) text += writeModuleRegistration(a[i]); // skip the main module
			}
			
			text +=
				"return {\n" +
					"\tgetModules: function() { return moduleList; },\n" +
					"\tgetModule: lazy.getModule,\n" +
					"\tget: function(moduleName) {\n" +
						"\t\tvar m = lazy.getModule(moduleName);\n" +
						"\t\tif( m != null ) return m.get();\n" +
						"\t\telse {\n" +
							"\t\t\tvar d = promiseAdaptor.makeDeferred();\n" +
							"\t\t\td.reject('does not exist');\n" + // TODO refine the error
							"\t\t\treturn promiseAdaptor.makePromise(d);\n" +
						"\t\t}\n" +
					"\t}\n" +
				"};\n";
		}
		
		text += "});\n";
		
		return text;
	}
	
	function writeModuleRegistration(module) {
		var i, text, first = true;
		text = "registerModule(new lazy.Stub('" + module.name + "',require,";
		if( localOptions.nullBundleDeps ) {
			text += "null";
		}
		else {
			text += "[";
			if( module.bundleDeps != null && module.bundleDeps.length > 0 ) {
				for( i=0; i < module.bundleDeps.length; i++ ) {
					if( !(module.bundleDeps[i].exclusive || module.bundleDeps[i].includedIn) ) {
						if( first ) first = false;
						else text += ",";
						text += "'" + module.bundleDeps[i].id + "'";
					}
				}
			}
			text += "]";
		}
		text += ",";
		if( module.hash != null ) text += "'" + module.hash + "'";
		else text += "null";
		text += ",";
		text += retrieveMetadataAsString(module);
		text += "));\n";
		return text;
	}
	
	function retrieveMetadataAsString(module) {
		if( typeof(options.retrieveMetaForModule) === "function" ) {
			var metadata = options.retrieveMetaForModule(module.name);
			return JSON.stringify(metadata);
		}
		else return "null";
	}
}


module.exports = {
	ROOT_IMPLICIT_DEPS: ROOT_IMPLICIT_DEPS,
	createModulesRegistryText: createModulesRegistryText
};
