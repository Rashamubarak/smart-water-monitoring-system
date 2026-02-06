import api from "./api";

export const getLocations = () => api.get("/locations");

export const addLocation = (data) => api.post("/locations", data);
