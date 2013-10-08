define([], function() {
	"use strict";
	
	function transformResponse(data, headersGetter) {
		try {
			if( data != null && data != "" ) data = JSON.parse(data);
			else data = null;
		}
		catch(e) {
			return { $error: e, $rc: "FAILURE" };
		}
		if( data != null && typeof(data.payload) !== "undefined" ) {
		    var ret = data.payload || [];
			if( $.isArray(data.messages) ) ret.$messages = data.messages;
			if( typeof(data.hasMore) === "boolean" ) ret.$hasMore = data.hasMore;
			if( data.exception == null ) {
				ret.$rc = "SUCCESS";
			}
			else {
				ret.$rc = "FAILURE";
				ret.$exception = data.exception;
			}
			return ret;
		}
		else return data;
	}
	
	return {
		transformResponse: transformResponse
	};
});
