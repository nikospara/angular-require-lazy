define(["lazy-registry"], function(lazyRegistry) {
	"use strict";
	
	function makeMenuEntries() {
		var i, ret = [], module, modules = lazyRegistry.getModules();
		for( i=0; i < modules.length; i++ ) {
			module = modules[i];
			addMenuEntry(module,ret);
		}
		return ret;
	}
	
	function addMenuEntry(module, entries) {
		if( module.metadata && module.metadata["angular-routes"] ) {
			var i, meta = module.metadata["angular-routes"];
			for( i=0; i < meta.length; i++ ) {
				entries.push({
					display: meta[i].display,
					path: meta[i].path
				});
			}
		}
	}
	
	return makeMenuEntries();
});
