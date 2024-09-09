import fetch from '../auth/FetchInterceptor'

const RsService = {}


RsService.getRsSetting = function () {
  return fetch({
    url: `api/RsSetting`,
    method: "get",
  })
}

RsService.createRsSetting = function (data) {
  return fetch({
    url: `api/RsSetting`,
    method: "post",
    data: data
  })
}
RsService.editRsSetting = function (data) {
  return fetch({
    url: `api/editRsSetting`,
    method: "post",
    data: data
  })
}
RsService.rs_invoice_a = function (data) {
  return fetch({
    url: `api/rs_invoice_a`,
    method: "put",
    data: data
  })
}

RsService.testRsSetting = function (data) {
  return fetch({
    url: `api/testRsSetting`,
    method: "post",
    data: data
  })
}
RsService.get_vat_payer_info = function (data) {
  return fetch({
    url: `api/is_vat_payer/${data}`,
    method: "get",
  })
}

export default RsService