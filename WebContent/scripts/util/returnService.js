define(["$injector"], function($injector) {
	"use strict";
	
	var stack = [], pushing = false, pushed = false, returning = false, returned = false, startController = null, currentState = null,
		currentPushedData = null, currentReturnedData = null;
	
	var $rootScope = $injector.get("$rootScope");
		
	$rootScope.$on("$routeChangeSuccess", function(event, currentRoute, previousRoute) {
//console.log("SUCCESS: %o %o %o", event, currentRoute, previousRoute);
		if( pushing ) {
//console.log("PUSHED");
			// TODO
		}
		else if( returning ) {
//console.log("RETURNED");
			// TODO
		}
		else {
			clear();
		}
		startController = null;
		pushing = false;
		returning = false;
	});
		
	$rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
//console.log("START: %o %o %o", event, nextRoute, currentRoute);
		startController = currentRoute.controller;
	});
		
	$rootScope.$on("$routeChangeError", function(event, currentRoute, previousRoute, rejection) {
//console.warn("ERROR HANDLING NOT DONE");
		if( pushing ) {
//console.log("PUSHED");
			// TODO
		}
		else if( returning ) {
//console.log("RETURNED");
			// TODO
		}
		else {
			clear();
		}
		startController = null;
		pushing = false;
		returning = false;
	});
	
	function push(data, targetView) {
		var $location = $injector.get("$location");
		pushing = true;
		stack.push({
			location: $location.hash(),
			currentState: currentState,
			currentPushedData: currentPushedData,
			pushed: pushed,
			returned: returned
		});
		currentState = null;
		currentPushedData = data;
		// set those here because the view gets rendered before the routeChangeSuccess event
		pushed = true;
		returned = false;
		if( typeof(targetView) === "string" ) $location.hash(targetView);
	}
	
	function doReturn(data) {
		var $location = $injector.get("$location"), frame = stack.pop();
		returning = true;
		currentState = frame.currentState;
		currentPushedData = frame.currentPushedData;
		currentReturnedData = data;
		pushed = frame.pushed;
		returned = true;
		$location.hash(frame.location);
	}
	
	function getPushedData() {
		if( pushed ) return currentPushedData;
		else return null;
	}
	
	function getReturnedData() {
		if( returned ) return currentReturnedData;
		else return null;
	}
	
	function clear() {
		stack = [];
		currentState = null;
		currentPushedData = null;
		currentReturnedData = null;
		pushed = false;
		returned = false;
	}
	
	function isPushed() {
		return pushed;
	}
	
	function isReturned() {
		return returned;
	}
	
	function put(key, value) {
		if( currentState === null ) currentState = {};
		currentState[key] = value;
	}
	
	function get(key) {
		if( currentState === null ) return;
		return currentState[key];
	}
	
	return {
		push: push,
		doReturn: doReturn,
		getPushedData: getPushedData,
		getReturnedData: getReturnedData,
		clear: clear,
		isPushed: isPushed,
		isReturned: isReturned,
		put: put,
		get: get
	};
});
