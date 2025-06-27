import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "https://amazon-clone-wf3n.onrender.com",
  baseURL: "http://localhost:5000",
});
