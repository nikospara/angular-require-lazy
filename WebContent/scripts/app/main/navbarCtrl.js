define([
	"jquery", "util/menuEntries", "app/constants",
	"lib/angular-ui-bootstrap/src/collapse/collapse"
],
function($, menuEntries, constants) {
	"use strict";
	
	NavbarCtrl.$inject = ["$scope", "$location", "$route"];
	function NavbarCtrl($scope, $location, $route) {
		
		$.extend($scope, {
			isNavbarCollapsed: true,
			menuEntries: menuEntries,
			isActive: isActive,
			isHome: isHome,
			homePath: homePath
		});
		
		function isActive(menuEntry) {
			return $route.current.locals && $route.current.locals.amdModule && $route.current.locals.amdModule.name === menuEntry.moduleName;
		}
		
		function isHome() {
			return $location.path() === constants.HOME_PATH;
		}
		
		function homePath() {
			return constants.HOME_PATH;
		}
	}
	
	return NavbarCtrl;
});
