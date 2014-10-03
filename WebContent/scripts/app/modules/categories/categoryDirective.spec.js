define(["./categoryDirective", "angular", "$injector"], function(categoryDirective, angular) {
	describe("The categoryDirective", function() {
		var scope, wrapperElement, element, $compile;
		
		function compile(html) {
			wrapperElement = angular.element('<div>' + html + '</div>');
			element = wrapperElement.find("div");
			$compile(wrapperElement)(scope);
			scope.$digest();
		}
		
		beforeEach(module("test-main"));
		
		beforeEach(inject(function($rootScope, _$compile_) {
			scope = $rootScope.$new();
			$compile = _$compile_;
		}));
		
		afterEach(function() {
			scope.$destroy();
			wrapperElement = element = null;
		});
		
		it("should pass", function() {
			scope.c = {
				key: "abc",
				name: "Abc"
			};
			scope.selectCategoryForEdit = jasmine.createSpy("selectCategoryForEdit");
			scope.deleteCategory = jasmine.createSpy("deleteCategory");
			compile('<div category="c" edit="selectCategoryForEdit(c)" remove="deleteCategory(c)"></div><span ng-if="c.key==\'abXc\'">Span</span>');
//			var editLink = element.find("a:not(.control-action)");
			var editLink = wrapperElement[0].querySelectorAll("a:not(.control-action)");
//console.log(wrapperElement.html());
			expect(editLink.length).toBe(1);
		});
	});
});
