import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : "";
}

let isRefreshing = false;
let pendingRequests = [];

function flushQueue(error) {
  pendingRequests.forEach((p) => (error ? p.reject(error) : p.resolve()));
  pendingRequests = [];
}

api.interceptors.request.use((config) => {
  if (!["get", "head", "options"].includes((config.method || "get").toLowerCase())) {
    const csrfToken = getCookie("csrfToken");
    if (csrfToken) config.headers["x-csrf-token"] = csrfToken;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const message = error?.response?.data?.message;
    const shouldRefresh = error.response?.status === 401 && message === "ACCESS_TOKEN_EXPIRED";

    if (!shouldRefresh || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => pendingRequests.push({ resolve: () => resolve(api(original)), reject }));
    }

    isRefreshing = true;

    try {
      await api.post("/api/auth/user/refresh");
      flushQueue();
      return api(original);
    } catch (refreshError) {
      flushQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
