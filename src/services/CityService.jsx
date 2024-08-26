import fetch from '../auth/FetchInterceptor'

const CityService = {}

CityService.createCity = function (data) {
    return fetch({
        url: `/api/city`,
        method: "post",
        data
    })
}
CityService.editCity = function (data) {
    return fetch({
        url: `/api/city`,
        method: "put",
        data
    })
}
CityService.getCities = function ({ country_id, state_id }) {
    return fetch({
        url: `/api/city/${country_id}/${state_id}`,
        method: "get",
    })
}

CityService.deleteCity= function (data) {
    return fetch({
        url: `/api/city`,
        method: "delete",
        data
    })
}



export default CityService;