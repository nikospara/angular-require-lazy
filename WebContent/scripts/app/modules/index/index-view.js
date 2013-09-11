define([
	"jquery", "app/shared/model/Expense", "app/shared/dao/categoriesDao", "app/shared/dao/userDao", "app/shared/dao/expensesDao",
	"util/return-service", "text!./index-template.html"
],
function($, Expense, categoriesDao, userDao, expensesDao, returnSvc, template) {
	"use strict";
	
	function IndexCtrl($scope) {
		
		$.extend($scope, {
			categories: categoriesDao.fetchCachedForCurrentUser(),
			form: initExpense(),
			enter: enter,
			editCategories: editCategories
		});
		
		function initExpense() {
			var retData, e = returnSvc.get("expense");
			if( e == null ) {
				e = new Expense();
				userDao.getUserData().done(function(userData) {
					e.categoryId = userData.defaultCategoryId;
					// TODO Is this necessary? Why? Why not?
					// (I believe it is and the reason it works without it is that something else happens to call $apply.)
//					$scope.$apply();
				});
			}
			else {
				retData = returnSvc.getReturnedData();
				if( retData && typeof(retData.categoryKey) === "number" ) e.categoryId = retData.categoryKey;
			}
			return e;
		}
		
		function enter(event) {
console.log($scope);
console.log("EXPENSE: %o", $scope.form);
			expensesDao.add($scope.form);
			// TODO Clear
		}
		
		function editCategories(event) {
			returnSvc.put("expense", $scope.form);
			returnSvc.push();
		}
	}
	
	return {
		controller: ["$scope", IndexCtrl],
		template: template
	};
});
