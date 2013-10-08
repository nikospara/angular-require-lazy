define(["jquery", "util/menuEntries", "app/constants"],
function($, menuEntries, constants) {
	"use strict";
	
	NavbarCtrl.$inject = ["$scope", "$location"];
	function NavbarCtrl($scope, $location) {
		
		$.extend($scope, {
			isNavbarCollapsed: true,
			menuEntries: menuEntries,
			isActive: isActive,
			isHome: isHome,
			homePath: homePath
		});
		
		function isActive(menuEntry) {
			return $location.path() === menuEntry.path;
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
