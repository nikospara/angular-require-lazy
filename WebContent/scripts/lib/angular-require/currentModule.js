define(["jquery"], function($) {
	"use strict";
	
	var runBlocks = [], currentModuleProxy = {};
	
	currentModuleProxy.factory = function() {
		runBlocks.push(["factory",$.makeArray(arguments)]);
		return currentModuleProxy;
	};
	
	currentModuleProxy.directive = function() {
		runBlocks.push(["directive",$.makeArray(arguments)]);
		return currentModuleProxy;
	};
	
	currentModuleProxy.filter = function() {
		runBlocks.push(["filter",$.makeArray(arguments)]);
		return currentModuleProxy;
	};
	
	currentModuleProxy.controller = function() {
		runBlocks.push(["controller",$.makeArray(arguments)]);
		return currentModuleProxy;
	};
	
	currentModuleProxy.provider = function() {
		runBlocks.push(["provider",$.makeArray(arguments)]);
		return currentModuleProxy;
	};
	
	currentModuleProxy.service = function() {
		runBlocks.push(["service",$.makeArray(arguments)]);
		return currentModuleProxy;
	};
	
	currentModuleProxy.run = function(r) {
		runBlocks.push(r);
		return currentModuleProxy;
	};
	
	// TODO Implement the rest of the angular.module interface
	
	currentModuleProxy.resolveWith = function(realModule) {
		var i, b;
		for( i=0; i < runBlocks.length; i++ ) {
			b = runBlocks[i];
			realModule[b[0]].apply(null,b[1]);
		}
		runBlocks = [];
	};
	
	return currentModuleProxy;
});
