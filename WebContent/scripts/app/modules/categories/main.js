define(["angular", "./categoriesView", "./categoryDirective"], function(angular, view) {
	"use strict";
	
	var m = angular.module("categories",[]);
	
	m.controller("EditCategoriesCtrl", view.controller);
	
	m.run(["$templateCache", function($templateCache) {
		$templateCache.put("virtual-template/categories.html", view.template);
	}]);
	
	return m;
});
