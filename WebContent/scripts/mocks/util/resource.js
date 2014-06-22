define([], function() {
	var resource, findSuccessCallback, findFailureCallback;
	
	resource = jasmine.createSpy("resource").and.callFake(function(url, paramDefaults, actions) {
		var x, methods = [];
		for( x in actions ) {
			if( !actions.hasOwnProperty(x) ) continue;
			methods.push(x);
		}
		return jasmine.createSpyObj("resource:" + url, methods);
	});
	
	return resource;
});
