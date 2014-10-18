define(["module", "./promiseAdaptorAngular", "./currentModule", "./lazyAngularUtils", "./bootstrap"],
function(module, promiseAdaptor, currentModule, lazyAngularUtils, bootstrap) {
	"use strict";

	/** RequireJS module loader entry point. */
	function load(name, parentRequire, onload, config) {
		parentRequire(["lazy!" + name], function(stubModule) {
			if( !config || !config.isBuild ) {
				doDevTimeLoad(stubModule, onload);
			}
			else {
				onload(stubModule);
			}
		});
	}

	function doDevTimeLoad(stubModule, onload) {
		var realGet = stubModule.get, cachedRealModule, gotRealModule = false;

		stubModule.get = function() {
			var d = promiseAdaptor.makeDeferred();
			if( gotRealModule ) {
				d.resolve(cachedRealModule);
			}
			else {
				realGet.apply(stubModule).then(
					function(realModule) {
						currentModule.resolveWith(realModule);
						lazyAngularUtils.initLazyModules(bootstrap.injector);
						d.resolve(realModule);
						cachedRealModule = realModule;
						gotRealModule = true;
						realGet = null;
					},
					function error(err) {
						d.reject(err);
					}
				);
			}
			return promiseAdaptor.makePromise(d);
		};

		onload(stubModule);
	}
	
	return {
		load: load
	};
});
