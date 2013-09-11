define(["jquery"], function($) {
	"use strict";
	
	var injector = $.Deferred(), promise = injector.promise();
	
	function applySafeWith(inj) {
		var rs = inj.get("$rootScope");
		if( rs.$$phase !== "$digest" ) rs.$apply();
	}
	
	function applyEventually() {
		promise.then(applySafeWith);
	}
	
	return {
		get: function() {
			return promise;
		},
		set: function(x) {
			if( injector.state() !== "pending" ) throw new Error("injector already resolved");
			injector.resolve(x);
		},
		applySafeWith: applySafeWith,
		applyEventually: applyEventually
	};
});
