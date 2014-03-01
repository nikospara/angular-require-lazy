define([
	"angular", "app/main/main", "util/lib/angular-require/lazyAngularUtils", "util/lib/angular-require/routeConfig",
	"lazy-registry", "currentModule", "app/constants", "$injector"
],
function(angular, main, lazyAngularUtils, routeConfig, lazyRegistry, currentModule, constants, $injector) {
//	"use strict";
	
	var j;
	
	main.config(["$routeProvider", addAllRoutes]);
	main.config(lazyAngularUtils.cacheInternals);
	
	currentModule.resolveWith(main);
	
	lazyAngularUtils.makeLazyAngular();
	
//	window.name = "NG_DEFER_BOOTSTRAP!" + window.name;
	j = angular.bootstrap(document, [main.name]);
	angular.extend($injector, j);
//	angular.resumeBootstrap();
	
	function addAllRoutes($routeProvider) {
		var module, i, modules = lazyRegistry.getModules();
		for( i=0; i < modules.length; i++ ) {
			module = modules[i];
			addAllRoutesForModule($routeProvider, module);
		}
		$routeProvider.otherwise({redirectTo: constants.HOME_PATH});
	}
	
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
});
