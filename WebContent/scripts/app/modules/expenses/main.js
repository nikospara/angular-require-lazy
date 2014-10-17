define(["angular", "./expensesCtrl", "currentModule"], function(angular, expensesCtrl, currentModule) {
	"use strict";
	
	var m = angular.module("expenses", currentModule.combineDependencies([]));
	
	m.controller("ExpensesCtrl", expensesCtrl);
	
	return m;
});
