define([
	// injected dependencies
	"angular", "./navbarCtrl",
	// side-effect deps
	"templateCache!./navbar.html",
	// side-effect, non-AMD deps
	"lib/angular-route/angular-route", "lib/angular-ui-bootstrap/src/modal/modal"
],
function(angular, navbarCtrl, navbarTemplate) {
	"use strict";
	
	var main = angular.module("main", ["ngRoute", "ui.bootstrap.collapse", "ui.bootstrap.modal"]);
	
	main.controller("NavbarCtrl", navbarCtrl);
	
	return main;
});
