define(["angular", "currentModule", "lib/Chart"], function(angular, currentModule, Chart) {
	"use strict";
	
	var COLORS = [
		["#F7464A","#FF5A5E"],
		["#46BFBD","#5AD3D1"],
		["#FDB45C","#FFC870"]
	];

	function preprocessData(data) {
		var i, colorIndex = 0;
		for( i=0; i < data.length; i++ ) {
			if( data[i].color == null ) {
				data[i].color = COLORS[colorIndex][0];
				data[i].highlight = COLORS[colorIndex][1];
				colorIndex += 1;
			}
		}
	}

	currentModule.directive("pieChart", function() {
		return {
			restrict: "A",
			scope: {
				data: "=pieChart"
			},
			link: function(scope, elem, attrs) {
				var ctx, pieChart;
				preprocessData(scope.data);
				ctx = elem[0].getContext("2d");
				pieChart = new Chart(ctx).Pie(scope.data, {
					animationEasing: "easeOutQuint",
					legendTemplate:
						'<ul class="<%=name.toLowerCase()%>-legend">' +
							'<% for (var i=0; i<segments.length; i++){%>' +
								'<li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li>' +
							'<%}%>' +
						'</ul>'
				});
			}
		};
	});
});
