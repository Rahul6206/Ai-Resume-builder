import api from "./axios";

export const generateAiResumes = (template, resumeData) =>
    api.post(
        "/api/ai/generate-resume",
        { template, resumeData },
        {
            responseType: "blob",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/pdf",
            },
        }
    );

