define(["angular", "currentModule", "util/loginPrompt", "lib/angular-resource/angular-resource"],
function(angular, currentModule) {
	"use strict";

	currentModule.addDependencies("ngResource").service("userDao", ["$http", "$q", "loginPrompt", function($http, $q, loginPrompt) {
		var userData = null, loggedIn = false, loginPending = false;

		function login(username, password) {
			userData = $q.defer(); // overwrite previous value; this is a new login
			return $http.post("api/user/login", {username:username,password:password}).then(
				function loginSucceeded(response) {
					loggedIn = true;
					userData.resolve(response.data);
					return response.data;
				},
				function loginFailed(response) {
					loggedIn = false;
					if( userData !== null ) userData.reject();
					return $q.reject(response);
				}
			);
		}
		
		function isLoggedIn() {
			return loggedIn;
		}
		
		function getUserData(triggerLogin) {
			var d = userData || $q.defer();
			if( userData == null ) {
				userData = d;
				if( !loginPending && triggerLogin !== false ) {
					loginPending = true;
					loginPrompt().then(
						function(loginData) {
							return login(loginData.username,loginData.password);
						},
						function(err) {
							return $q.reject(err);
						}
					).then(
						function(result) {
							d.resolve(result);
							loginPending = false;
						},
						function(err) {
							d.reject(err);
							loginPending = false;
							return $q.reject(err);
						}
					);
				}
			}
			return d.promise;
		}
		
		return {
			getUserData: getUserData,
			login: login,
			isLoggedIn: isLoggedIn
		};
	}]);
});
