define(["injector", "text!./login-prompt.html", "jquery",
	"lib/angular-ui-bootstrap/dialog"
], function(injector, template, $) {
	"use strict";
	
	var
//		d, isOpen = false,
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
		injector.get().then(
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
				injector.applySafeWith(inj);
			},
			function(err) { ret.reject(err); }
		);
		return ret.promise();
	}
	promptLogin.isOpen = function() {
//		return d != null && d.isOpen();
		return isOpen;
	};
	
	function LoginCtrl($scope, dialog) {
		$scope.close = function(result) {
			dialog.close(result);
		};
	}
	
	return promptLogin;
});
