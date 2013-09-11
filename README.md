angular-require-lazy
====================

An example-experimental application for mixing [AngularJS](http://angularjs.org/), [RequireJS](http://requirejs.org/) and [require-lazy](https://github.com/nikospara/require-lazy).

Preface
-------

This is an example application for keeping track of personal/family expenses.
This is still work in progress and open for discussion. Its main purpose is to demonstrate the mixing of Angular-Require-Lazy,
not to be functionaly complete, at least at this stage.

Requirements
------------

1. Node.js to run the mock server and the build scripts. The `node` executable must be in `PATH` for the build scripts to work.
2. A browser with decent debugging and network traffic analysis capabilities (e.g. latest Firefox+Firebug).

Run
---

1. Clone the GIT repository
2. `npm instal`
3. `node app.js` to run the server
4. Hit `http://localhost:8110/app.html`

Build and run
-------------

1. `cd build-scripts`
2. `./bootstrap.sh` or `bootstrap.bat` to compile bootstrap
3. `node build.js`
4. (make sure server is running, see step 3 above)
5. Hit `http://localhost:8110/app-built.html`

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

- AngularJS modules are lazy loaded.
- Directives can be lazy loaded too, using `lib/angular-require/lazy-directives` (example coming soon).
- There is a "module" discovery mechanism: any directory under `app/modules/` that contains a `main.js` script and a `main.metadata.json`
  can automatically appear in the menu.
- The application is split into bundles automatically using `r.js` standard configuration and require-lazy;
  no further configuration is needed.

How?
----

- The providers (e.g. `$controllerProvider`, `$compileProvider`) are captured from a `config` function in `scripts/app/bootstrap.js`
  and also used from `scripts/lib/angular-require/route-config.js`, `scripts/lib/angular-require/lazy-directives.js`.
- After bootstraping, the global var `angular` is replaced by our own wrapper that can handle lazy loaded modules (see `makeLazyModule()` in `scripts/app/bootstrap.js`).
- The injector is captured and provided as a promise (`scripts/lib/angular-require/injector.js`)
- AMD modules can be converted to Angular modules (see the `define([...,"angular!app/main/main",...])` in `scripts/app/bootstrap.js`, and
  `scripts/app/main/main.js`).
- See any view module under `WebContent/scripts/app/modules/` to see the implementation of a view; this is the actual code a developer would
  write, i.e. application code, not framework code.

Why?
----

I believe both RequireJS and AngularJS are very useful libraries/frameworks. I am surprized that Angular does not cooperate
smoothly with RequireJS out of the box, so I have been experimenting with this implementation.

I believe this can be further improved and I hope it will contribute to a solution brdging the worlds of AMD and Angular modules.

The providers capturing technique (implemented in `scripts/lib/angular-require/route-config.js` and `scripts/lib/angular-require/lazy-directives.js`)
is based heavily on [angularjs-requirejs-lazy-controllers](https://github.com/matys84pl/angularjs-requirejs-lazy-controllers).
