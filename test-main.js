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
		require(["angular", "angular-mocks", "mocks/test-main", "util/lib/angular-require/lazyAngularUtils", "currentModule", "$injector"],
		function(angular, angularMocks, main, lazyAngularUtils, currentModule, $injector) {
			// dynamically load all test files
			require(allTestFiles, function() {
				var j;
				
				main.config(lazyAngularUtils.cacheInternals);
				currentModule.resolveWith(main);
//console.log("test-main: resolved with (main)");
//console.log("test-main: ", main);
//console.log("test-main: ",main._invokeQueue);
//console.log("test-main: ",main._invokeQueue[2][1], main._invokeQueue[2][2]);
				lazyAngularUtils.makeLazyAngular();
				j = angular.bootstrap(document, [main.name]);
				angular.extend($injector, j);
//console.log("test-main: ","AMD injector extended");
//console.log("CTRL: ", j.get("EditCategoriesCtrl"));
//$injector.get("$rootScope").$digest();
			
				// we have to kickoff jasmine, as it is asynchronous
				window.__karma__.start();
			});
		});
	}
});
