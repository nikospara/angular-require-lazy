define(["jquery"], function($) {
	"use strict";
	
	var pathParamRe = /\{([a-zA-Z0-9]+)\}/;
	
	function Route(uri) {
		if( !(this instanceof Route) ) return new Route(uri);
		this._uri = $.trim(uri);
	}
	
	Route.prototype = {
		_uri: null,
		_uriComponents: null,
		_uriParams: null,
		
		applyParams: function(params) {
			var x, ret, comp, val;
			if( this._uriParams === null ) this._extractUriComponents();
			params = $.extend({}, params);
			ret = {
				uri: null,
				queryParams: params
			};
			comp = this._uriComponents.slice(0);
			for( x in this._uriParams ) {
				if( !this._uriParams.hasOwnProperty(x) ) continue;
				val = params[x];
				if( val == null ) throw new Error("required path param " + x + " missing from params - Route(" + this._uri + ")");
				if( $.isFunction(val) ) val = val();
				comp[this._uriParams[x]] = val;
				delete params[x];
			}
			ret.uri = "/" + comp.join("/");
			return ret;
		},
		
		_extractUriComponents: function() {
			var split, tmp, i, params={}, components=[];
			split = this._uri.split("/");
			for( i=0; i < split.length; i++ ) {
				if( pathParamRe.test(split[i]) ) {
					tmp = pathParamRe.exec(split[i])[1];
					params[tmp] = i;
					components.push(tmp);
				}
				else components.push(split[i]);
			}
			this._uriComponents = components;
			this._uriParams = params;
		},
		
		append: function(path) {
			var newUri = appendPath(this._uri, path);
			return new Route(newUri);
		}
	};
	
	function appendPath(pathNow, path) {
		if( path != null ) {
			path = ""+path;
			var nowEndsWithSlash = (pathNow.length > 0 && pathNow.charAt(pathNow.length-1) === "/"),
			    pathStartsWithSlash = (path.length > 0 && path.charAt(0) === "/");
			if( nowEndsWithSlash && pathStartsWithSlash ) {
				pathNow += path.substring(1);
			}
			else if( (nowEndsWithSlash && !pathStartsWithSlash) || (!nowEndsWithSlash && pathStartsWithSlash) ) {
				pathNow += path;
			}
			else {
				pathNow += "/" + path;
			}
		}
		return pathNow;
	}
	
	return {
		contextPath: "",
		Route: Route,
		appendPath: appendPath
	};
});
