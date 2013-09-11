// shared code
var
	extend = require("./lib/extend"),
	
	LIB_LAZY = "lazy",
	
	DEFAULT_MODULES_REGISTRY_LOCAL_OPTIONS = {
		inludeModuleName: false,
		generateBody: false,
		nullBundleDeps: false,
		writeBundleRegistrations: false
	},
	
	ROOT_IMPLICIT_DEPS = ["promise-adaptor","lazy-registry"];

/**
 * localOptions:
 * - inludeModuleName         [false]: Use the named module define: define('name',[deps],function(){})
 * - generateBody             [false]: Actually generate the body (if false it creates a dummy module, e.g. for the findDeps phase)
 * - nullBundleDeps           [false]: Always write `null` as the bundleDeps (i.e. non-built mode)
 * - writeBundleRegistrations [false]: 
 */
function createModulesRegistryText(pmresult, options, localOptions) {
	var text;
	localOptions = extend(true, {}, DEFAULT_MODULES_REGISTRY_LOCAL_OPTIONS, localOptions);
	text = makeRawText();
	return text;
	
	function makeRawText() {
		var text, i, a;
		
		text = "define(";
		
		if( localOptions.inludeModuleName ) text += "'lazy-registry',";
		
		text += "['" + LIB_LAZY + "','require','promise-adaptor'], function(lazy,require,promiseAdaptor) {";
		
		if( localOptions.generateBody ) {
			text +=
				"\nvar moduleList = [];\n" +
				"function registerModule(m) {\n" +
					"\tmoduleList.push(m);\n" +
					"\tlazy.registerModule(m);\n" +
				"}\n";
			
			if( localOptions.writeBundleRegistrations ) {
				a = pmresult.bundles.bundlesArray;
				for( i=0; i < a.length; i++ ) {
					if( !(a[i].exclusive || a[i].includedIn) ) text += "lazy.registerBundle('" + a[i].id + "','" + a[i].hash + "');\n";
				}
			}
			
			a = pmresult.modulesArray;
			for( i=0; i < a.length; i++ ) {
				if( a[i].parents.length > 0 ) text += writeModuleRegistration(a[i]); // skip the main module
			}
			
			text +=
				"return {\n" +
					"\tgetModules: function() { return moduleList; },\n" +
					"\tgetModule: lazy.getModule,\n" +
					"\tget: function(moduleName) {\n" +
						"\t\tvar m = lazy.getModule(moduleName);\n" +
						"\t\tif( m != null ) return m.get();\n" +
						"\t\telse {\n" +
							"\t\t\tvar d = promiseAdaptor.makeDeferred();\n" +
							"\t\t\td.reject('does not exist');\n" + // TODO refine the error
							"\t\t\treturn promiseAdaptor.makePromise(d);\n" +
						"\t\t}\n" +
					"\t}\n" +
				"};\n";
		}
		
		text += "});\n";
		
		return text;
	}
	
	function writeModuleRegistration(module) {
		var i, text, first = true;
		text = "registerModule(new lazy.Stub('" + module.name + "',require,";
		if( localOptions.nullBundleDeps ) {
			text += "null";
		}
		else {
			text += "[";
			if( module.bundleDeps != null && module.bundleDeps.length > 0 ) {
				for( i=0; i < module.bundleDeps.length; i++ ) {
					if( !(module.bundleDeps[i].exclusive || module.bundleDeps[i].includedIn) ) {
						if( first ) first = false;
						else text += ",";
						text += "'" + module.bundleDeps[i].id + "'";
					}
				}
			}
			text += "]";
		}
		text += ",";
		if( module.hash != null ) text += "'" + module.hash + "'";
		else text += "null";
		text += ",";
		text += retrieveMetadataAsString(module);
		text += "));\n";
		return text;
	}
	
	function retrieveMetadataAsString(module) {
		if( typeof(options.retrieveMetaForModule) === "function" ) {
			var metadata = options.retrieveMetaForModule(module.name);
			return JSON.stringify(metadata);
		}
		else return "null";
	}
}

function removePluginsFromName(moduleName) {
	var index = moduleName.lastIndexOf("!");
	if( index >= 0 ) moduleName = moduleName.substr(index+1);
	return moduleName;
}

function putLazyRegistryText(config, text) {
	var rawText = config.rawText;
	if( rawText == null ) {
		rawText = {};
		config.rawText = rawText;
	}
	config.rawText["lazy-registry"] = text;
}


module.exports = {
	ROOT_IMPLICIT_DEPS: ROOT_IMPLICIT_DEPS,
	removePluginsFromName: removePluginsFromName,
	createModulesRegistryText: createModulesRegistryText,
	putLazyRegistryText: putLazyRegistryText
};
