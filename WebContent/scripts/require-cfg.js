var require = {
	baseUrl: "scripts",
	
	paths: {
		"text": "lib/requirejs-text/text",
		"lazy": "lib/require-lazy/lazy",
		"lazy-builder": "lib/require-lazy/lazy-builder",
		"promise-adaptor": "lib/require-lazy/promise-adaptor-jquery",
		"angular": "lib/angular/angular",
//		"i18n": "lib/require/i18n",
		"deferredInjector": "util/lib/angular-require/deferredInjector",
		"currentModule": "util/lib/angular-require/currentModule",
		"templateCache": "util/lib/angular-require/templateCache",
		"$injector": "util/lib/angular-require/services/$injector"
	},
	
	config: {
		
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
			deps: ["angular","util/modalTemplates"]
		},
		"lib/angular-route/angular-route": {
			deps: ["angular"]
		}
	}
};
