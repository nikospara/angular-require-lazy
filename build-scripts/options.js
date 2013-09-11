var
	path = require("path"),
	fs = require("fs"),
	discoverModules = require("./discoverModules");

exports.config = {
	basePath: path.normalize(path.join(__dirname, "..", "WebContent")),
	outputBaseDir: path.normalize(path.join(__dirname, "..", "build")),
	discoverModules: discoverModules,
	retrieveMetaForModule: retrieveMetaForModule
};

function retrieveMetaForModule(moduleName) {
	var
		 stat = null,
		 filename = path.normalize(path.join(__dirname, "../WebContent/scripts/", moduleName + "/main.metadata.json")),
		 ret = null;
	try {
		stat = fs.statSync(filename);
	}
	catch(ignore) {}
	if( stat !== null && stat.isFile() ) {
		try {
			ret = fs.readFileSync(filename);
			ret = JSON.parse(ret);
		}
		catch(e) {
			ret = null;
			console.log(e);
		}
	}
	return ret;
}
