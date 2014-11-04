define(["angular", "./util"], function(angular, util) {
	"use strict";
	
	var runBlocks = [], moduleDependenciesSet = [], currentModuleProxy = {}, makeArray = util.makeArray;

	currentModuleProxy.addDependencies = function() {
		for( var i=0; i < arguments.length; i++ ) {
			if( typeof(arguments[i]) === "string" ) {
				addToSet(moduleDependenciesSet, arguments[i]);
			}
			else if( angular.isArray(arguments[i]) ) {
				addAllToSet(moduleDependenciesSet, arguments[i]);
			}
		}
		return currentModuleProxy;
	};

	function addToSet(set, d) {
		if( d && set.indexOf(d) < 0 ) {
			set.push(d);
		}
	}

	function addAllToSet(set, deps) {
		for( var i=0; i < deps.length; i++ ) {
			if( typeof(deps[i]) === "string" ) {
				addToSet(set, deps[i]);
			}
		}
	}

	currentModuleProxy.combineDependencies = function(deps) {
		var i, ret = angular.copy(deps);
		addAllToSet(ret, moduleDependenciesSet);
		return ret;
	};
	
	// Angular API
	currentModuleProxy.factory = function() {
		runBlocks.push(["factory", makeArray(arguments)]);
		return currentModuleProxy;
	};
	
	currentModuleProxy.directive = function() {
		runBlocks.push(["directive", makeArray(arguments)]);
		return currentModuleProxy;
	};
	
	currentModuleProxy.filter = function() {
		runBlocks.push(["filter", makeArray(arguments)]);
		return currentModuleProxy;
	};
	
	currentModuleProxy.controller = function() {
		runBlocks.push(["controller", makeArray(arguments)]);
		return currentModuleProxy;
	};
	
	currentModuleProxy.provider = function() {
		runBlocks.push(["provider", makeArray(arguments)]);
		return currentModuleProxy;
	};
	
	currentModuleProxy.service = function() {
		runBlocks.push(["service", makeArray(arguments)]);
		return currentModuleProxy;
	};
	
	currentModuleProxy.run = function(r) {
		runBlocks.push(["run",[r]]);
		return currentModuleProxy;
	};
	
	currentModuleProxy.value = function() {
		runBlocks.push(["value", makeArray(arguments)]);
		return currentModuleProxy;
	};
	
	currentModuleProxy.constant = function() {
		runBlocks.push(["constant", makeArray(arguments)]);
		return currentModuleProxy;
	};
	
	currentModuleProxy.animation = function() {
		runBlocks.push(["animation", makeArray(arguments)]);
		return currentModuleProxy;
	};
	
	// TODO Only config() is missing from the angular.module interface; decide if we can handle it and how
	
	currentModuleProxy.resolveWith = function(realModule) {
		var i, b;
		for( i=0; i < runBlocks.length; i++ ) {
			b = runBlocks[i];
			realModule[b[0]].apply(realModule,b[1]);
		}
		runBlocks = [];
		moduleDependenciesSet = [];
	};
	
	return currentModuleProxy;
});
