define(["jquery"],function($) {

	return {
		makeDeferred: function() {
			return $.Deferred();
		},
		makePromise: function(deferred) {
			return deferred.promise();
		}
	};

});
