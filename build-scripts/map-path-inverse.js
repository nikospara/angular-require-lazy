var inversePaths,
	util = require("util");

function mapPathInverse(path) {
	if( inversePaths != null ) path = mapPathInverseInner(path);
	return path;
}

function mapPathInverseInner(path) {
	var x;
	for( x in inversePaths ) {
		if( !inversePaths.hasOwnProperty(x) ) continue;
		if( path.indexOf(x) === 0 ) {
			if( path.length === x.length ) return inversePaths[x];
			else if( path[x.length] === "/" ) return inversePaths[x]+path.substring(x.length);
		}
	}
	return path;
}

mapPathInverse.setMainConfig = function(mainConfig) {
	var x, i;
	if( mainConfig && mainConfig.paths ) {
		inversePaths = {};
		for( x in mainConfig.paths ) {
			if( !mainConfig.paths.hasOwnProperty(x) ) continue;
			if( util.isArray(mainConfig.paths[x]) ) {
				for( i=0; i < mainConfig.paths[x].length; i++ ) {
					inversePaths[mainConfig.paths[x][i]] = x;
				}
			}
			else inversePaths[mainConfig.paths[x]] = x;
		}
	}
};


module.exports = mapPathInverse;
