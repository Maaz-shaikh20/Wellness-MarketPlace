import axios from "axios";

// Dynamically resolve backend API base URL for local/mobile development testing.
const getBaseURL = () => {
  let apiURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

  // If accessing the site on mobile via LAN IP, replace localhost with the current hostname
  // so the mobile browser makes requests to the host machine instead of itself.
  if (typeof window !== "undefined" && window.location?.hostname) {
    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      apiURL = apiURL.replace("localhost", hostname).replace("127.0.0.1", hostname);
    }
  }
  return apiURL;
};

/* ================= AXIOS INSTANCE ================= */
const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request setup error:", error);
    return Promise.reject(error);
  }
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Unauthorized — token may be expired.");
    } else if (status === 403) {
      console.warn("Forbidden — insufficient permissions.");
    } else if (status >= 500) {
      console.error("Server error:", error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
