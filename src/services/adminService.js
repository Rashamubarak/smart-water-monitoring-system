import api from "./api";

import axios from "axios";

export const updateUserRole = (id, role) => {
  return axios.put(`/api/admin/users/${id}`, { role });
};

export const getUsers = () => {
  return api.get("/admin/users");
};

export const deleteUser = (id) => {
  return api.delete(`/admin/users/${id}`);
};
