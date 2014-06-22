define(["app/shared/model/Expense", "util/resource", "./userDao", "angular"], function(Expense, resource, userDao, angular) {
	"use strict";
	
	var rc;
	
	rc = resource("api/user/{id}/expenses", {}, {
		fetch: { method:"GET", isArray:true, transformResponse: function(data, headersGetter) {
			if( data == null ) return null;
			if( typeof(data) === "string" ) data = JSON.parse(data);
			if( data == null || !angular.isArray(data.payload) ) return;
			for( var i=0; i < data.payload.length; i++ ) {
				data.payload[i] = new Expense(data.payload[i]);
			}
			return data;
		}},
		add: { method:"POST" }
	});
	
	function fetch(year,month,success,failure) {
		var argsPromise = userDao.getUserData().then(function(userData) {
			return { id: userData.id, year: year, month: month };
		});
		return rc.fetch(argsPromise, resource.findSuccessCallback(arguments), resource.findFailureCallback(arguments));
	}
	
	function add(expense) {
		return rc.add(userDao.getUserData(), expense);
	}
	
	return {
		fetch: fetch,
		add: add
	};
});
