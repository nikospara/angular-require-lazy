define([
	// injected dependencies
	"angular", "./navbarCtrl", "text!./navbar.html",
	// side-effect (non-AMD) deps
	"lib/angular/angular-route", "lib/angular-ui-bootstrap/collapse", "lib/angular-ui-bootstrap/dialog"
],
function(angular, navbarCtrl, navbarTemplate) {
	"use strict";
	
	var main = angular.module("main", ["ngRoute", "ui.bootstrap.collapse", "ui.bootstrap.dialog"]);
	
	main.controller("NavbarCtrl", navbarCtrl);
	
	main.run(function($templateCache) {
		$templateCache.put("app/main/navbar.html", navbarTemplate);
	});
	
	return main;
});
