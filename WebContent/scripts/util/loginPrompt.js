define(["deferredInjector", "text!./loginPrompt.html", "jquery",
	"lib/angular-ui-bootstrap/src/modal/modal"
], function(deferredInjector, template, $) {
	"use strict";
	
	var
		isOpen = false,
		
		opts = {
			backdrop: "static",
			keyboard: false,
			template: template,
			controller: ["$scope", "$modalInstance", LoginCtrl]
		};
	
	function promptLogin() {
		var ret = $.Deferred();
		isOpen = true;
		deferredInjector.get().then(
			function(inj) {
// Caching the dialog results in resolved promise when called a second time (TODO Verify this)
//				if( d == null ) {
//					d = inj.get("$dialog").dialog(opts);
//				}
				var d = inj.get("$modal").open(opts);
				d.result.then(
					function(result) { isOpen = false; ret.resolve(result); },
					function(err) { isOpen = false; ret.reject(err); }
				);
				deferredInjector.applySafeWith(inj);
			},
			function(err) { ret.reject(err); }
		);
		return ret.promise();
	}
	promptLogin.isOpen = function() {
		return isOpen;
	};
	
	function LoginCtrl($scope, $modalInstance) {
		$scope.close = function(result) {
			$modalInstance.close(result);
		};
	}
	
	return promptLogin;
});
