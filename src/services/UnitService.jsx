import fetch from '../auth/FetchInterceptor'

const UnitService = {}

UnitService.get_unit = function () {
  return fetch({
    url: `/api/unit`,
    method: "get",
  })
}
UnitService.add_unit = function (data) {
  return fetch({
    url: `/api/unit`,
    method: "post",
    data
  })
}
UnitService.edit_unit = function (data) {
  return fetch({
    url: `/api/unit`,
    method: "put",
    data
  })
}
UnitService.delete_unit = function (data) {
  return fetch({
    url: `/api/unit`,
    method: "delete",
    data
  })
}

export default UnitService;