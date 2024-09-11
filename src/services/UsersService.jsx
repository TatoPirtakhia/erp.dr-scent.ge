import fetch from "../auth/FetchInterceptor";

const UsersService = {};

UsersService.getAdmins = function (data) {
  return fetch({
    url: `/api/getUsers/2`,
    method: "post",
    data,
  });
};
UsersService.addAdmins = function (data) {
  return fetch({
    url: `/api/addUser`,
    method: "post",
    data,
  });
};
UsersService.editAdmin = function (data) {
  return fetch({
    url: `/api/editAdmin`,
    method: "put",
    data,
  });
};
UsersService.getAllClient = function (data) {
  return fetch({
    url: `/api/getAllClient`,
    method: "post",
    data,
  });
};
UsersService.getUserData = function (id) {
  return fetch({
    url: `/api/getUserData/${id}`,
    method: "get",
  });
};
UsersService.getClientData = function (id) {
  return fetch({
    url: `/api/getClientData/${id}`,
    method: "get",
  });
};
UsersService.getClients = function () {
  return fetch({
    url: `/api/getClients`,
    method: "get",
  });
};
UsersService.getAdminsForClient = function () {
  return fetch({
    url: `/api/getAdminsForClient`,
    method: "get",
  });
};
UsersService.addClient = function (data) {
  return fetch({
    url: "/api/client",
    method: "post",
    data,
  });
};
UsersService.addBranch = function (data) {
  return fetch({
    url: "/api/branch",
    method: "post",
    data,
  });
};
UsersService.editClient = function (data) {
  return fetch({
    url: "/api/client",
    method: "put",
    data,
  });
};
UsersService.editBranch = function (data) {
  return fetch({
    url: "/api/branch",
    method: "put",
    data,
  });
};
UsersService.editBranchImage = function (data) {
  return fetch({
    url: "/api/branch",
    method: "put",
    data,
  });
};
UsersService.deleteBranchImage = function (data) {
  return fetch({
    url: `/api/branch_images/${data.user_id}`,
    method: "delete",
    data: data.imageIds,
  });
};
UsersService.addDocumentImage = function (data) {
  return fetch({
    url: `/api/document/${data.id}`,
    method: "post",
    data: data.formData,
  });
};
UsersService.changeClientImage = function (data) {
  return fetch({
    url: `/api/clientImage/${data.id}`,
    method: "post",
    data: data.formData,
  });
};
UsersService.addClientImage = function (data) {
  return fetch({
    url: `/api/images/${data.id}`,
    method: "post",
    data: data.formData,
  });
};
UsersService.addBranchImage = function (data) {
  return fetch({
    url: `/api/branch_images/${data.user_id}/${data.branch_id}/${data.image_id}`,
    method: "post",
    data: data.formData,
  });
};
UsersService.changeActive = function (data) {
  return fetch({
    url: `/api/changeActive/${data.id}/${data.active}`,
    method: "put",
    data,
  });
};

UsersService.verifyEmail = function (data) {
  return fetch({
    url: `/api/verifyEmail/${data.id}`,
    method: "post",
  });
};
UsersService.delete_Branch = function (id) {
  return fetch({
    url: `/api/branch/${id}`,
    method: "delete",
  });
};

export default UsersService;
