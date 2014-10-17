define([
	"angular", "app/shared/model/Expense", "templateCache!./chartPopup.tpl.html",
	// side-effect deps
	"./pieChartDirective",
	"app/shared/dao/userDao", "app/shared/dao/expensesDao", "templateCache!./expensesTemplate.html", "lib/ng-grid-bower/ng-grid", "lib/angular-ui-bootstrap/src/modal/modal"
],
function(angular, Expense, chartPopupTemplate) {
	"use strict";
	
	var opts = {
		backdrop: "static",
		keyboard: false,
		template: chartPopupTemplate.text
	};

	ExpensesCtrl.$inject = ["$scope", "$modal", "expensesDao", "userDao"];
	function ExpensesCtrl($scope, $modal, expensesDao, userDao) {
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
			opts.controller = ["$scope", "$modalInstance", ChartCtrl];
			var d = $modal.open(opts);

			function ChartCtrl($scope, $modalInstance) {
				angular.extend($scope, {
					data: mapExpensesForCharting(expenses)
				});
			}
		}
	}

	function mapExpensesForCharting(expenses) {
		var map = {}, result = [], i, tmp;
		for( i=0; i < expenses.length; i++ ) {
			tmp = map[expenses[i].categoryId];
			if( !tmp ) {
				tmp = { value:0, label:"Category " + expenses[i].categoryId };
				map[expenses[i].categoryId] = tmp;
				result.push(tmp);
			}
			tmp.value += expenses[i].amount;
		}
		return result;
	}
	
	return ExpensesCtrl;
});
