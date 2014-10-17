//////////////////////////////////////
// THIS IS OUTDATED AND UNUSED !!!  //
//////////////////////////////////////
define(["module"], function(module) {
	"use strict";
	
	return {
		load: function(name, parentRequire, onload, config) {
			parentRequire(["text!" + name], function(t) {
				onload(t);
			});
		},
		write: function(pluginName, moduleName, write) {
			var text = "define('" + pluginName + "!" + moduleName + "',['currentModule','text!" + moduleName + "'],function(currentModule, t) {\n";
			text += "\tcurrentModule.run(['$templateCache', function($templateCache) {\n";
			text += "\t\t$templateCache.put('" + moduleName + "', t);\n";
			text += "\t}]);\n";
			text += "});\n";
			write(text);
		}
	};
});
