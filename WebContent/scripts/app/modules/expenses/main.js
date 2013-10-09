define(["angular", "./expensesCtrl"], function(angular, expensesCtrl) {
	"use strict";
	
	var m = angular.module("expenses",[]);
	
	m.controller("ExpensesCtrl", expensesCtrl);
	
	return m;
});
