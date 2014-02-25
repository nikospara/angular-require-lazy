define(["util/resource", "./userDao", "jquery"], function(resource, userDao, $) {
	"use strict";
	
	var cachedCategories = null, cachedCategoriesMap = null, rc;
	
	rc = resource("api/user/{id}/categories", {}, {
		fetchForUser: { isArray:true, method:"GET" },
		addCategory: { method:"POST" },
		deleteCategory: { urlAppend:"{key}", method:"DELETE" },
		updateCategory: { method:"PUT" }
	});
	
	function fetchForCurrentUser() {
		var argsPromise = userDao.getUserData().then(function(userData) {
			return { id: userData.id };
		});
		// If we simply do `return rc.fetchForUser(userDao.getUserData())` then the other userData properties
		// (`defaultCategory` and `preferences`) will be sent as request parameters, since this is a GET.
		return rc.fetchForUser(argsPromise);
	}
	
	function addCategory(name) {
		var ret;
		ret = rc.addCategory(userDao.getUserData(), name,
			function(arg) {
				ret.key = arg.payload.key;
				ret.$pending = false;
				if( cachedCategoriesMap === null ) cachedCategoriesMap = {};
				cachedCategoriesMap[ret.key] = ret;
			},
			function() {
				var index = cachedCategories.indexOf(ret);
				if( index >= 0 ) cachedCategories.splice(index,1);
				ret.$pending = false;
				// TODO Error message
			}
		);
		ret.name = name;
		ret.key = null;
		ret.$pending = true;
		cachedCategories.push(ret);
		return ret;
	}
	
	function deleteCategory(c, success, failure) {
		var argsPromise = userDao.getUserData().then(function(userData) {
			return { id:userData.id, key:c.key };
		});
		c.$pending = true;
		c.$deleted = true;
		return rc.deleteCategory(argsPromise,
			function(arg) {
				if( arg.payload === true ) {
					var index = cachedCategories.indexOf(c);
					if( index >= 0 ) cachedCategories.splice(index,1);
					if( cachedCategoriesMap !== null ) delete cachedCategoriesMap[c.key];
					if( $.isFunction(success) ) success(arg);
				}
				else if( $.isFunction(failure) ) failure();
				c.$pending = false;
				delete c.$deleted;
			},
			function() {
				if( $.isFunction(failure) ) failure();
				c.$pending = false;
				delete c.$deleted;
			}
		);
	}
	
	function updateCategory(c, success, failure) {
		c.$pending = true;
		var res = rc.updateCategory(userDao.getUserData(), {name:c.name, key:c.key},
			function(arg) {
				c.name = res.name;
				if( $.isFunction(success) ) success(arg);
				c.$pending = false;
			},
			function() {
				if( $.isFunction(failure) ) failure();
				c.$pending = false;
				// TODO Error message
			}
		);
	}
	
	function fetchCachedForCurrentUser() {
		if( cachedCategories == null ) cachedCategories = fetchForCurrentUser();
		cachedCategories.$then(makeCachedCategoriesMap);
		return cachedCategories;
	}
	
	function makeCachedCategoriesMap() {
		var i, c;
		cachedCategoriesMap = {};
		for( i=0; i < cachedCategories.length; i++ ) {
			c = cachedCategories[i];
			cachedCategoriesMap[c.key] = c;
		}
	}
	
	function clearCache() {
		cachedCategories = null;
		cachedCategoriesMap = null;
	}
	
	function promiseForKey(key) {
		var d = $.Deferred();
		if( cachedCategoriesMap !== null ) return cachedCategoriesMap[key];
		else return {key:key, name:"UNLOADED " + key};
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
});
