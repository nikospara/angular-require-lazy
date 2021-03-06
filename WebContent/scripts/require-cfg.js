var require = {
	baseUrl: "scripts",
	
	paths: {
		"angular": "lib/angular/angular"
	},
	
	config: {
		
	},
	
	map: {
		"*": {
			"text": "lib/requirejs-text/text",
			// this must match the libLazy property in build-scripts/options-grunt.js
			"lazy": "lib/require-lazy/lazy",
			"lazy-builder": "lib/require-lazy/lazy-builder",
			"promise-adaptor": "util/lib/angular-require-lazy/promiseAdaptorAngular",
			"currentModule": "util/lib/angular-require-lazy/currentModule",
			"templateCache": "util/lib/angular-require-lazy/templateCache",
			"ngLazy": "util/lib/angular-require-lazy/ngLazy",
			"ngLazyBuilder": "util/lib/angular-require-lazy/ngLazyBuilder"
		}
	},
	
	shim: {
		"globals": {
			exports: "globals"
		},
		"angular": {
			exports: "angular"
		},
		"lib/angular-ui-bootstrap/src/transition/transition": {
			deps: ["angular"]
		},
		"lib/angular-ui-bootstrap/src/collapse/collapse": {
			deps: ["angular", "lib/angular-ui-bootstrap/src/transition/transition"]
		},
		"lib/angular-ui-bootstrap/src/modal/modal": {
			deps: ["angular","util/modalTemplates", "lib/angular-ui-bootstrap/src/transition/transition"]
		},
		"lib/angular-route/angular-route": {
			deps: ["angular"]
		},
		"lib/angular-resource/angular-resource": {
			deps: ["angular"]
		}
	}
};
