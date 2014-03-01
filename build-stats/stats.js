var app = angular.module("app", ["ngRoute"]);

app.config(function($routeProvider) {
	$routeProvider.when("/modules", {controller:"ModulesCtrl", templateUrl:"modules.html", reloadOnSearch:false});
	$routeProvider.when("/bundles", {controller:"BundlesCtrl", templateUrl:"bundles.html", reloadOnSearch:false});
	$routeProvider.when("/amd", {controller:"AmdCtrl", templateUrl:"amd.html", reloadOnSearch:false});
	$routeProvider.otherwise({redirectTo: "/modules"});
});

app.controller("ModulesCtrl", function($scope, modules, $location) {
	$scope.modules = modules;
	
	$scope.toggle = function(x, $event) {
		$event.preventDefault();
		if( x == null ) return;
		if( x.$ui == null ) x.$ui = {};
		if( x.$ui.on = !x.$ui.on ) {
//			$location.replace();
//			$location.search("m", x.name);
		}
//		else {
//			if( $location.search("m") === x.name ) {
//				$location.replace();
//				$location.search("m", null);
//			}
//		}
	};
	
	$scope.collapseAll = function() {
		var x;
		for( x in modules ) {
			if( !modules.hasOwnProperty(x) ) continue;
			x = modules[x];
			if( x.$ui ) {
				x.$ui.on = false;
				x.$ui.depsOn = false;
			}
		}
	};
});

app.controller("BundlesCtrl", function($scope, bundles, $location) {
	$scope.bundles = bundles.bundlesArray;
	
	initSelection();
	
	$scope.toggle = function(x, $event) {
		$event.preventDefault();
		if( x == null ) return;
		if( x.$ui == null ) x.$ui = {};
		if( x.$ui.on = !x.$ui.on ) {
//			$location.replace();
//			$location.search("b", x.name);
		}
	};
	
	$scope.collapseAll = function() {
		var x;
		for( x in $scope.bundles ) {
			if( !$scope.bundles.hasOwnProperty(x) ) continue;
			x = $scope.bundles[x];
			if( x.$ui ) {
				x.$ui.on = false;
				x.$ui.depsOn = false;
			}
		}
	};
	
	function initSelection() {
		var selection = $location.search().b, i;
		if( selection ) {
			for( i=0; i < $scope.bundles.length; i++ ) {
				if( $scope.bundles[i].id === selection ) {
					if( $scope.bundles[i].$ui == null ) $scope.bundles[i].$ui = {};
					$scope.bundles[i].$ui.on = true;
					break;
				}
			}
		}
	}
});

app.directive("depsList", function() {
	return {
		restrict: "EA",
		templateUrl: "deps.html",
		replace: true,
		scope: {
			x: "=item",
			deps: "=",
			flag: "=",
			heading: "@"
		},
		controller: function($scope, bundles) {
			$scope.depsToBundleMap = bundles.depsToBundleMap;
			$scope.toggleDeps = function($event) {
				$event.preventDefault();
				$scope.flag = !$scope.flag;
			};
		}
	};
});

app.controller("SanityCtrl", function($scope, bundles, modules) {
});

app.controller("AmdCtrl", function($scope, bundles, modules) {
	$scope.depsToBundleMap = bundles.depsToBundleMap;
});
