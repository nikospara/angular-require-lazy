define(["angular"], function() {
	"use strict";
	
	var $q = null;
	
	return {
		makeDeferred: function() {
			return $q.defer();
		},
		makePromise: function(deferred) {
			return deferred.promise;
		},
		all: function(promises) {
			return $q.all(promises);
		},
		setQ: function(value) {
			$q = value;
		}
	};
});
