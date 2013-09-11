define(["jquery", "angular!app/main/main", "lib/angular-require/route-config", "lib/angular-require/lazy-directives", "lazy-registry", "injector", "./constants"],
function($, main, routeConfig, lazyDirectives, lazyRegistry, injector, constants) {
	"use strict";
	
	var modulesQueue = [];
	
	function addAllRoutesForModule($routeProvider, module) {
		var routes = module.metadata["angular-routes"], i, route;
		for( i=0; i < routes.length; i++ ) {
			route = routes[i];
			$routeProvider.when(route.path, routeConfig.fromAmdModule(route.path,module));
		}
	}
	
	function addAllRoutes($routeProvider, $controllerProvider, $compileProvider) {
		routeConfig.setControllerProvider($controllerProvider);
		routeConfig.setModulesQueue(modulesQueue);
		lazyDirectives.setCompileProvider($compileProvider);
		var module, i, modules = lazyRegistry.getModules();
		for( i=0; i < modules.length; i++ ) {
			module = modules[i];
			if( module.metadata && module.metadata["angular-routes"] ) addAllRoutesForModule($routeProvider, module);
		}
		$routeProvider.otherwise({redirectTo: constants.HOME_PATH});
	}
	
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
			run: function(r) {
				this.__runBlocks.push(r);
				return lazyModule;
			}
			// TODO Implement the rest of the angular.module interface
		};
		return lazyModule;
	}
	
	$(function() {
		var j, eagerAngular = angular, lazyAngular = {}, cachedInternals = {}, lazyModules = {};
		
		main.config(["$routeProvider", "$controllerProvider", "$compileProvider", addAllRoutes]);
		main.config(["$provide", "$compileProvider", "$filterProvider", "$controllerProvider", function($provide, $compileProvider, $filterProvider, $controllerProvider) {
			cachedInternals.$provide = $provide;
			cachedInternals.$compileProvider = $compileProvider;
			cachedInternals.$filterProvider = $filterProvider;
			cachedInternals.$controllerProvider = $controllerProvider;
		}]);
		
		j = angular.bootstrap(document, [main.name]);
		injector.set(j);
		
		$.extend(lazyAngular, eagerAngular);
		lazyAngular.module = function(name, requires, configFn) {
			var ret, realModule;
			if( typeof(requires) === "undefined" ) {
				if( lazyModules.hasOwnProperty(name) ) ret = lazyModules[name];
				else ret = eagerAngular.module(name);
			}
			else {
if( configFn != null ) throw new Error("config function unimplemented yet, module: " + name);
				ret = makeLazyModule(name, cachedInternals);
				lazyModules[name] = ret;
				ret.realModule = eagerAngular.module(name, requires, configFn);
				modulesQueue.push(ret);
			}
			return ret;
		};
		window.angular = lazyAngular;
	});
});
