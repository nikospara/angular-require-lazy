define(['module'], function (module) {


	var masterConfig = (module.config && module.config()) || {};
	
	return {
		load: function(name, parentRequire, onload, config) {
			onload();
		},
		write: function(pluginName, moduleName, write) {
			var text = "define('" + pluginName + "!" + moduleName + "',['" + masterConfig.lazyModuleName + "','lazy-registry'],function(lazy) {\n";
			text += "return lazy.getModule('" + moduleName + "');\n";
			text += "});\n";
			write(text);
		}
	};


});
