define(["currentModule", "text!./loginPrompt.html", "lib/angular-ui-bootstrap/src/modal/modal"],
function(currentModule, template) {
	"use strict";
	
	currentModule.service("loginPrompt", ["$modal", function($modal) {
		var
			isOpen = false,
			
			opts = {
				backdrop: "static",
				keyboard: false,
				template: template
			};
		
		function promptLogin() {
			isOpen = true;
			var d = $modal.open(opts);
			d.result["finally"](function() {
				isOpen = false;
			});
			return d.result;
		}

		promptLogin.isOpen = function() {
			return isOpen;
		};
		
		return promptLogin;
	}]);
});
