define([
	"angular", "currentModule", "templateCache!./chartPopup.tpl.html",
	// side-effect deps
	"./pieChartDirective", "./chartPopupService",
	"lib/angular-ui-bootstrap/src/modal/modal"
],
function(angular, currentModule, chartPopupTemplate) {
	"use strict";

	var m = angular.module("chartPopup", currentModule.combineDependencies([]));

	return m;
});
