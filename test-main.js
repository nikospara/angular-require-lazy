var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var globals = {
	contextPath: "/base"
}, baseUrl;


var pathToModule = function(path) {
	return path.replace(/^\/base\/WebContent\/scripts\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
	if( TEST_REGEXP.test(file) && file.indexOf('/base/WebContent/scripts/lib/') !== 0 ) {
		// Normalize paths to RequireJS module names.
		allTestFiles.push(pathToModule(file));
	}
});


require_config_main.paths["angular-mocks"] = "lib/angular-mocks/angular-mocks";
require_config_main.shim["angular-mocks"] = {
	deps: ["angular"]
};


require.config({
	// Karma serves files under /base, which is the basePath from your config file
	baseUrl: '/base/WebContent/scripts',
	
	paths: require_config_main.paths,
	
	shim: require_config_main.shim,

	map: {
		"*": {
			"lazy-registry": "mocks/lazy-registry"
		},
		"app/shared/dao/expensesDao": {
			"util/resource": "mocks/util/resource"
		}
	},

	callback: function() {
		// we need to duplicate the Angular bootstrapping functionality from bootstrap.js
		require(["angular", "util/lib/angular-require-lazy/bootstrap", "angular-mocks"],
		function(angular, bootstrap) {
			// dynamically load all test files
			require(allTestFiles, function() {
				var main = angular.module("test-main", ["ngMock", "ui.bootstrap.modal"]);
				bootstrap(document, main);
				window.__karma__.start();
			});
		});
	}
});
