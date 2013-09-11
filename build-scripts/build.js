// this is an example build script; several actions are for demonstration purposes
var
	fs = require("fs"),
	findDeps = require("./find-deps"),
	processModules = require("./process-modules"),
	buildAll = require("./build-all"),
	options = require("./options.js").config,
	config = require("./app.build.json");

findDeps(options, config, function(modules) {
	var pmresult = processModules(modules);
	var util = require("util"), path = require("path");
	buildAll(pmresult, options, config, function() {
		fs.writeFileSync(path.join(options.outputBaseDir, "modules.js"), util.inspect(modules,{depth:null,colors:false}));
		fs.writeFileSync(path.join(options.outputBaseDir, "bundles.js"), util.inspect(pmresult.bundles,{depth:null,colors:false}));
		console.log("success");
	});
});
