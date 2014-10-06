define(["angular", "util/viewUtils", "currentModule", "text!./categoryTemplate.html", "app/shared/dao/userDao"],
function(angular, viewUtils, currentModule, template) {
	"use strict";
	
	currentModule.directive("category", ["userDao", function(userDao) {
		return {
			restrict: "A",
			template: template,
			replace: true,
			scope: {
				category: "=",
				edit: "&",
				remove: "&"
			},
			link: function(scope, element, attrs) {
				angular.extend(scope, {
					defaultCategoryId: null,
					editCb: editCb,
					removeCb: removeCb
				});
				
				function editCb(event,c) {
					viewUtils.preprocessAnchorEvt(event);
					scope.edit({c:c});
				}
				
				function removeCb(event,c) {
					viewUtils.preprocessAnchorEvt(event);
					scope.remove({c:c});
				}
				
				(function initDefaultCategoryId() {
					return userDao.getUserData().then(function(userData) {
						scope.defaultCategoryId = userData.defaultCategoryId;
					});
				})();
			}
		};
	}]);
});
