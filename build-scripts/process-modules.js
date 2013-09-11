// process modules
var
	util = require("util"),
	crypto = require("crypto"),
	shared = require("./shared"),
	
	LIB_LAZY = "lazy";

function processModules(modules) {
	var
		modulesArray = modulesToArray(modules),
		depsArray = depsToArray(modules),
		depsUsageArray = depsUsage(depsArray,modulesArray),
		bundles = extractBundles(depsArray, depsUsageArray);
	addBundleDeps(modules,bundles);
	flagBundlesIncludedByCommonParentModule(modules,bundles);
	return {
		modulesArray: modulesArray,
		modules: modules,
		bundles: bundles
	};
}

function modulesToArray(m) {
	var ret = [], x;
	for( x in m ) {
		if( !m.hasOwnProperty(x) ) continue;
		m[x].index = ret.length;
		m[x].name = x;
		ret.push(m[x]);
	}
	return ret;
}

function depsToArray(m) {
	var ret = [], x;
	if( util.isArray(m) ) {
		for( x=0; x < m.length; x++ ) {
			extractUniqueDepsToRet(m[x]);
		}
	}
	else {
		for( x in m ) {
			if( !m.hasOwnProperty(x) ) continue;
			extractUniqueDepsToRet(m[x]);
		}
	}
	return ret;
	
	function extractUniqueDepsToRet(module) {
		var i, d = module.deps;
		for( i=0; i < d.length; i++ ) {
			if( ret.indexOf(d[i]) < 0 ) ret.push(d[i]);
		}
	}
}

function depsUsage(depsArray,modulesArray) {
	var i, j, val, ret = [];
	for( i=0; i < depsArray.length; i++ ) {
		val = new Array(modulesArray.length);
		for( j=0; j < modulesArray.length; j++ ) {
			if( modulesArray[j].deps.indexOf(depsArray[i]) >= 0 ) val.push("1");
			else val.push("0");
		}
		val = val.join("");
		ret.push(val);
	}
	return ret;
}

/*
	// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
	function generateUUID() {
		var d = new Date().getTime();
//		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		});
		return uuid;
	};
*/
function extractBundles(depsArray, depsUsageArray) {
	var i, j, ret, curBundle;
	
	depsUsageArray = depsUsageArray.slice(0); // copy so we can modify
	ret = {
		depsToBundleMap: {},
		bundlesArray: []
	};
	
	for( i=0; i < depsUsageArray.length; i++ ) {
		if( depsUsageArray[i] === false ) continue;
		curBundle = {
			id: null,
			deps: [depsArray[i]],
			exclusive: isUsageExclusive(depsUsageArray[i])
		};
		ret.depsToBundleMap[depsArray[i]] = curBundle;
		for( j=i+1; j < depsUsageArray.length; j++ ) {
			if( depsUsageArray[i] === depsUsageArray[j] ) {
				ret.depsToBundleMap[depsArray[j]] = curBundle;
				curBundle.deps.push(depsArray[j]);
				depsUsageArray[j] = false;
			}
		}
		curBundle.deps.sort(); // so that the bundleId will be consistent
		curBundle.id = makeBundleId(curBundle);
		ret.bundlesArray.push(curBundle);
	}
	
	return ret;
	
	function makeBundleId(b) {
		var md5 = crypto.createHash("md5"), i;
		for( i=0; i < b.deps.length; i++ ) {
			md5.update(b.deps[i]);
		}
		return md5.digest("hex");
	}
}

function isUsageExclusive(usage) {
	var i, foundOne=false;
	for( i=0; i < usage.length; i++ ) {
		if( usage.charAt(i) === "1" ) {
			if( foundOne ) return false;
			foundOne = true;
		}
	}
	return true;
}

function addBundleDeps(modules,bundles) {
	var x, m;
	
	for( x in modules ) {
		if( !modules.hasOwnProperty(x) ) continue;
		m = modules[x];
		makeBundleDepsAndExcludedDeps(m);
	}
	
	function makeBundleDepsAndExcludedDeps(module) {
		var i, bundle, bundleDeps = [], excludedDeps = [], deps = module.deps.slice(0);
		for( i=0; i < deps.length; i++ ) {
			if( deps[i] === false ) continue;
			bundle = bundles.depsToBundleMap[deps[i]];
			if( !bundle.exclusive ) pushAll(excludedDeps, bundle.deps);
			bundleDeps.push(bundle);
			excludeDepsFromSameBundle(bundle,deps);
		}
		module.bundleDeps = bundleDeps;
		if( module.parents.length > 0 ) excludedDeps.push(LIB_LAZY);
		module.excludedDeps = excludedDeps;
	}
	
	function excludeDepsFromSameBundle(bundle,deps) {
		var i, j;
		for( i=0; i < bundle.deps.length; i++ ) {
			for( j=0; j < deps.length; j++ ) {
				if( bundle.deps[i] === deps[j] ) {
					deps[j] = false;
					break;
				}
			}
		}
	}
	
	function pushAll(a,b) {
		for( var i=0; i < b.length; i++ ) a.push(b[i]);
	}
}

