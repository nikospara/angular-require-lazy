define(["jquery", "app/shared/dao/userDao", "util/viewUtils", "currentModule", "text!./categoryTemplate.html"],
function($, userDao, viewUtils, currentModule, template) {
	"use strict";
	
	currentModule.directive("category", [function() {
		return {
			template: template,
			replace: true,
			scope: {
				category: "=",
				edit: "&",
				remove: "&"
			},
			link: function(scope, element, attrs) {
				$.extend(scope, {
					defaultCategoryId: initDefaultCategoryId(),
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
				
				function initDefaultCategoryId() {
					return userDao.getUserData().then(function(userData) {
						return userData.defaultCategoryId;
					});
				}
			}
		};
	}]);
});
