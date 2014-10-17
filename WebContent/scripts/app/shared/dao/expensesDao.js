define([
	"app/shared/model/Expense", "angular", "currentModule",
	"lib/angular-resource/angular-resource", "./userDao", "lib/angular-resource/angular-resource"
],
function(Expense, angular, currentModule) {
	"use strict";

	currentModule.addDependencies("ngResource").service("expensesDao", ["$resource", "$q", "userDao", function($resource, $q, userDao) {
		var rc;

		rc = $resource("api/user/:id/expenses", {}, {});

		function fetch(year,month,result) {
			if( result != null ) {
				result.$$status = "PENDING";
			}
			return userDao.getUserData().then(
				function gotUserData(userData) {
					return rc.get({id:userData.id, year:year, month:month}).$promise;
				},
				function errorGettingUserData(response) {
					return $q.reject(response);
				}
			).then(
				function success(data) {
					if( data && data.payload && angular.isArray(result) ) {
						angular.copy(data.payload,result);
					}
					if( result != null ) {
						result.$$status = "SUCCESS";
					}
					return data;
				},
				function failure(response) {
					if( result != null ) {
						result.$$status = "FAILURE";
					}
					return $q.reject(response);
				}
			);
		}

		function add(expense) {
			return userDao.getUserData().then(
				function gotUserData(userData) {
					return rc.save({id:userData.id}, expense).$promise;
				},
				function errorGettingUserData(response) {
					return $q.reject(response);
				}
			);
		}

		return {
			fetch: fetch,
			add: add
		};
	}]);
});
