import api from "./api";

export const getUsers = () => {
  return api.get("/admin/users");
};

export const deleteUser = (id) => {
  return api.delete(`/admin/users/${id}`);
};
