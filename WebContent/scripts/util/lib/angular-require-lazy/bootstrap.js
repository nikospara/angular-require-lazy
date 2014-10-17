define(["angular", "./lazyAngularUtils", "./currentModule"], function(angular, lazyAngularUtils, currentModule) {
	"use strict";
	
	function bootstrap(element, mainModule) {
		var injector;
		mainModule.config(lazyAngularUtils.cacheInternals);
		mainModule.run(lazyAngularUtils.captureQ);
		currentModule.resolveWith(mainModule);
		lazyAngularUtils.makeLazyAngular();
		injector = angular.bootstrap(element, [mainModule.name]);
		bootstrap.injector = injector;
		return injector;
	}
	
	return bootstrap;
});
