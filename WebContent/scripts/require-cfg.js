require.config({
	baseUrl: "scripts",
	
	paths: {
		"text": "lib/require/text-2.0.5",
		"lazy": "lib/require-lazy/lazy",
		"lazy-builder": "lib/require-lazy/lazy-builder",
		"promise-adaptor": "lib/require-lazy/promise-adaptor-jquery",
		"angular": "lib/angular/angular",
		"i18n": "lib/require/i18n",
		"deferredInjector": "lib/angular-require/deferredInjector",
		"lib/angular/ng-grid": "lib/angular/ng-grid-2.0.7.debug",
		"currentModule": "lib/angular-require/currentModule",
		"templateCache": "lib/angular-require/templateCache"
	},
	
	packages: ["app/main", "app/modules/index", "app/modules/categories", "app/modules/expenses"],
	
	config: {
		
	},
	
	shim: {
		"angular": {
			exports: "angular"
		},
		"lib/jqueryui/jquery.ui.core": {
			deps: ["jquery"]
		},
		"lib/jqueryui/jquery.ui.widget": {
			deps: []
		},
		"lib/jqueryui/jquery.ui.button": {
			deps: ["lib/jqueryui/jquery.ui.core", "lib/jqueryui/jquery.ui.widget"]
		},
		"lib/jqueryui/jquery.ui.tabs": {
			deps: ["lib/jqueryui/jquery.ui.core", "lib/jqueryui/jquery.ui.widget"]
		},
		"lib/jqueryui/jquery.ui.datepicker": {
			deps: ["lib/jqueryui/jquery.ui.core"]
		},
		"lib/jqueryui/jquery.ui.effect": {
			deps: []
		},
		"lib/jqueryui/jquery.ui.effect-slide": {
			deps: ["lib/jqueryui/jquery.ui.effect"]
		},
		"lib/bootstrap/bootstrap-transition": {
			deps: ["jquery"]
		},
		"lib/bootstrap/bootstrap-collapse": {
			deps: ["jquery", "lib/bootstrap/bootstrap-transition"]
		},
		"lib/angular-ui-bootstrap/transition": {
			deps: ["jquery"]
		},
		"lib/angular-ui-bootstrap/collapse": {
			deps: ["jquery", "lib/angular-ui-bootstrap/transition"]
		},
		"lib/angular-ui-bootstrap/dialog": {
			deps: ["jquery", "lib/angular-ui-bootstrap/transition"]
		},
		"lib/angular/angular-route": {
			deps: ["angular"]
		},
		"lib/angular/angular-resource": {
			deps: ["angular"]
		}
	}
});
