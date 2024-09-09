import fetch from '../auth/FetchInterceptor'

const CompanyTypeService = {}

CompanyTypeService.getCompanyType = function () {
  return fetch({
    url: `/api/companyType`,
    method: "get",
  })
}
CompanyTypeService.addCompanyType = function (data) {
  return fetch({
    url: `/api/companyType`,
    method: "post",
    data
  })
}
CompanyTypeService.editCompanyType = function (data) {
  return fetch({
    url: `/api/companyType`,
    method: "put",
    data
  })
}
CompanyTypeService.deleteCompanyType = function (data) {
  return fetch({
    url: `/api/companyType`,
    method: "delete",
    data
  })
}


export default CompanyTypeService;