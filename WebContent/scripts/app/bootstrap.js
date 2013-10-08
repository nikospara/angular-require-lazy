define(["angular", "app/main", "lib/angular-require/lazyAngularUtils", "lib/angular-require/routeConfig", "deferredInjector", "lazy-registry", "app/constants"],
function(angular, main, lazyAngularUtils, routeConfig, deferredInjector, lazyRegistry, constants) {
	"use strict";
	
	var j;
	
	main.config(["$routeProvider", "$controllerProvider", "$compileProvider", addAllRoutes]);
	main.config(lazyAngularUtils.cacheInternals);
	
	lazyAngularUtils.makeLazyAngular();
	
//	j = angular.injector(["ng",main.name]);
//	angular.extend(injector, j);
//	j.invoke(["$rootScope", "$compile", "$document", function($rootScope, $compile, $document) {
//		$compile($document)($rootScope);
//		$rootScope.$digest();
//	}]);
	j = angular.bootstrap(document, [main.name]);
	deferredInjector.set(j);
	
	function addAllRoutesForModule($routeProvider, module) {
		var routes, i, route;
		if( module.metadata && module.metadata["angular-routes"] ) {
			routes = module.metadata["angular-routes"];
			for( i=0; i < routes.length; i++ ) {
				route = routes[i];
				$routeProvider.when(route.path, routeConfig.fromAmdModule(route,module));
			}
		}
	}
	
	function addAllRoutes($routeProvider, $controllerProvider, $compileProvider) {
		var module, i, modules = lazyRegistry.getModules();
		for( i=0; i < modules.length; i++ ) {
			module = modules[i];
			addAllRoutesForModule($routeProvider, module);
		}
		$routeProvider.otherwise({redirectTo: constants.HOME_PATH});
	}
});
