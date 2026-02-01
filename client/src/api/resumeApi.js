import api from "./axios";

export const createResume = (formData) => {
    return api.post("/api/resume/create", formData, {
        withCredentials: true,
    });
};

export const getMyResumes = () => {
    return api.get("/api/resume/my_resume", {
        withCredentials: true,
    });
};

export const getResumeById = (resumeId) => {
    return api.get(`/api/resume/${resumeId}`, {
        withCredentials: true
    });
};

export const updateResume = (id, formData) => {
    return api.put(`/api/resume/${id}`, formData, {
        withCredentials: true,
    });
};

export const deleteResume = (id) => {
    return api.delete(`/api/resume/${id}`, {
        withCredentials: true,
    });
};
