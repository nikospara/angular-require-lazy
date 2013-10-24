define([
	// injected dependencies
	"angular", "./navbarCtrl",
	// side-effect deps
	"templateCache!./navbar.html",
	// side-effect, non-AMD deps
	"lib/angular/angular-route", "lib/angular-ui-bootstrap/collapse", "lib/angular-ui-bootstrap/dialog"
],
function(angular, navbarCtrl, navbarTemplate) {
	"use strict";
	
	var main = angular.module("main", ["ngRoute", "ui.bootstrap.collapse", "ui.bootstrap.dialog"]);
	
	main.controller("NavbarCtrl", navbarCtrl);
	
	return main;
});
