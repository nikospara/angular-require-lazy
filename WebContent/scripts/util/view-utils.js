define([], function() {
	"use strict";
	
	function preprocessAnchorEvt(event) {
		if( event ) {
			if( typeof(event.preventDefault) === "function" ) event.preventDefault();
			if( event.currentTarget ) $(event.currentTarget).blur();
		}
	}
	
	return {
		preprocessAnchorEvt: preprocessAnchorEvt
	};
});
