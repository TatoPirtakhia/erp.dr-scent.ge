import fetch from '../auth/FetchInterceptor'

const SystemService = {}

SystemService.update_or_insert = function (data) {
	return fetch({
		url: '/api/systemInfo',
		method: 'post',
		data
	})
}
SystemService.getSystemInfo = function () {
	return fetch({
		url: '/api/systemInfo',
		method: 'get',
	})
}

export default SystemService;