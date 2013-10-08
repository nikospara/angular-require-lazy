define(["angular", "./expensesView"], function(angular, expensesView) {
	"use strict";
	
	var m = angular.module("index",[]);
	
	m.controller("ExpensesCtrl", expensesView.controller);
	
	m.run(["$templateCache", function($templateCache) {
		$templateCache.put("virtual-template/expenses.html", expensesView.template);
	}]);
	
	return m;
});
