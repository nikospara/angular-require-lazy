define([], function() {
	"use strict";

	function makeArray(arr) {
		var ret = arr, i, x;
		if( arr != null && !angular.isArray(arr) ) {
			ret  =[];
			if( angular.isNumber(arr.length) ) {
				for( i=0; i < arr.length; i++ ) {
					x = arr[i];
					ret.push(x);
				}
			}
		}
		return ret;
	}
	
	return {
		makeArray: makeArray
	};
});
