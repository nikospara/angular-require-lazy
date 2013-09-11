/** This is based on angularjs-requirejs-lazy-controllers from github. */
define([], function () {
	"use strict";
	
	var $compileProvider;
	
	function setCompileProvider(value) {
		$compileProvider = value;
	}
	
	function register(name, directive) {
		if (!$compileProvider) {
			throw new Error("$compileProvider is not set!");
		}
		$compileProvider.directive.call(null, name, directive);
	}

	return {
		setCompileProvider: setCompileProvider,
		register: register
	}
});
