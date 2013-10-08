define([
	"jquery", "app/shared/model/Expense", "app/shared/dao/categoriesDao", "app/shared/dao/userDao", "app/shared/dao/expensesDao",
	"text!./expensesTemplate.html",
	// side-effect deps
	"lib/angular/ng-grid"
],
function($, Expense, categoriesDao, userDao, expensesDao, template) {
	"use strict";
	
	function ExpensesCtrl($scope) {
		$.extend($scope, {
			defaultCategoryId: initDefaultCategoryId(),
			expenses: initExpenses(),
			gridOptions: initGridOptions(),
			format: function(x) {
				// TODO
				return x;
			}
		});
		
		function initDefaultCategoryId() {
			return userDao.getUserData().then(function(userData) {
				return userData.defaultCategoryId;
			});
		}
		
		function initExpenses() {
			// TODO Determine month and year, route params
			var ret = expensesDao.fetch(2013);
			return ret;
		}
		
		function initGridOptions() {
			return {
				data: "expenses",
				multiSelect: false,
				keepLastSelected: false,
				//selectedItems: $scope.mySelections,
				//showFooter:true,
				columnDefs: [
					{
						field: "date",
						displayName: "Date",
						width: "****",
//						cellFilter: "date: 'dd/MM/yyyy'"
						cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text>{{ row.getProperty(col.field) | date: "dd/MM/yyyy" }}</span></div>',
					},{
						field: "reason",
						displayName: "Reason",
						width: "*********"
					},{
						field: "amount",
						displayName: "Amount",
						width: "****",
						cellClass: "text-right",
						cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text>{{ format(row.getProperty(col.field)) }}</span></div>',
						headerClass: "text-left"
					},{
						field: "categoryId",
						displayName: "Category",
						width: "*******"
					},{
						field: "special",
						displayName: "",
						width: "*",
						sortable: false
					}
				]
			};
		}
	}
	
	return {
		controller: ["$scope", /*"$q", "$dialog",*/ ExpensesCtrl],
		template: template
	};
});
