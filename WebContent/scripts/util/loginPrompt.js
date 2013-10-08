define(["deferredInjector", "text!./loginPrompt.html", "jquery",
	"lib/angular-ui-bootstrap/dialog"
], function(deferredInjector, template, $) {
	"use strict";
	
	var
		isOpen = false,
		
		opts = {
			dialogFade: true,
			backdrop: true,
			keyboard: false,
			backdropClick: false,
			template: template,
			controller: ["$scope", "dialog", LoginCtrl]
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
				var d = inj.get("$dialog").dialog(opts);
				d.open().then(
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
	
	function LoginCtrl($scope, dialog) {
		$scope.close = function(result) {
			dialog.close(result);
		};
	}
	
	return promptLogin;
});
