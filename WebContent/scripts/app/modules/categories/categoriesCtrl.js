define([
	"jquery", "app/shared/dao/categoriesDao", "util/viewUtils", "util/returnService", "text!./deleteTemplate.html",
	"templateCache!./categoriesTemplate.html", "./categoryDirective",
	"lib/angular-ui-bootstrap/src/modal/modal"
],
function($, categoriesDao, viewUtils, returnSvc, templateDelete) {
	"use strict";
	
	var ADD_LABEL = "Add", RENAME_LABEL = "Rename", opts;
	
	opts = {
		backdrop: "static",
		keyboard: false,
		template: templateDelete
	};
	
	EditCategoriesCtrl.$inject = ["$scope", "$q", "$modal"];
	function EditCategoriesCtrl($scope, $q, $modal) {
		
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
			opts.controller = ["$scope", "$modalInstance", DeleteCtrl];
			var d = $modal.open(opts);
			d.result.then(function(result) {
				if( result === "yes" ) {
					categoriesDao.deleteCategory(c);
				}
			});
			
			function DeleteCtrl($scope, $modalInstance) {
				$scope.category = c;
				$scope.close = function(result) {
					$modalInstance.close(result);
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
	
	return EditCategoriesCtrl;
});
