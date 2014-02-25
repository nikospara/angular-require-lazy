define(["angular"], function(angular) {
	"use strict";
	
	var lazyAngularUtils, eagerAngularModuleFn = angular.module, cachedInternals = {}, lazyModules = {};
	
	function makeLazyModule(name, cachedInternals) {
		var lazyModule = {
			name: name,
			realModule: null,
			__runBlocks: [],
			factory: function() {
				cachedInternals.$provide.factory.apply(null, arguments);
				return lazyModule;
			},
			directive: function() {
				cachedInternals.$compileProvider.directive.apply(null, arguments);
				return lazyModule;
			},
			filter: function() {
				cachedInternals.$filterProvider.register.apply(null, arguments);
				return lazyModule;
			},
			controller: function() {
				cachedInternals.$controllerProvider.register.apply(null, arguments);
				return lazyModule;
			},
			provider: function() {
				cachedInternals.$provide.provider.apply(null, arguments);
				return lazyModule;
			},
			service: function() {
				cachedInternals.$provide.service.apply(null, arguments);
				return lazyModule;
			},
			run: function(r) {
				this.__runBlocks.push(r);
				return lazyModule;
			}
			// TODO Implement the rest of the angular.module interface
		};
		return lazyModule;
	}
	
	function makeLazyAngular() {
		angular.module = function(name, requires, configFn) {
			var ret, realModule;
			if( typeof(requires) === "undefined" ) {
				if( lazyModules.hasOwnProperty(name) ) ret = lazyModules[name];
				else ret = eagerAngularModuleFn.call(angular, name);
			}
			else {
//if( configFn != null ) throw new Error("config function unimplemented yet, module: " + name);
				ret = makeLazyModule(name, cachedInternals);
				lazyModules[name] = ret;
				ret.realModule = eagerAngularModuleFn.call(angular, name, requires, configFn);
				lazyAngularUtils.modulesQueue.push(ret);
			}
			return ret;
		};
	}
	
	lazyAngularUtils = {
		cacheInternals: ["$provide", "$compileProvider", "$filterProvider", "$controllerProvider",
			function($provide, $compileProvider, $filterProvider, $controllerProvider) {
				cachedInternals.$provide = $provide;
				cachedInternals.$compileProvider = $compileProvider;
				cachedInternals.$filterProvider = $filterProvider;
				cachedInternals.$controllerProvider = $controllerProvider;
			}
		],
		makeLazyAngular: makeLazyAngular,
		modulesQueue: []
	};
	
	return lazyAngularUtils;
});
