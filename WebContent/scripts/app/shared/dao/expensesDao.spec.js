define(["./expensesDao", "mocks/util/resource"], function(expensesDao, mockResource) {
	describe("The expensesDao", function() {
		afterEach(function() {
			mockResource.calls.reset();
		});
		
		it("should pass", function() {
			expect(mockResource.calls.count()).toBe(1);
		});
	});
});
