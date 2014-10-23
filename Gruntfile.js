module.exports = function(grunt) {
	var options = require("./build-scripts/options-grunt.js"),
		config = require("./build-scripts/app.build-grunt.json");
	
	grunt.initConfig({
		instrument: {
			sources: {
				files: [{
					expand: true,
					cwd: "WebContent/",
					src: ["scripts/app/**/*.js", "scripts/util/**/*.js"],
					dest: "build-coverage/instrumented"
				}],
				options: {
					baseline: "build-coverage/baseline.json"
				}
			}
		},
		copy: {
			images: {
				expand: true,
				cwd: "WebContent/css/",
				src: ["images/**"],
				dest: "build/css/"
			}
		},
		less: {
			compile: {
				options: {
					yuicompress: true
				},
				files: {
					"build/css/css/style.css": "WebContent/css/style.less"
				}
			}
		},
		require_lazy_grunt: {
			options: {
				buildOptions: options,
				config: config,
				callback: function(modules, pmresult) {
					// This callback is optional; included here just for demonstration purposes.
					var fs = require("fs"), util = require("util"), path = require("path");
					fs.writeFileSync(path.join(options.outputBaseDir+"-stats", "modules.js"), "angular.module(\"app\").value(\"modules\"," + util.inspect(modules,{depth:null,colors:false}) + ");");
					fs.writeFileSync(path.join(options.outputBaseDir+"-stats", "bundles.js"), "angular.module(\"app\").value(\"bundles\"," + util.inspect(pmresult.bundles,{depth:null,colors:false}) + ");");
				}
			}
		},
		karma: {
			options: {
				configFile: "karma.conf.js"
			},
			single: {
				singleRun: true,
				reporters: "dots"
			},
			coverage: {
				singleRun: true,
				configFile: "karma-coverage.conf.js"
			}
		},
		clean: ["build/*","build-coverage/*"]
	});
	
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("require-lazy-grunt");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-karma");
	grunt.loadTasks("build-scripts/grunt");
	
	grunt.registerTask("default", ["less:compile","copy:images","require_lazy_grunt"]);
	grunt.registerTask("test", ["karma:single"]);
	grunt.registerTask("coverage", ["instrument","karma:coverage"]);
};
