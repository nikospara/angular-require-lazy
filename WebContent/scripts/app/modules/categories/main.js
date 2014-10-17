define(["angular", "./categoriesCtrl", "currentModule"], function(angular, categoriesCtrl, currentModule) {
	"use strict";
	
	var m = angular.module("categories", currentModule.combineDependencies([]));
	
	m.controller("EditCategoriesCtrl", categoriesCtrl);
	
	return m;
});
