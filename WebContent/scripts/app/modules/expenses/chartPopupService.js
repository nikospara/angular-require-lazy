define(["angular", "currentModule", "templateCache!./chartPopup.tpl.html", "./pieChartDirective"],
function(angular, currentModule, chartPopupTemplate) {
	"use strict";

	var opts = {
		backdrop: "static",
		keyboard: false,
		templateUrl: chartPopupTemplate.path
	};

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

	currentModule.addDependencies().service("chartPopup", ["$modal", function($modal) {

		function show(expenses) {
			var d;

			opts.controller = ["$scope", ChartCtrl];
			d = $modal.open(opts);

			function ChartCtrl($scope) {
				angular.extend($scope, {
					data: mapExpensesForCharting(expenses)
				});
			}
		}

		return {
			show: show
		};
	}]);
});
