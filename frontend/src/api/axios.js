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
// FIX #11: Transparently refresh expired access tokens instead of silently failing.
// On 401 → attempt POST /auth/refresh-token → update localStorage → retry original request.
// If refresh also fails → clear storage and redirect to /login.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      // Prevent infinite retry loops
      if (isRefreshing) {
        // Queue subsequent 401s while a refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // No refresh token available — force login
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${getBaseURL()}/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = data.accessToken;
        localStorage.setItem("token", newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) {
      console.warn("Forbidden — insufficient permissions.");
    } else if (status >= 500) {
      console.error("Server error:", error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

