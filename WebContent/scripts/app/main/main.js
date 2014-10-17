define([
	// injected dependencies
	"angular", "util/lib/angular-require-lazy/bootstrap", "./navbarCtrl", "lazy-registry", "util/lib/angular-require-lazy/routeConfig", "app/constants",
	// side-effect deps
	"templateCache!./navbar.html",
	// side-effect, non-AMD deps
	"lib/angular-route/angular-route", "lib/angular-ui-bootstrap/src/modal/modal"
],
function(angular, bootstrap, navbarCtrl, lazyRegistry, routeConfig, constants, $injector, navbarTemplate) {
	
	var main = angular.module("main", ["ngRoute", "ui.bootstrap.collapse", "ui.bootstrap.modal"]);
	
	main.config(["$routeProvider", addAllRoutes]);
	
	main.controller("NavbarCtrl", navbarCtrl);
	
	bootstrap(document, main);
	
	return main;
	
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
