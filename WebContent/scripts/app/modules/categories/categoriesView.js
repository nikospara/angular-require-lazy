define([
	"jquery", "app/shared/dao/categoriesDao", "util/viewUtils", "util/returnService",
	"text!./categoriesTemplate.html", "text!./deleteTemplate.html"
],
function($, categoriesDao, viewUtils, returnSvc, template, templateDelete) {
	"use strict";
	
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
		
		function selectCategoryForEdit(c) {
			if( c.key == null ) return;
			$scope.selectedCategoryForEdit = c;
			$scope.form.name = c.name;
			$scope.hasCancel = true;
			$scope.executeLabel = RENAME_LABEL;
		}
		
		function deleteCategory(c) {
			if( c.key == null ) return;
			opts.controller = ["$scope", "dialog", DeleteCtrl];
			var d = $dialog.dialog(opts);
			d.open().then(function(result) {
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
