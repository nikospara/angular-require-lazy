module.exports = function(config) {
	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: [
			'jasmine',
			'requirejs',
			'angular-require-lazy'
		],
		
		plugins: [
			'karma-phantomjs-launcher',
			'karma-jasmine',
			'karma-requirejs',
			// TODO Add our RequireJS configuration by using an inlined plugin, see http://karma-runner.github.io/0.12/config/plugins.html
			{
				'framework:angular-require-lazy': ['factory', (function() {
					function alrPlugin(files) {
						files.unshift({pattern: __dirname + '/WebTests/scripts/mocks/require-cfg.js', included: true, served: true, watched: false});
						files.unshift({pattern: __dirname + '/WebContent/scripts/require-cfg.js', included: true, served: true, watched: false});
					}
					alrPlugin.$inject = ['config.files'];
					return alrPlugin;
				})()]
			}
		],

		// list of files / patterns to load in the browser
		files: [
			'WebTests/scripts/test-main.js',
			{pattern: 'WebContent/scripts/lib/jquery/dist/jquery.js', included: true},
			{pattern: 'WebContent/scripts/**/*.html', included: false},
			{pattern: 'WebContent/scripts/*.js', included: false},
			{pattern: 'WebContent/scripts/app/**/*.js', included: false},
			{pattern: 'WebContent/scripts/util/**/*.js', included: false},
			{pattern: 'WebContent/scripts/lib/**/*.js', included: false},
			{pattern: 'WebTests/scripts/**/*.js', included: false}
		],

		// list of files to exclude
		exclude: [
			'WebContent/scripts/lib/**/*.spec.js'
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {

		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
//		browsers: ['Firefox'],
		browsers: ['PhantomJS'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false
	});
};
