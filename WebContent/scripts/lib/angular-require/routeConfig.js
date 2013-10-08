/** This is based on angularjs-requirejs-lazy-controllers from github. */
define(["currentModule", "lib/angular-require/lazyAngularUtils"], function(currentModule, lazyAngularUtils) {
	"use strict";
	
	function initLazyModules(injector) {
		var i, modulesQueue = lazyAngularUtils.modulesQueue;
		if( modulesQueue != null && modulesQueue.length > 0 ) {
// TODO Run lazy config functions, not implemented yet
//			for( i=0; i < modulesQueue.length; i++ ) {
//				callConfigBlocks(injector, modulesQueue[i]);
//			}
			for( i=0; i < modulesQueue.length; i++ ) {
				callRunBlocks(injector, modulesQueue[i]);
			}
			modulesQueue.splice(0);
		}
	}
	
	function callRunBlocks(injector, module) {
		var i, blocks;
		blocks = module.__runBlocks || [];
		for( i=0; i < blocks.length; i++ ) {
			injector.invoke(blocks[i]);
		}
	}
	
	function fromAmdModule(route,module) {
		var defer, templateDefer, loaded = false;
		
		return {
			controller: route.controller,
			resolve: {
				delay: ["$q", "$route", "$templateCache", "$injector", function($q, $route, $templateCache, $injector) {
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
								initLazyModules($injector);
								loaded = true;
								templateDefer.resolve($templateCache.get(route.template));
								defer.resolve();
							}, function(err) {
								// TODO
								defer.reject(err);
							}
						);
					}
					
					return defer.promise;
				}]
			}
		};
	}
	
	return {
		fromAmdModule: fromAmdModule,
		initLazyModules: initLazyModules
	};
});