/**
 * If a bundle is referenced by more than one modules, it is marked as
 * non-exclusive. If however one module that references the bundle is a
 * common parent of all the other modules that reference it, the bundle
 * should be statically included in the parent.
 */
function flagBundlesIncludedByCommonParentModule(modules,bundles) {
	var
		 bundleToModule = extractBundleToModuleMap(modules),
		 bundleMap = extractBundleMap(bundles.bundlesArray),
		 moduleAncestors = {},
		 modulesArray, x, commonAncestor;
	
	for( x in bundleToModule ) {
		if( !bundleToModule.hasOwnProperty(x) ) continue;
		modulesArray = bundleToModule[x];
		commonAncestor = extractCommonAncestor(modulesArray);
		if( commonAncestor != null ) {
			includeBundleInModule(bundleMap[x], commonAncestor);
		}
	}
	
	
	function extractBundleToModuleMap(modules) {
		var x, i, ret = {}, bundleDeps, dependentModules;
		for( x in modules ) {
			if( !modules.hasOwnProperty(x) ) continue;
			bundleDeps = modules[x].bundleDeps;
			for( i=0; i < bundleDeps.length; i++ ) {
				if( bundleDeps[i].exclusive ) continue;
				dependentModules = ret[bundleDeps[i].id];
				if( dependentModules == null ) {
					dependentModules = [];
					ret[bundleDeps[i].id] = dependentModules;
				}
				dependentModules.push(modules[x]);
			}
		}
		return ret;
	}
	
	function extractBundleMap(bundlesArray) {
		var i, ret = {};
		for( i=0; i < bundlesArray.length; i++ ) {
			ret[bundlesArray[i].id] = bundlesArray[i];
		}
		return ret;
	}
	
	function findAllAncestors(module) {
		var ret = moduleAncestors[module.name];
		if( ret == null ) {
			ret = [];
			addParents(ret, module);
			moduleAncestors[module.name] = ret;
		}
		return ret;
		
		function addParents(ret, module) {
			var i, j, grandParents;
			for( i=0; i < module.parents.length; i++ ) {
				if( ret.indexOf(module.parents[i]) < 0 ) {
					ret.push(module.parents[i]);
					grandParents = findAllAncestors(modules[module.parents[i]]);
					for( j=0; j < grandParents.length; j++ ) {
						if( ret.indexOf(grandParents[j]) < 0 ) ret.push(grandParents[j]);
					}
				}
				
			}
		}
	}
	
	function isAncestor(potentialAncestorModuleName, module) {
		if( typeof(module) === "string" ) module = modules[module];
		var a = findAllAncestors(module);
		return a.indexOf(potentialAncestorModuleName) >= 0;
	}
	
	function extractCommonAncestor(modulesArray) {
		var i, j, foundNonAncestor;
		for( i=0; i < modulesArray.length; i++ ) {
			foundNonAncestor = false;
			for( j=0; j < modulesArray.length; j++ ) {
				if( i !== j ) {
					if( !isAncestor(modulesArray[i].name, modulesArray[j]) ) {
						foundNonAncestor = true;
						break;
					}
				}
			}
			if( !foundNonAncestor ) {
				return modulesArray[i];
			}
		}
		return null;
	}
	
	function includeBundleInModule(bundle, module) {
		var i, index, newExcludedDeps = [];
		bundle.includedIn = module.name;
		// re-enable bundle deps in module
		for( i=0; i < bundle.deps.length; i++ ) {
			index = module.excludedDeps.indexOf(bundle.deps[i]);
			module.excludedDeps[index] = false
		}
		for( i=0; i < module.excludedDeps.length; i++ ) {
			if( module.excludedDeps[i] === false ) continue;
			newExcludedDeps.push(module.excludedDeps[i]);
		}
		module.excludedDeps = newExcludedDeps;
	}
}


module.exports = processModules;
