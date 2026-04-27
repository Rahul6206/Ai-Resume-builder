import api from "./axios";

export const fetchCsrfToken = () => api.get("/api/auth/user/csrf-token");
export const registerUser = (formData) => api.post("/api/auth/user/register", formData);
export const loginUser = (formData) => api.post("/api/auth/user/login", formData);
export const verifyOtp = (formData) => api.post("/api/auth/user/verify", formData);
export const logoutUser = () => api.post("/api/auth/user/logout");
export const sendOtp = (formData) => api.post("/api/auth/user/sendOtp", formData);
export const forgotPassword = (formData) => api.post("/api/auth/user/forgot-password", formData);
export const resetPassword = (formData) => api.post("/api/auth/user/reset-password", formData);
export const refreshSession = () => api.post("/api/auth/user/refresh");
export const getCurrentUser = () => api.get("/api/auth/user/me");
