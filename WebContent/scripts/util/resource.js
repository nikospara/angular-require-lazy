define(["jquery", "./urlUtils", "injector"], function($, uu, injector) {
	"use strict";
	
	// code derived from angular-resource
	/*
$.ajax("/api/user", {
	dataType: "json",
	contentType: "application/json",
	type: "POST",
	data: JSON.stringify({"name":"uu","password":"uu","passwordRepeat":"uu"})
});

s = "user/{id}/categories/{cid}/foo"
require(["app/shared/urlUtils"], function(uu) { window.uu = uu; })
rt = new uu.Route(s)
rt.applyParams({id:4,cid:"mega"})

require(["app/shared/resource"], function(rc) { window.rc = rc; })
r = rc("/api/user/{id}/categories", {id:1}, {q:{isArray:true,type:"GET"}})
x = r.q()
x = r.q(function(data) { window.d1 = data; })
	 */
	function extractArgs(hasBody, args) {
		var params = {}, data, success = $.noop, error = null, alen,
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
			for( j=0; j < arguments.length; j++ ) {
				params[paramNames[j]] = arguments[j];
			}
			args.params = params;
			// continue normally
			url = route.applyParams($.extend({},paramDefaults,args.params));
			queryParams = url.queryParams;
			url = url.uri;
			ajaxOpts = $.extend({url:url,dataType:"json",contentType:"application/json"}, opts);
			delete ajaxOpts.isArray;
			addData(hasBody, ajaxOpts, queryParams, args.data);
			innerPromise = $.ajax(ajaxOpts);
			innerPromise.always(function() {
				ret.$resolved = true;
			});
			return innerPromise;
		};
	}
	
	function makeAjaxMethod(route, paramDefaults, opts, isArray) {
		var hasBody = (opts.type === "POST" || opts.type === "PUT" || opts.type === "PATCH"),
			handleData = isArray ? handleArrayData : handleObjectData;
		
		if( opts.url ) route = new uu.Route(opts.url);
		else if( opts.urlAppend ) route = route.append(opts.urlAppend);
		
		// this function is returned to the client and gets called to access the resource
		return function ajaxMethod(a1, a2, a3, a4) {
			var args = extractArgs(hasBody, [a1, a2, a3, a4]),
				promise, paramNames = [], paramVals = [],
				ret = isArray ? [] : {};
			
			if( $.isFunction(args.params.then) ) {
				promise = args.params.then(
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
				
				innerPromise = $.when.apply($,paramVals).then(
					makeInnerThen(paramNames, args, route, paramDefaults, hasBody, ret, opts),
					args.error
				);
				
				return innerPromise;
			}
			
			ret.$resolved = false;
			ret.$then = promise.then(
				function(data, status, jqxhr) {
					if( $.isFunction(opts.transformResponse) ) {
						data = callTransformation(opts.transformResponse, data, jqxhr);
					}
					if( data != null ) handleData(data, ret);
					jqxhr.resource = ret;
					if( $.isFunction(args.success) ) args.success(data, status, jqxhr);
				},
				args.error
			).then;
			
			promise.always(injector.applyEventually);
//			promise.always(function() {
//				injector.get().then(function(j) {
//					injector.applySafeWith(j);
//				});
//			});
			
			return ret;
		};
	}
	
	function callTransformation(transformation, data, jqXhr) {
		var res = transformation.call(
			null,
			data,
			function headersGetter(name) {
				return jqXhr.getResponseHeader(name);
			},
			function allHeadersGetter() {
				return jqXhr.getAllResponseHeaders();
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
		if( typeof(data.payload) === "object" ) data = data.payload;
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
