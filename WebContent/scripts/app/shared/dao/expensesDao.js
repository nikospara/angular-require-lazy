define([
	"app/shared/model/Expense", "angular", "currentModule",
	"lib/angular-resource/angular-resource", "./userDao"
],
function(Expense, angular, currentModule) {
	"use strict";

	// TODO (framework): I would like the following:
	// currentModule._dependencies.push("ngResource");
	currentModule.service("expensesDao", ["$resource", "$q", "userDao", function($resource, $q, userDao) {
		var rc;

		rc = $resource("api/user/:id/expenses", {}, {});

		function fetch(year,month,result) {
			if( result != null ) {
				result.$$status = "PENDING";
			}
			// TODO $q.when() is required for now, since userDao.getUserData() uses jQuery promises; remove when refactoring is complete
			return $q.when(userDao.getUserData()).then(
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
