import axios from "axios";

/**
 * In development: use the full URL to the local backend
 * In production: use relative URL since frontend and backend are on the same domain
 * import.meta.env.DEV is automatically provided by Vite.
 */
const baseUrl = import.meta.env.DEV
  ? import.meta.env.VITE_SERVER_BASE_URL
  : "/api";

if (!baseUrl) {
  throw new Error("Server base URL is missing!");
}

const axiosInstance = axios.create({
  baseURL: baseUrl,
  // instructs the browser to include credentials such as cookies, authentication headers, TLS client certificates
  withCredentials: true,
});

export default axiosInstance;
