define(["util/resource", "util/loginPrompt", "jquery"], function(resource, promptLogin, $) {
	"use strict";
	
	var userData = null, rc, loggedIn = false, loginPending = false;
	
	rc = resource("api/user", {}, {
		login: { type:"POST", url:"api/user/login" }
	});
	
	function login(username, password, callback, errback) {
		rc.login({username:username,password:password}, function(data) {
			loggedIn = true;
			if( userData === null ) userData = $.Deferred();
			userData.resolve(data);
			if( $.isFunction(callback) ) callback(data);
		}, function() {
			if( userData !== null ) userData.reject();
			if( $.isFunction(errback) ) errback();
		});
	}
	
	function isLoggedIn() {
		return loggedIn;
	}
	
	function getUserData(triggerLogin) {
//console.log("getUserData -> %o / %o",userData,promptLogin.isOpen());
//		if( userData === null || userData.state() !== "pending" ) userData = $.Deferred();
		if( userData === null ) userData = $.Deferred();
		if( !loginPending && triggerLogin !== false && userData.state() === "pending" ) {
//console.log("prompt login");
			loginPending = true;
			promptLogin().then(
				function(loginData) {
					login(loginData.username,loginData.password,
						function(result) {
							userData.resolve(result);
							loginPending = false;
						},
						function(err) {
							userData.reject(err);
							loginPending = false;
						}
					);
				},
				function(err) {
					userData.reject(err);
					loginPending = false;
				}
			);
		}
		return userData.promise();
	}
	
	return {
		getUserData: getUserData,
		login: login,
		isLoggedIn: isLoggedIn
	};
});
