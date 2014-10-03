define([
	// injected dependencies
	"angular", "app/main/navbarCtrl",
	// side-effect deps
	"templateCache!app/main/navbar.html",
	// side-effect, non-AMD deps
	"lib/angular-route/angular-route", "lib/angular-ui-bootstrap/src/modal/modal"
],
function(angular, navbarCtrl, navbarTemplate) {
	"use strict";
	
	var main = angular.module("test-main", ["ngMock", "ngRoute", "ui.bootstrap.collapse", "ui.bootstrap.modal"]);
	
	main.controller("NavbarCtrl", navbarCtrl);
	
	return main;
});
