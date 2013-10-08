define(["./expensesView"], function(view) {
	"use strict";
	
	function getControllerFor(path) {
		return view.controller;
	}
	
	function getTemplateFor(path) {
		return view.template;
	}
	
	return {
		getControllerFor: getControllerFor,
		getTemplateFor: getTemplateFor
	};
});
