define(["module", "./currentModule"], function(module, currentModule) {
	"use strict";
	
	/** RequireJS module loader entry point. */
	function load(name, parentRequire, onload, config) {
		parentRequire(["text!" + name], function(t) {
			if( !config || !config.isBuild ) {
				currentModule.run(["$templateCache", function($templateCache) {
					$templateCache.put(name, t);
				}]);
			}
			onload({
				text: t,
				path: name
			});
		});
	}
	
	return {
		load: load
	};
});
