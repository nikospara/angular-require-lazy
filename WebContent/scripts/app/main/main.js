define([
	// injected dependencies
	"text!./navbar.html",
	// AngularModuleExtensions
	"./navbar-ctrl",
	// side-effect (non-AMD) deps
	"lib/angular-ui-bootstrap/collapse", "lib/angular-ui-bootstrap/dialog"
],
angularModule(function(navbarTemplate) {
	"use strict";
	
	function cacheTemplates($templateCache) {
		$templateCache.put("virtual-template/navbar.html", navbarTemplate);
	}
	
	return {
		name: "..",
		deps: ["ui.bootstrap.collapse", "ui.bootstrap.dialog"],
//		configs: [
//			["$routeProvider", configRoutes]
//		],
		run: [
			["$templateCache", cacheTemplates]
		]
	};
}));
