define([
	"angular", "app/shared/model/Expense", "ngLazy!./chartPopupModule",
	// side-effect deps
	"app/shared/dao/userDao", "app/shared/dao/expensesDao", "templateCache!./expensesTemplate.html", "lib/ng-grid-bower/ng-grid", "lib/angular-ui-bootstrap/src/modal/modal"
],
function(angular, Expense, chartPopupModule) {
	"use strict";
	
	ExpensesCtrl.$inject = ["$scope", "expensesDao", "userDao", "$injector"];
	function ExpensesCtrl($scope, expensesDao, userDao, $injector) {
		angular.extend($scope, {
			defaultCategoryId: initDefaultCategoryId(),
			expenses: initExpenses(),
			gridOptions: initGridOptions(),
			chart: chart,
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
			var ret = [];
			expensesDao.fetch(2013,undefined,ret);
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

		function chart($event, expenses) {
			$event.preventDefault();
			chartPopupModule.get().then(
				function() {
					$injector.invoke(["chartPopup", function(chartPopup) {
						chartPopup.show(expenses);
					}]);
				},
				function() {

				}
			);
		}
	}
	
	return ExpensesCtrl;
});
