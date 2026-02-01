import api from "./axios";

export const registerUser = (formData) => {
    return api.post("/api/auth/user/register", formData)
};

export const loginUser = (formData) => {
    return api.post("/api/auth/user/login", formData);
};

export const verifyOtp = (formData) => {
    return api.post("api/auth/user/verify", formData);
};

export const logoutUser = () => {
    return api.get("api/auth/user/logout");
};
export const sendOtp = (formData) => {
    return api.post("/api/auth/user/sendOtp", formData)
};