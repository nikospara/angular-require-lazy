define(["angular", "./indexCtrl", "currentModule"], function(angular, indexCtrl, currentModule) {
	"use strict";
	
	var m = angular.module("index", currentModule.combineDependencies([]));
	
	m.controller("IndexCtrl", indexCtrl);
	
	return m;
});
