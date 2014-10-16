define(["angular", "currentModule", "./userDao"],
function(angular, currentModule) {
	"use strict";

	var RC_URL = "api/user/:id/categories";

	currentModule.service("categoriesDao", ["$resource", "$q", "userDao", function($resource, $q, userDao) {
		var cachedCategories = null, cachedCategoriesMap = null, rc;

		rc = $resource(RC_URL, {}, {
			deleteCategory: { url: RC_URL+"/:key", method:"DELETE" },
			updateCategory: { method:"PUT" }
		});

		function fetchForCurrentUser(result) {
			if( result != null ) {
				result.$$status = "PENDING";
			}
			return userDao.getUserData().then(
				function gotUserData(userData) {
					return rc.get({id:userData.id}).$promise;
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
		
		function fetchCachedForCurrentUser() {
			if( cachedCategories == null ) {
				cachedCategories = [];
				fetchForCurrentUser(cachedCategories).then(makeCachedCategoriesMap);
			}
			return cachedCategories;
		}

		function updateCategory(c) {
			c.$$status = "PENDING";
			return userDao.getUserData().then(
				function gotUserData(userData) {
					return rc.updateCategory({id:userData.id},{name:c.name, key:c.key}).$promise;
				},
				function errorGettingUserData(response) {
					return $q.reject(response);
				}
			).then(
				function success(data) {
					if( data && data.payload === true ) {
						c.$$status = "SUCCESS";
						return data;
					}
					else {
						// business failure
						c.$$status = "FAILURE";
						return $q.reject(data);
					}
				},
				function failure(response) {
					c.$$status = "FAILURE";
					return $q.reject(response);
				}
			);
		}

		function deleteCategory(c) {
			c.$$status = "PENDING";
			c.$$deleted = true;
			return userDao.getUserData().then(
				function gotUserData(userData) {
					return rc.deleteCategory({id:userData.id,key:c.key},null).$promise;
				},
				function errorGettingUserData(response) {
					return $q.reject(response);
				}
			).then(
				function success(data) {
					if( data && data.payload === true ) {
						c.$$status = "SUCCESS";
						removeFromCache(c);
						return data;
					}
					else {
						// business failure
						return deletionFailed(c,data);
					}
				},
				function failure(response) {
					return deletionFailed(c,response);
				}
			);
		}

		function removeFromCache(c) {
			var index = cachedCategories.indexOf(c);
			if( index >= 0 ) cachedCategories.splice(index,1);
			if( cachedCategoriesMap !== null ) delete cachedCategoriesMap[c.key];
		}

		function deletionFailed(c, reason) {
			c.$$status = "FAILURE";
			delete c.$$deleted;
			return $q.reject(reason);
		}

		function addCategory(name) {
			var c = {key:null, name:name, $$status:"PENDING", $$promise:null};
			cachedCategories.push(c);
			c.$$promise = userDao.getUserData().then(
				function gotUserData(userData) {
					return rc.save({id:userData.id},c).$promise;
				},
				function errorGettingUserData(response) {
					return $q.reject(response);
				}
			).then(
				function success(data) {
					delete c.$$promise;
					if( data && data.payload && data.payload.key ) {
						c.$$status = "SUCCESS";
						c.key = data.payload.key;
						mapCategory(c);
						return data;
					}
					else {
						// business failure
						return additionFailed(c,data);
					}
				},
				function failure(response) {
					delete c.$$promise;
					return additionFailed(c,response);
				}
			);
			return c;
		}

		function additionFailed(c,reason) {
			var index = cachedCategories.indexOf(c);
			if( index >= 0 ) cachedCategories.splice(index,1);
			c.$$status = "FAILURE";
			return $q.reject(reason);
		}

		function clearCache() {
			cachedCategories = null;
			cachedCategoriesMap = null;
		}
		
		function makeCachedCategoriesMap() {
			var i, c;
			cachedCategoriesMap = {};
			for( i=0; i < cachedCategories.length; i++ ) {
				c = cachedCategories[i];
				cachedCategoriesMap[c.key] = c;
			}
		}

		function mapCategory(c) {
			if( cachedCategoriesMap === null ) cachedCategoriesMap = {};
			cachedCategoriesMap[c.key] = c;
		}
			
		function promiseForKey(key) {
			throw new Error("UNIMPLEMENTED");
		}
		
		return {
			fetchForCurrentUser: fetchForCurrentUser,
			fetchCachedForCurrentUser: fetchCachedForCurrentUser,
			addCategory: addCategory,
			deleteCategory: deleteCategory,
			updateCategory: updateCategory,
			promiseForKey: promiseForKey,
			clearCache: clearCache
		};
	}]);
});
