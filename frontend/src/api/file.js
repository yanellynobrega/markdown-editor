import AXIOS from "./AxiosConfig";

export const createFile = data => AXIOS.post("files", data);
export const updateFile = (id, data) => AXIOS.put(`files/${id}`, data);
export const deleteFile = id => AXIOS.delete(`files/${id}`);
export const getFiles = () => AXIOS.get("files");
