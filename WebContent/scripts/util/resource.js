define(["jquery", "./urlUtils", "$injector"], function($, uu, $injector) {
	"use strict";
	
	function extractArgs(hasBody, args) {
		var params = {}, data = null, success = $.noop, error = null, alen,
			a1 = args[0], a2 = args[1], a3 = args[2], a4 = args[3];
		
		for( alen = args.length; typeof(args[alen-1]) === "undefined" && alen > 0; alen-- );
		
		switch( alen ) {
			case 4:
				error = a4;
				success = a3;
				// fallthrough
			case 3:
			case 2:
				if ($.isFunction(a2)) {
					if ($.isFunction(a1)) {
						success = a1;
						error = a2;
						break;
					}
					
					success = a2;
					error = a3;
					// fallthrough
				} else {
					params = a1;
					data = a2;
					success = a3;
					break;
				}
			case 1:
				if ($.isFunction(a1))
					success = a1;
				else if (hasBody)
					data = a1;
				else
					params = a1;
				break;
			case 0:
				break;
			default:
				throw "Expected between 0-4 arguments [params, data, success, error], got " + arguments.length + " arguments.";
		}
		
		return {
			params: params,
			data: data,
			success: success,
			error: error
		};
	}
	
	function addData(hasBody, ajaxOpts, queryParams, bodyData) {
		if( hasBody ) {
			if( typeof(bodyData) === "object" ) {
				ajaxOpts.data = JSON.stringify(bodyData);
			}
			else if( typeof(bodyData) === "string" || typeof(bodyData) === "number" ) {
				ajaxOpts.data = bodyData;
			}
			// TODO append queryParams to URL
		}
		else {
			if( typeof(queryParams) === "object" ) {
				ajaxOpts.data = queryParams;
			}
		}
	}
	
	function makeInnerThen(paramNames, args, route, paramDefaults, hasBody, ret, opts) {
		return function() {
			var j, params = {}, innerPromise, url, queryParams, ajaxOpts;
			for( j=0; j < arguments[0].length; j++ ) {
				params[paramNames[j]] = arguments[0][j];
			}
			args.params = params;
			// continue normally
			url = route.applyParams($.extend({},paramDefaults,args.params));
			queryParams = url.queryParams;
			url = url.uri;
//XXX-DONE
			ajaxOpts = $.extend({url:url}, opts);
			delete ajaxOpts.isArray;
			delete ajaxOpts.transformResponse;
			addData(hasBody, ajaxOpts, queryParams, args.data);
//XXX-DONE
			innerPromise = $injector.get("$http")(ajaxOpts);
			innerPromise["finally"](function() {
				ret.$resolved = true;
			});
			return innerPromise;
		};
	}
	
	function makeAjaxMethod(route, paramDefaults, opts, isArray) {
		var hasBody = (opts.method === "POST" || opts.method === "PUT" || opts.method === "PATCH"),
			handleData = isArray ? handleArrayData : handleObjectData;
		
		if( opts.url ) route = new uu.Route(opts.url);
		else if( opts.urlAppend ) route = route.append(opts.urlAppend);
		
		// this function is returned to the client and gets called to access the resource
		return function ajaxMethod(a1, a2, a3, a4) {
			var args = extractArgs(hasBody, [a1, a2, a3, a4]),
//XXX-DONE
				promise, paramNames = [], paramVals = [],// inj,
				ret = isArray ? [] : {},
				$q = $injector.get("$q");
			
			if( $.isFunction(args.params.then) ) {
//XXX-DONE
				promise = $q.when(args.params).then(
					function(params) {
						args.params = params;
						return executeDeferred();
					},
					args.error
				);
			}
			else {
				promise = executeDeferred();
			}
			
			function executeDeferred() {
				var i, innerPromise;
				
				for( i in args.params ) {
					if( !args.params.hasOwnProperty(i) ) continue;
					paramNames.push(i);
					paramVals.push(args.params[i]);
				}
				
//XXX-DONE
				innerPromise = $q.all(paramVals).then(
					makeInnerThen(paramNames, args, route, paramDefaults, hasBody, ret, opts),
					args.error
				);
				
				return innerPromise;
			}
			
			ret.$resolved = false;
			
//XXX-DONE
			ret.$then = promise.then(
				function(response) {//REMOVE:xhrArguments
					var data = response.data;
//XXX-DONE
//					inj = j;
					if( $.isFunction(opts.transformResponse) ) {
//XXX-DONE (xhrArguments[2] -> response.headers)
						data = callTransformation(opts.transformResponse, data, response.headers);
					}
					if( data != null ) handleData(data, ret);
//XXX-???-REMOVED
//					xhrArguments[2].resource = ret;
//XXX-DONE (xhrArguments[1], xhrArguments[2] -> response.headers)
					if( $.isFunction(args.success) ) args.success(data, response.headers);
//XXX-DONE
//					injector.applySafeWith(inj);
					return data;
				},
				function() {
					if( $.isFunction(args.error) ) args.error();
//XXX-DONE
//					injector.applyEventually();
				}
			).then;
			
			return ret;
		};
	}
	
//XXX-DONE
	function callTransformation(transformation, data, headers) {//REMOVE:jqXhr
		var res = transformation.call(
			null,
			data,
			function headersGetter(name) {
//XXX-DONE
				return headers(name);
//XXX-INCOMPATIBLE-REMOVED
//			},
//			function allHeadersGetter() {
//				return jqXhr.getAllResponseHeaders();
			}
		);
		return typeof(res) !== "undefined" ? res : data;
	}
	
	function handleArrayData(data, ret) {
		var i;
		if( !$.isArray(data) && $.isArray(data.payload) ) data = data.payload;
		for( i=0; i < data.length; i++ ) {
			ret.push(data[i]);
		}
	}
	
	function handleObjectData(data, ret) {
//		if( typeof(data.payload) === "object" ) data = data.payload;
		$.extend(ret,data,{$resolved:ret.$resolved});
	}
	
	function resource(url, paramDefaults, actions) {
		var route, x, ret;
		if( paramDefaults == null ) paramDefaults = {};
		route = new uu.Route(url);
		ret = {};
		for( x in actions ) {
			if( !actions.hasOwnProperty(x) ) continue;
			ret[x] = makeAjaxMethod(route,paramDefaults,actions[x],actions[x].isArray);
		}
		return ret;
	}
	
	function findSuccessCallback(args) {
		if( args.length === 1 && $.isFunction(args[0]) ) return args[0];
		else if( args.length > 1 && $.isFunction(args[args.length-1]) ) {
			if( $.isFunction(args[args.length-2]) ) return args[args.length-2];
			else return args[args.length-1];
		}
	}
	
	function findFailureCallback(args) {
		if( args.length > 1 && $.isFunction(args[args.length-1]) && $.isFunction(args[args.length-2]) ) {
			return args[args.length-2];
		}
	}
	
	resource.findSuccessCallback = findSuccessCallback;
	resource.findFailureCallback = findFailureCallback;
	
	return resource;
});
