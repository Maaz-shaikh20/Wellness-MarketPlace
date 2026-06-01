import axios from "axios";

// Dynamically resolve backend API base URL for easier local/mobile development testing.
const getBaseURL = () => {
  let apiURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

  // If we are accessing the site on mobile via LAN IP/hostname (not localhost/127.0.0.1),
  // and the API URL is pointing to localhost, replace it with the current hostname
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
  withCredentials: false, // keep false for JWT in headers
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("➡️ API REQUEST:", {
      url: config.url,
      method: config.method?.toUpperCase(),
      hasToken: !!token,
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("❌ REQUEST SETUP ERROR:", error);
    return Promise.reject(error);
  }
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => {
    console.log("✅ API RESPONSE:", {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    console.error("❌ API ERROR:", {
      url,
      status,
      message: error.message,
    });

    if (status === 401) {
      console.warn("🔒 401 Unauthorized – token invalid or expired");
      // ❌ DO NOT auto clear token
      // ❌ DO NOT redirect here
    }

    if (status === 403) {
      console.warn("⛔ 403 Forbidden – insufficient role/permission");
    }

    if (status >= 500) {
      console.error("🔥 Server error – backend issue");
    }

    return Promise.reject(error);
  }
);

export default api;
