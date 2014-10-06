define(["jquery"],function($) {
	"use strict";
	
	function Expense(json) {
		json = json || {};
		if( typeof(json.date) === "string" ) json.date = new Date(json.date);
		$.extend(this, json);
	}
	
	Expense.prototype = {
		key: null,
		date: null,
		amount: null,
		reason: null,
		categoryId: null,
		special: null
	};
	Expense.prototype.constructor = Expense;
	
	Expense.amountValidators = [
		["positive", function(thisObj, value, validationContext) {
			validationContext.setMessage("Must be positive");
			return value == null || value > 0;
		}]
	];
	
	return Expense;
});
