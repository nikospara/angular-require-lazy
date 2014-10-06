define([
	"angular", "app/shared/model/Expense", "app/shared/dao/userDao",
	"app/shared/dao/categoriesDao", "app/shared/dao/expensesDao", "templateCache!./indexTemplate.html", "util/returnService"
],
function(angular, Expense) {
	"use strict";
	
	IndexCtrl.$inject = ["$scope", "returnService", "expensesDao", "categoriesDao", "userDao"];
	function IndexCtrl($scope, returnService, expensesDao, categoriesDao, userDao) {
		
		angular.extend($scope, {
			categories: categoriesDao.fetchCachedForCurrentUser(),
			form: initExpense(),
			enter: enter,
			editCategories: editCategories
		});
		
		function initExpense() {
			var retData, e = returnService.get("expense");
			if( e == null ) {
				e = new Expense();
				userDao.getUserData().then(function(userData) {
					e.categoryId = userData.defaultCategoryId;
				});
			}
			else {
				retData = returnService.getReturnedData();
				if( retData && typeof(retData.categoryKey) === "number" ) e.categoryId = retData.categoryKey;
			}
			return e;
		}
		
		function enter(event) {
			expensesDao.add($scope.form);
			// TODO Clear
		}
		
		function editCategories(event) {
			returnService.put("expense", $scope.form);
			returnService.push();
		}
	}
	
	return IndexCtrl;
});
