import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  // instructs the browser to include credentials such as cookies, authentication headers, TLS client certificates
  withCredentials: true,
});

export default axiosInstance;
