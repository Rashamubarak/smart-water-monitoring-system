import api from "./api";

export const getWaterData = () => api.get("/water");

export const addWaterData = (data) => api.post("/water", data);

export const updateWaterData = (id, data) =>
  api.put(`/water/${id}`, data);

export const deleteWaterData = (id) =>
  api.delete(`/water/${id}`);
