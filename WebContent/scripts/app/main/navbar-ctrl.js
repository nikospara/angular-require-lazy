define(["AngularModuleExtension", "jquery", "util/menu-entries", "app/constants"],
function(AngularModuleExtension, $, menuEntries, constants) {
	"use strict";
	
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
	
	return new AngularModuleExtension({
		controllers: {
			"./NavbarCtrl": ["$scope", "$location", NavbarCtrl]
		}
	});
});
