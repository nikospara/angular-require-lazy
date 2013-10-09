define(["angular", "./indexCtrl"], function(angular, indexCtrl) {
	"use strict";
	
	var m = angular.module("index",[]);
	
	m.controller("IndexCtrl", indexCtrl);
	
	return m;
});
