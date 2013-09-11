/** This is based on angularjs-requirejs-lazy-controllers from github. */
define(["injector"], function(injector) {
	"use strict";
	
	var $controllerProvider, $compileProvider, modulesQueue;
	
	function setControllerProvider(value) {
		$controllerProvider = value;
	}
	
	function setCompileProvider(value) {
		$compileProvider = value;
	}
	
	function setModulesQueue(value) {
		modulesQueue = value;
	}
	
	function initLazyModules(inj) {
		var i;
		if( modulesQueue != null && modulesQueue.length > 0 ) {
// TODO Run lazy config functions, not implemented yet
//			for( i=0; i < modulesQueue.length; i++ ) {
//				callConfigBlocks(inj, modulesQueue[i]);
//			}
			for( i=0; i < modulesQueue.length; i++ ) {
				callRunBlocks(inj, modulesQueue[i]);
			}
			modulesQueue.splice(0);
		}
	}
	
	function callRunBlocks(inj, module) {
		var i, blocks;
		blocks = module.__runBlocks || [];
		for( i=0; i < blocks.length; i++ ) {
			inj.invoke(blocks[i]);
		}
	}
	
	function fromAmdModule(path,module) {
		if( !$controllerProvider ) throw new Error("$controllerProvider is not set!");
		
		var defer, templateDefer, routeDefinition, controllerName, loaded = false;
		
		controllerName = module.name + "#" + path;
		
		routeDefinition = {
			controller: controllerName,
			resolve: {
				delay: ["$q", "$rootScope", "$timeout", "$templateCache", "$route", function ($q, $rootScope, $timeout, $templateCache, $route) {
					if( typeof($route.current.template) !== "function" ) {
						if( templateDefer == null ) templateDefer = $q.defer();
						$route.current.template = function() {
							return templateDefer.promise;
						};
					};
					
					if( !loaded ) {
						defer = $q.defer();
						
						module.get().then(function(m) {
							if( m == null ) {
								defer.reject("module " + module.name + " does not export anything");
								return;
							}
							if( typeof(m.getControllerFor) !== "function" ) {
								defer.reject("module " + module.name + " does not export the function getControllerFor");
								return;
							}
							if( typeof(m.getTemplateFor) !== "function" ) {
								defer.reject("module " + module.name + " does not export the function getTemplateFor");
								return;
							}
							
							var
								controller = m.getControllerFor(path),
								template = m.getTemplateFor(path);
							
							if( controller == null ) {
								defer.reject("module " + module.name + " does not define a controller for " + path);
								return;
							}
							if( template == null ) {
								defer.reject("module " + module.name + " does not define a template for " + path);
								return;
							}
							
							$timeout(function() {
								// allow controller and template to be promises
								$q.all([controller,template, injector.get()]).then(function(array) {
									var inj = array[2];
									controller = array[0];
									template = array[1];
									loaded = true;
									
									// init any angular modules that were lazy loaded
									initLazyModules(inj);
									
									$controllerProvider.register(controllerName, controller);
									defer.resolve();
									templateDefer.resolve(template);
								}, function(err) {
									defer.reject(err);
								});
							},0);
						},function(err) {
							// TODO
							defer.reject(err);
						});
					}
					else {
						defer.resolve();
					}
					return defer.promise;
				}]
			}
		};
		
		return routeDefinition;
	}
	
	return {
		setControllerProvider: setControllerProvider,
		setCompileProvider: setCompileProvider,
		fromAmdModule: fromAmdModule,
		setModulesQueue: setModulesQueue,
		initLazyModules: initLazyModules
	};
});
