define(["text!lib/angular-ui-bootstrap/template/modal/backdrop.html","text!lib/angular-ui-bootstrap/template/modal/window.html","currentModule"],
function(backdropTemplate,windowTemplate,currentModule) {
	"use strict";
	currentModule.run(["$templateCache", function($templateCache) {
		$templateCache.put("template/modal/backdrop.html", backdropTemplate);
		$templateCache.put("template/modal/window.html", windowTemplate);
	}]);
});
