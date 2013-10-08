/**
 * Adapt the dependencies from RequireJS to an Angular module.
 */
function angularModule(cb) {
	function isAngularModule(obj) {
		if( obj != null && typeof(obj.name) === "string" ) {
			try {
				return angular.module(obj.name) === obj;
			}
			catch(e) {}
		}
		return false;
	}
	
	return function() {
		var args = [], extensions = [], ret, i;
		
		for( i=0; i < arguments.length; i++ ) {
			args.push(arguments[i]);
			if( arguments[i] instanceof AngularModuleExtension ) extensions.push(arguments[i]);
		}
		
		ret = cb.apply(null, args);
		if( angular.isFunction(ret) || angular.isArray(ret) ) ret = { configs: [ret] };
		if( !angular.isObject(ret) ) ret = {};
		
		for( i=0; i < extensions.length; i++ ) {
			// we need deep copy
			angular.extend(ret, angular.copy(extensions[i],{}));
		}
		
		if( !angular.isArray(ret.deps) ) {
			ret.deps = [];
			for( i=0; i < arguments.length; i++ ) {
				if( isAngularModule(arguments[i]) ) ret.deps.push(arguments[i]);
			}
		}
		return ret;
	};
}

/**
 * Return instances of this type from a RequireJS module to indicate
 * that the corresponding module object must be extended with this
 * object.
 */
function AngularModuleExtension() {
	var a = jQuery.makeArray(arguments);
	a.unshift(this);
	a.unshift(true);
	jQuery.extend.apply(jQuery,a);
}
