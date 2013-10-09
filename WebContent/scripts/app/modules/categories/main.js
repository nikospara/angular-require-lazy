define(["angular", "./categoriesCtrl"], function(angular, categoriesCtrl) {
	"use strict";
	
	var m = angular.module("categories",[]);
	
	m.controller("EditCategoriesCtrl", categoriesCtrl);
	
	return m;
});
