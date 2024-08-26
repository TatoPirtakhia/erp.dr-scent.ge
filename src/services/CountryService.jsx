import fetch from '../auth/FetchInterceptor'

const CountryService = {}

CountryService.createCountry = function (data) {
    return fetch({
        url: `/api/country`,
        method: "post",
        data
      })
}
CountryService.editCountry = function (data) {
    return fetch({
        url: `/api/country`,
        method: "put",
        data
      })
}
CountryService.getCountries = function () {
    return fetch({
        url: `/api/getCountries`,
        method: "get",
      })
}
CountryService.getRegions = function (id) {
    return fetch({
        url: `/api/getRegions/${id}`,
        method: "get",
      })
}
CountryService.getCities = function (id) {
    return fetch({
        url: `/api/getCities/${id}`,
        method: "get",
      })
}
CountryService.deleteCOuntries = function (data) {
    return fetch({
        url: `/api/countries`,
        method: "delete",
        data
      })
}



export default CountryService;