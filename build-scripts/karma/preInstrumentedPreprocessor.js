var path = require("path"),
	fs = require("fs");

createPreInstrumentedPreprocessor.$inject = ["args", "config.preInstrumentedPreprocessor", "config.basePath", "logger", "helper"];
function createPreInstrumentedPreprocessor(args, config, basePath, logger, helper) {
	var STRIP_PREFIX_RE = new RegExp("^" + path.join(basePath, config.stripPrefix).replace(/\\/g, "\\\\"));

	function instrumentedFilePath(file) {
		return path.join(basePath, config.basePath, path.normalize(file.originalPath).replace(STRIP_PREFIX_RE, ""));
	}
	
	return function(content, file, done) {
		fs.readFile(instrumentedFilePath(file), {encoding:"utf8"}, function(err, instrumentedContent) {
			if( err ) throw err;
			done(instrumentedContent);
		});
	};
}

module.exports = createPreInstrumentedPreprocessor;
