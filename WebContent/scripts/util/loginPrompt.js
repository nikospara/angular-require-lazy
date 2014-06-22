define(["text!./loginPrompt.html", "$injector", "lib/angular-ui-bootstrap/src/modal/modal"],
function(template, $injector) {
	"use strict";
	
	var
		isOpen = false,
		
		opts = {
			backdrop: "static",
			keyboard: false,
			template: template,
			controller: ["$scope", "$modalInstance", LoginCtrl]
		},
	
		$q;
	
//alert("$injector in loginPrompt: ");
//alert($injector);
//	$q = $injector.get("$q");
	
	function promptLogin() {
		if( !$q ) $q = $injector.get("$q");
		var ret = $q.defer();
		isOpen = true;
		var d = $injector.get("$modal").open(opts);
		d.result.then(
			function(result) { isOpen = false; ret.resolve(result); },
			function(err) { isOpen = false; ret.reject(err); }
		);
		return ret.promise;
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
