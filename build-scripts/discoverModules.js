var path = require("path"), fs = require("fs");

function discoverModules() {
	var modulesDir = path.normalize(path.join(__dirname, "..", "WebContent", "scripts", "app", "modules")),
		filenames = fs.readdirSync(modulesDir),
		stat, i, res = [];
	for( i=0; i < filenames.length; i++ ) {
		stat = fs.statSync(path.join(modulesDir, filenames[i], "main.metadata.json"));
		if( stat != null && stat.isFile() ) {
			res.push("app/modules/" + filenames[i]);
		}
	}
	return res;
//	return ["app/modules/index","app/modules/categories","app/modules/expenses"];
}

module.exports = discoverModules;
