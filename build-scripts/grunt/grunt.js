module.exports = function(grunt) {
	grunt.registerMultiTask("instrument", "Instrument with istanbul", function() {
		var istanbul = require("istanbul"),
			instrumenter,
			options,
			instrumenterOptions,
			baselineCollector;
		
		options = this.options({
		});
		
		if( options.baseline ) {
			baselineCollector = new istanbul.Collector();
		}
		
		instrumenterOptions = {
			coverageVariable: options.coverageVariable || "__coverage__",
			embedSource: options.embedSource || false,
			preserveComments: options.preserveComments || false,
			noCompact: options.noCompact || false,
			noAutoWrap: options.noAutoWrap || false,
			codeGenerationOptions: options.codeGenerationOptions,
			debug: options.debug || false,
			walkDebug: options.walkDebug || false
		};
		
		instrumenter = new istanbul.Instrumenter(instrumenterOptions);
		
		this.files.forEach(function(f) {
//console.log(f.src, " -> ", f.dest);
			if( f.src.length !== 1 ) {
				throw new Error("encountered src with length: " + f.src.length + ": " + JSON.stringify(f.src));
			}
			var filename = f.src[0],
				code = grunt.file.read(filename, {encoding: grunt.file.defaultEncoding}),
				result = instrumenter.instrumentSync(code, filename),
				baseline,
				coverage;
			
			if( options.baseline ) {
				baseline = instrumenter.lastFileCoverage();
				coverage = {};
				coverage[baseline.path] = baseline;
				baselineCollector.add(coverage);
			}
			
			grunt.file.write(f.dest, result, {encoding: grunt.file.defaultEncoding});
		});
		
		if( options.baseline ) {
			grunt.file.write(options.baseline, JSON.stringify(baselineCollector.getFinalCoverage()), {encoding: grunt.file.defaultEncoding});
		}
	});
};
