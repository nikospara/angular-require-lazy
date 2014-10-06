/** This is based on angularjs-requirejs-lazy-controllers from github. */
define(["./currentModule", "./lazyAngularUtils"], function(currentModule, lazyAngularUtils) {
	"use strict";
	
	function fromAmdModule(route,module) {
		var defer, templateDefer, loaded = false;
		
		return {
			controller: route.controller,
			resolve: {
				module: ["$q", "$route", "$templateCache", "$injector", function($q, $route, $templateCache, $injector) {
					if( typeof($route.current.template) !== "function" ) {
						if( templateDefer == null ) templateDefer = $q.defer();
						$route.current.template = function() {
							return templateDefer.promise;
						};
					};
					
					if( defer == null ) {
						defer = $q.defer();
						
						$q.when(module.get()).then(
							function(m) {
								if( m == null ) {
									defer.reject("module " + module.name + " does not export anything");
									return;
								}
								
								currentModule.resolveWith(m);
								// init any angular modules that were lazy loaded
								lazyAngularUtils.initLazyModules($injector);
								loaded = true;
								templateDefer.resolve($templateCache.get(route.template));
								defer.resolve(m);
							}, function(err) {
								// TODO
								defer.reject(err);
							}
						);
					}
					
					return defer.promise;
				}],
				amdModule: function() {
					return module;
				}
			}
		};
	}
	
	return {
		fromAmdModule: fromAmdModule
	};
});
