define([
	"jquery", "app/shared/dao/categoriesDao", "app/shared/dao/userDao", "util/view-utils", "util/return-service",
	"text!./categories-template.html", "text!./delete-template.html"
],
function($, categoriesDao, userDao, viewUtils, returnSvc, template, templateDelete) {
	"use strict";
/*
angular.module("app/main").animation("drop-in", function() {
	return {
		setup : function(element) {
			var memo = element.height();
			element.css("height","0px");
console.log(memo);
			return memo;
		},
		start : function(element, done, memo) {
			element.animate({height:memo+"px"}, function() {
				done();
			});
		}
	};
});
*/
	
	var ADD_LABEL = "Add", RENAME_LABEL = "Rename", opts;
	
	opts = {
		dialogFade: true,
		backdrop: true,
		keyboard: false,
		backdropClick: false,
		template: templateDelete
	};
	
	function EditCategoriesCtrl($scope, $q, $dialog) {
		
		var lastAddedCategoryKey;
		
		$.extend($scope, {
			categories: categoriesDao.fetchCachedForCurrentUser(),
			defaultCategoryId: initDefaultCategoryId(),
			form: {
				name: null
			},
			executeLabel: initExecuteLabel(),
			execute: execute,
			cancel: cancel,
			selectedCategoryForEdit: initSelectedCategoryForEdit(),
			selectCategoryForEdit: selectCategoryForEdit,
			hasCancel: initHasCancel(),
			deleteCategory: deleteCategory,
			isPushed: initIsPushed(),
			doReturn: doReturn
		});
		
		function execute(event) {
console.log($scope);
console.log("FORM: %o", $scope.form);
			// TODO execute - distinguish execution cases (add, update)
			if( $scope.selectedCategoryForEdit != null ) updateCategory();
			else addCategory();
		}
		
		function updateCategory() {
			var oldName = $scope.selectedCategoryForEdit.name;
			$scope.selectedCategoryForEdit.name = $scope.form.name;
			categoriesDao.updateCategory($scope.selectedCategoryForEdit,
				function success() {
					cancel();
				},
				function failure() {
					$scope.selectedCategoryForEdit.name = oldName;
				}
			);
		}
		
		function addCategory() {
			var newcat = categoriesDao.addCategory($scope.form.name);
			newcat.$then(function() {
				lastAddedCategoryKey = newcat.key;
			});
			newcat.$pending = true;
			$scope.form.name = null;
			$scope.editCategoriesForm.$setPristine();
		}
		
		function cancel(event) {
			viewUtils.preprocessAnchorEvt(event);
			$scope.selectedCategoryForEdit = null;
			$scope.form.name = null;
			$scope.hasCancel = false;
			$scope.executeLabel = ADD_LABEL;
		}
		
		function selectCategoryForEdit(event,c) {
			viewUtils.preprocessAnchorEvt(event);
			if( c.key == null ) return;
			$scope.selectedCategoryForEdit = c;
			$scope.form.name = c.name;
			$scope.hasCancel = true;
			$scope.executeLabel = RENAME_LABEL;
		}
		
		function deleteCategory(event,c) {
			viewUtils.preprocessAnchorEvt(event);
			if( c.key == null ) return;
			opts.controller = ["$scope", "dialog", DeleteCtrl];
			var d = $dialog.dialog(opts);
			d.open().then(function(result) {
console.log(result, c);
				// TODO Delete
				if( result === "yes" ) {
					categoriesDao.deleteCategory(c);
				}
			});
			
			function DeleteCtrl($scope, dialog) {
				$scope.category = c;
				$scope.close = function(result) {
					dialog.close(result);
				};
			}
		}
		
		function initDefaultCategoryId() {
//			var d = $q.defer();
//			userDao.getUserData().done(function(userData) {
//				d.resolve(userData.defaultCategoryId);
//			});
//			return d.promise;
// ALT - BETTER:
			return userDao.getUserData().then(function(userData) {
				return userData.defaultCategoryId;
			});
		}
		
		function initHasCancel() {
			return false;
		}
		
		function initSelectedCategoryForEdit() {
			return null;
		}
		
		function initExecuteLabel() {
			return ADD_LABEL;
		}
		
		function initIsPushed() {
			return returnSvc.isPushed();
		}
		
		function doReturn() {
			returnSvc.doReturn({categoryKey: lastAddedCategoryKey});
		}
	}
	
	return {
		controller: ["$scope", "$q", "$dialog", EditCategoriesCtrl],
		template: template
	};
});
