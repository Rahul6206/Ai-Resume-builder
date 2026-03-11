import { useState, useCallback } from "react";

// ============================================
// CONSTANTS
// ============================================

export const INITIAL_FORM_DATA = {
  fullname: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  portfolio: "",
  profileSummary: "",
  education: [{ degree: "", institution: "", startYear: "", endYear: "", percentage: "" }],
  technicalSkills: ["", ""],
  workExperience: [{
    id: crypto.randomUUID(),
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: ""
  }],
  projects: [{
    id: crypto.randomUUID(),
    title: "",
    description: "",
    technologies: [],
    link: "",
    githubLink: ""
  }],
  certifications: [{
    id: crypto.randomUUID(),
    title: "",
    organization: "",
    issueDate: "",
    credentialUrl: ""
  }],
  languages: ["", ""],
  interests: ["", ""],
};

export const ARRAY_ITEM_TEMPLATES = {
  education: () => ({ degree: "", institution: "", startYear: "", endYear: "", percentage: "" }),
  workExperience: () => ({
    id: crypto.randomUUID(),
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  }),
  projects: () => ({
    id: crypto.randomUUID(),
    title: "",
    description: "",
    technologies: [],
    link: "",
    githubLink: "",
  }),
  certifications: () => ({
    id: crypto.randomUUID(),
    title: "",
    organization: "",
    issueDate: "",
    credentialUrl: "",
  }),
  technicalSkills: () => "",
  languages: () => "",
  interests: () => "",
};

export const VALIDATION_RULES = {
  fullname: {
    validate: (val) => val.trim().length >= 3 && val.trim().length <= 100,
    error: "Full name is required (3-100 characters)"
  },
  email: {
    validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    error: "Enter a valid email"
  },
  phone: {
    validate: (val) => /^[0-9]{10}$/.test(val),
    error: "Phone number must be 10 digits"
  },
  linkedin: {
    validate: (val) => !val || /^https?:\/\/.+/.test(val),
    error: "Enter valid LinkedIn URL"
  },
  github: {
    validate: (val) => !val || /^https?:\/\/.+/.test(val),
    error: "Enter valid GitHub URL"
  },
  portfolio: {
    validate: (val) => !val || /^https?:\/\/.+/.test(val),
    error: "Enter valid portfolio URL"
  },
  profileSummary: {
    validate: (val) => val.trim().length >= 20 && val.trim().length <= 800,
    error: "Profile summary must be descriptive (20-800 characters)"
  },
  degree: {
    validate: (val) => val.trim().length >= 2,
    error: "Degree is required (min 2 characters)"
  },
  institution: {
    validate: (val) => val.trim().length >= 3,
    error: "Institution is required (min 3 characters)"
  },
  startYear: {
    validate: (val) => {
      const year = parseInt(val);
      return year >= 1900 && year <= new Date().getFullYear();
    },
    error: "Enter a valid start year"
  },
  skill: {
    validate: (val) => val.trim().length >= 2,
    error: "Skill name must be at least 2 characters"
  },
  company: {
    validate: (val) => val.trim().length >= 2,
    error: "Company name is required (min 2 characters)"
  },
  position: {
    validate: (val) => val.trim().length >= 2,
    error: "Position is required (min 2 characters)"
  },
  startDate: {
    validate: (val) => val && !isNaN(Date.parse(val)),
    error: "Start date is required"
  },
  projectTitle: {
    validate: (val) => val.trim().length >= 2,
    error: "Project title is required (min 2 characters)"
  },
  projectDescription: {
    validate: (val) => val.trim().length >= 10,
    error: "Description should be at least 10 characters"
  },
  certTitle: {
    validate: (val) => val.trim().length >= 3,
    error: "Certificate title is required (min 3 characters)"
  },
  language: {
    validate: (val) => val.trim().length >= 2,
    error: "Language name is required (min 2 characters)"
  },
  interest: {
    validate: (val) => val.trim().length >= 2,
    error: "Interest name is required (min 2 characters)"
  },
};

// ============================================
// CUSTOM HOOK
// ============================================

export const useResumeForm = (initialData) => {
  const [formData, setFormData] = useState(initialData);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateArrayItem = useCallback((arrayName, index, field, value) => {
    setFormData(prev => {
      const updated = [...prev[arrayName]];
      updated[index] = {
        ...updated[index],
        [field]: value
      };

      return { ...prev, [arrayName]: updated };
    });
  }, []);

  const addArrayItem = useCallback((arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], ARRAY_ITEM_TEMPLATES[arrayName]()]
    }));
  }, []);

  const removeArrayItem = useCallback((arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  }, []);

  const cleanData = useCallback((data) => {
    const isValid = (val) => {
      if (typeof val === 'string') return val.trim().length > 0;
      if (val && typeof val === 'object') {
        return Object.values(val).some(v => v?.toString().trim().length > 0);
      }
      return !!val;
    };

    const toStringArray = (arr) =>
      (arr || [])
        .filter(isValid)
        .map(item => typeof item === 'object' ? item[""] || "" : item)
        .filter(s => s.trim().length > 0);

    const technicalSkillsw = toStringArray(data.technicalSkills?.map(s => {
          // Handle {"": "REACT"} or {name: "REACT"} or plain "REACT"
          if (typeof s === "string") return s;
          return s.name || s[""] || Object.values(s)[0] || "";
        }).filter(s => s.trim()) || [])

    return {
      ...data,
      technicalSkills: technicalSkillsw,

      languages: toStringArray(data.languages),
      interests: toStringArray(data.interests),
      workExperience: data.workExperience?.filter(exp => exp.company?.trim() || exp.position?.trim()) || [],
      projects: data.projects?.filter(proj => proj.title?.trim()) || [],
      certifications: data.certifications?.filter(cert => cert.title?.trim()) || [],
      linkedin: data.linkedin?.trim() || undefined,
      github: data.github?.trim() || undefined,
      portfolio: data.portfolio?.trim() || undefined,
    };
  }, []);

  return {
    formData,
    setFormData,
    updateField,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
    cleanData
  };
};
