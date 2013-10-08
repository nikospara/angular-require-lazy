define(["angular", "./indexView"], function(angular, indexView) {
	"use strict";
	
	var m = angular.module("index",[]);
	
	m.controller("IndexCtrl", indexView.controller);
	
	m.run(["$templateCache", function($templateCache) {
		$templateCache.put("virtual-template/index.html", indexView.template);
	}]);
	
	return m;
});
