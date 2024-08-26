import fetch from '../auth/FetchInterceptor'

const ProductService = {}

ProductService.get_product = function () {
  return fetch({
    url: `/api/product`,
    method: "get",
  })
}
ProductService.getFilteredProduct = function (data) {
  return fetch({
    url: `/api/filteredProduct`,
    method: "post",
    data,
  })
}


ProductService.getImportHistory = function (id) {
  return fetch({
    url: `/api/getImportHistory/${id}`,
    method: "get",
  })
}
ProductService.get_product_by_stock_room = function (data) {
  return fetch({
    url: `/api/get_product_by_stock_room/${data.id}/${data.type}`,
    method: "get",
  })
}
ProductService.get_product_by_stock_room_from_service = function (data) {
  return fetch({
    url: `/api/get_product_by_stock_room_from_service/${data.id}/${data.type}/${data.service_id}`,
    method: "get",
  })
}
ProductService.transfer = function (data) {
  return fetch({
    url: `/api/transfer`,
    method: "post",
    data
  })
}
ProductService.fill_product = function (data) {
  return fetch({
    url: `/api/fill_product`,
    method: "post",
    data
  })
}
ProductService.getImports = function () {
  return fetch({
    url: `/api/fill_product`,
    method: "get",
  })
}
ProductService.edit_product = function (data) {
  return fetch({
    url: `/api/product/${data.id}`,
    method: "put",
    data: data.formData
  })
}
ProductService.add_product = function (data) {
  return fetch({
    url: `/api/product`,
    method: "post",
    data
  })
}
ProductService.delete_product = function (data) {
  return fetch({
    url: `/api/product`,
    method: "delete",
    data
  })
}

ProductService.removeImage = function (data) {
  return fetch({
    url: `api/removeImage`,
    method: "delete",
    data
  })
}

ProductService.addCategory = function (data) {
  return fetch({
    url: `api/productCategory`,
    method: "post",
    data
  })
}

ProductService.editCategory = function (data) {
  return fetch({
    url: `api/productCategory`,
    method: "put",
    data
  })
}
ProductService.deleteCategory = function (data) {
  return fetch({
    url: `api/productCategory`,
    method: "delete",
    data
  })
}

ProductService.getProductCategory = function () {
  return fetch({
    url: `api/productCategory`,
    method: "get",
  })
}



export default ProductService;