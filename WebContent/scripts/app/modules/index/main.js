define(["./index-view"], function(indexView) {
	"use strict";
	
	function getControllerFor(path) {
		return indexView.controller;
	}
	
	function getTemplateFor(path) {
		return indexView.template;
	}
	
	return {
		getControllerFor: getControllerFor,
		getTemplateFor: getTemplateFor
	};
});
