import fetch from "../auth/FetchInterceptor";

const CategoryService = {};

CategoryService.get_category = async function () {
  return fetch({
    url: "https://erp.ibilling.ge/api/productCategory",
    method: "GET",
  });
};

CategoryService.add_category = function (data) {
  return fetch({
    url: "https://erp.ibilling.ge/api/productCategory",
    method: "POST",
    data,
  });
};
CategoryService.edit_category = function (data) {
  return fetch({
    url: "https://erp.ibilling.ge/api/productCategory",
    method: "PUT",
    data,
  });
};
CategoryService.delete_category = function (data) {
  return fetch({
    url: "https://erp.ibilling.ge/api/productCategory",
    method: "DELETE",
    data,
  });
};
export default CategoryService;
