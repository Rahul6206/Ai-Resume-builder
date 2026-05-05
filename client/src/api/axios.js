import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let pendingRequests = [];

function flushQueue(error, token = null) {
  pendingRequests.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });
  pendingRequests = [];
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    // Update the message check based on our backend response
    const message = error?.response?.data?.message;
    const shouldRefresh = error.response?.status === 401 && (message === "ACCESS_TOKEN_EXPIRED" || message === "Unauthorized. No token provided" || message === "Unauthorized access.");

    // Avoid infinite loops
    if (!shouldRefresh || original._retry || original.url.includes("/api/auth/user/refresh")) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ 
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          }, 
          reject 
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}api/auth/user/refresh`, 
        { refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );
      
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      original.headers.Authorization = `Bearer ${accessToken}`;
      
      flushQueue(null, accessToken);
      return api(original);
    } catch (refreshError) {
      flushQueue(refreshError);
      
      // If refresh fails completely, force logout by clearing tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.dispatchEvent(new Event("auth-expired")); // Let context know
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
