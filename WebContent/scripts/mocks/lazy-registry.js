define(['lazy','require','promise-adaptor'], function(lazy,require,promiseAdaptor) {
	var moduleList = [];
	function registerModule(m) {
		moduleList.push(m);
		lazy.registerModule(m);
	}
	registerModule(new lazy.Stub('app/modules/categories/main',require,null,null,{"angular-routes":[{"path":"/categories","controller":"EditCategoriesCtrl","template":"app/modules/categories/categoriesTemplate.html","display":"Categories","weight":100}]}));
	registerModule(new lazy.Stub('app/modules/expenses/main',require,null,null,{"angular-routes":[{"path":"/expenses","controller":"ExpensesCtrl","template":"app/modules/expenses/expensesTemplate.html","display":"Expenses","weight":200}]}));
	registerModule(new lazy.Stub('app/modules/index/main',require,null,null,{"angular-routes":[{"path":"/index","controller":"IndexCtrl","template":"app/modules/index/indexTemplate.html","display":"Home","weight":0}]}));
	return {
		getModules: function() { return moduleList; },
		getModule: lazy.getModule,
		get: function(moduleName) {
			var m = lazy.getModule(moduleName);
			if( m != null ) return m.get();
			else {
				var d = promiseAdaptor.makeDeferred();
				d.reject('does not exist');
				return promiseAdaptor.makePromise(d);
			}
		}
	};
});
