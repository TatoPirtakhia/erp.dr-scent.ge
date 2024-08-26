import fetch from '../auth/FetchInterceptor'

const RegionService = {}

RegionService.getRegion = function () {
  return fetch({
    url: `/api/region`,
    method: "get",
  })
}
RegionService.addRegion = function (data) {
  return fetch({
    url: `/api/region`,
    method: "post",
    data
  })
}
RegionService.editRegion = function (data) {
  return fetch({
    url: `/api/region`,
    method: "put",
    data
  })
}
RegionService.deleteRegion = function (data) {
  return fetch({
    url: `/api/region`,
    method: "delete",
    data
  })
}

export default RegionService;