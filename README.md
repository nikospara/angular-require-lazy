angular-require-lazy
====================

An example-experimental application for mixing [AngularJS](http://angularjs.org/), [RequireJS](http://requirejs.org/) and [require-lazy](https://github.com/nikospara/require-lazy).

Changes
-------

- (2014/03/08) 
    1. Angular's `$injector` is now exposed as AMD module; it is no longer a promise.
    2. Enabled `module.config()` for lazy Angular modules. THIS IS UNTESTED AND EXPERIMENTAL FOR THE TIME BEING.
- (2013/10/24) Changed the framework to be more Angular-like. Kept old framework in `angular-plugin` branch.
- (2013/09/15) Added a lazy directive example, see `scripts/app/modules/categories/category-directive.js`.

Preface
-------

This is an example application for keeping track of personal/family expenses.
This is still work in progress and open for discussion. Its main purpose is to demonstrate the mixing of Angular and require-lazy,
not to be functionaly complete, at least at this stage.

Requirements
------------

1. Node.js to run the mock server and the build scripts. The `node` executable must be in `PATH` for the build scripts to work.
2. A browser with decent debugging and network traffic analysis capabilities (e.g. latest Firefox+Firebug).

Run
---

1. Clone the GIT repository
2. (`npm install express` if using Option 1 below) or (`npm instal` if using Option 2 below)
3. `node app.js` to run the server
4. Hit `http://localhost:8110/app.html`

Build and run
-------------

(Steps 1 & 2 above are prerequisites)

### Option 1: With standalone scripts

This option is deprecated and will probably be removed in the future in favor of Grunt.

1. `cd build-scripts`
2. `./bootstrap.sh` or `bootstrap.bat` to compile bootstrap
3. `node build.js`
4. (make sure server is running &rarr; `node app.js`)
5. Hit `http://localhost:8110/app-built.html`

### Option 2: Using Grunt (PREFERRED)

This option depends on require-lazy-grunt, which is not yet published. You will have to clone it and link it with npm:

	(cd to the directory of require-lazy-grunt)
	npm link
	(cd to the directory of angular-require-lazy)
	npm link require-lazy-grunt

1. Make sure `grunt-cli` is installed and the `grunt` command is in PATH.
2. `grunt` to compile everything
3. (make sure server is running &rarr; `node app.js`)
4. Hit `http://localhost:8110/app-built.html`

What happens?
-------------

This application is set up to load only the scripts it needs for the current view. When the view changes, only the scripts necessary
for the new view are loaded.

To observe this behaviour open Firebug to the network tab, then load the application.
Observe the scripts being loaded: `ng-grid-XXX.js` is not needed and not loaded.
Navigate to the "Expenses" view (top menu). `ng-grid` and the application scripts required for this view are loaded just in time.

The scripts needed for each view are packed together into "bundle" files, when the application is built. So for the expenses view
`app/modules/expenses/main.js`, `app/modules/expenses/expenses-view.js`, `app/modules/expenses/expenses-template.html`, and
`ng-grid-2.0.7-debug.js` are bundled into one script file (i.e. `expenses-built.js`) and the file is loaded with a cache-breaking
hash (the `?v=e1974633ea3017db85324f449bc6479f` request parameter). This process is using [r.js](http://requirejs.org/docs/optimization.html)
and [require-lazy](https://github.com/nikospara/require-lazy).

The noteworthy points are:

- AngularJS modules can be lazy loaded. Even pure Angular modules, like the demonstrated case with `ngGrid` (see the "Expenses" view).
- Directives can be lazy loaded too, using the `currentModule` AMD module (see `scripts/app/modules/categories/category-directive.js`).
- There is a "module" discovery mechanism: any directory under `app/modules/` that contains a `main.js` script and a `main.metadata.json`
  can automatically appear in the menu (see `build-scripts/discoverModules.js`, this is used both by the build process and by the server).
- The application is split into bundles automatically using `r.js` standard configuration and require-lazy;
  no further configuration is needed.

How?
----

- The providers (e.g. `$controllerProvider`, `$compileProvider`) are captured from a `config` function called from `bootstrap.js`.
  This function is defined in `scripts/lib/angular-require/lazyAngularUtils.js` (`cacheInternals()`).
- After bootstrapping, we replace Angular's `module()` method with a proxy that can handle lazy loaded modules (see `makeLazyAngular()`
  and `makeLazyModule()` in `scripts/lib/angular-require/lazyAngularUtils.js`).
- The injector is captured and provided as a promise (`scripts/lib/angular-require/deferredInjector.js`).
- Templates can be loaded as text through a RequireJS plugin (as `"templateCache!path/to/my.html"`) and registered with Angular's
  `$templateCache` with the correct name (here `"path/to/my.html"`).
- The developer uses the lazy loading mechanism by the special AMD module `currentModule`. This is a proxy to the currently loading
  Angular module, providing the familiar API (some methods are still under development).
- See any view module under `WebContent/scripts/app/modules/` to see the implementation of a view; this is the actual code a developer would
  write, i.e. application code, not framework code.

Why?
----

I believe both RequireJS and AngularJS are very useful libraries/frameworks. I am surprized that Angular does not cooperate
smoothly with RequireJS out of the box, so I have been experimenting with this implementation.

I believe this can be further improved and I hope it will contribute to a solution brdging the worlds of AMD and Angular modules.

The providers capturing technique (implemented in `scripts/lib/angular-require/lazyAngularUtils.js`)
is based heavily on [angularjs-requirejs-lazy-controllers](https://github.com/matys84pl/angularjs-requirejs-lazy-controllers).
