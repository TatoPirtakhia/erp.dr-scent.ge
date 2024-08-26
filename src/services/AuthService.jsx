import fetch from '../auth/FetchInterceptor'

const AuthService = {}

AuthService.login = function (data) {
	return fetch({
		url: '/api/login',
		method: 'post',
		data: data
	})
}

AuthService.register = function (data) {
	return fetch({
		url: '/api/auth/register',
		method: 'post',
		data: data
	})
}

AuthService.logout = function () {
	return fetch({
		url: '/api/auth/logout',
		method: 'post'
	})
}

AuthService.sendRecoveryLink = function (data) {
	return fetch({
	  url: "/api/requestPasswordRecovery",
	  method: "post",
	  data: data,
	})
  }

AuthService.loginInOAuth = function () {
	return fetch({
		url: '/api/auth/loginInOAuth',
		method: 'post'
	})
}

export default AuthService;