import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { createResume, updateResume } from "../../api/resumeApi";

// Components
import Navbar from "../../components/UserInterface/Navbar";
import Footer from "../../components/UserInterface/Footer";
import StepIndicator from "../../components/Resume/StepIndicator";
import Step1Contact from "../../components/Resume/Step1Contact";
import Step2Professional from "../../components/Resume/Step2Professional";
import Step3Experience from "../../components/Resume/Step3Experience";
import Step4Languages from "../../components/Resume/Step4Languages";
import { ChevronLeft, ChevronRight, Save, Pencil } from "lucide-react";

// Constants
const INITIAL_FORM_DATA = {
  fullname: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  portfolio: "",
  profileSummary: "",
  education: [{ degree: "", institution: "", startYear: "", endYear: "", percentage: "" }],
  technicalSkills: [{ id: crypto.randomUUID(), name: "" }],
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
  languages: ["English", ""],
  interests: ["", ""],
};

const ARRAY_ITEM_TEMPLATES = {
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
  technicalSkills: () => ({
  id: crypto.randomUUID(),
  name: ""
}),
 languages: () => "",
  interests: () => "",
};


const VALIDATION_RULES = {
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

// Custom hook for form management
const useResumeForm = (initialData) => {
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
    const isNonEmpty = (item) => {
      if (typeof item === 'string') return item.trim() !== '';
      if (item && typeof item === 'object') {
        return Object.values(item).some(v =>
          typeof v === 'string' ? v.trim() !== '' : v !== undefined && v !== null
        );
      }
      return false;
    };

    return {
      ...data,
      technicalSkills: data.technicalSkills.filter(s => s.name?.trim() !== ''),
      languages: data.languages.filter(isNonEmpty),
      interests: data.interests.filter(isNonEmpty),
      workExperience: data.workExperience.filter(exp => exp.company.trim() || exp.position.trim()),
      projects: data.projects.filter(proj => proj.title.trim()),
      certifications: data.certifications.filter(cert => cert.title.trim()),
      linkedin: data.linkedin || undefined,
      github: data.github || undefined,
      portfolio: data.portfolio || undefined,
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

const CreateResume = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [resumeId, setResumeId] = useState(null);

  const stepRef = useRef({});

  const {
    formData,
    setFormData,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
    cleanData
  } = useResumeForm(INITIAL_FORM_DATA);

  // Load resume data from navigation state
  useEffect(() => {
    const resumeData = location.state?.resumeData;
    if (!resumeData) return;

    const addIds = (arr = []) => arr.map(item => ({
      id: item.id || item._id || crypto.randomUUID(),
      ...item,
    }));

    setFormData(prev => ({
      ...prev,
      ...resumeData,
      workExperience: addIds(resumeData.workExperience),
      projects: addIds(resumeData.projects),
      certifications: addIds(resumeData.certifications),
    }));

    if (resumeData._id) {
      setIsEditMode(true);
      setResumeId(resumeData._id);
    }
  }, [location.state, setFormData]);

  const handleNext = useCallback(() => {
    if (stepRef.current?.validate?.()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep(prev => prev + 1);
    }
  }, []);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    if (!stepRef.current?.validate?.()) return;

    try {
      setIsLoading(true);
      toast.info(isEditMode ? "Updating resume..." : "Creating resume...");

      const cleanedData = cleanData(formData);
      const apiCall = isEditMode && resumeId
        ? updateResume(resumeId, cleanedData)
        : createResume(cleanedData);

      const response = await apiCall;
      toast.success(isEditMode ? "Resume updated successfully!" : "Resume created successfully!");

      navigate(`/resume-preview/${response.data.resume._id}`);
    } catch (error) {
      const { response } = error;

      if (response?.data?.errors) {
        toast.error(response.data.message || "Validation failed on the server.");
        response.data.errors.forEach(err => {
          toast.warn(`Server: Field '${err.field}' - ${err.message}`, { autoClose: 7000 });
        });
      } else if (response?.data?.message) {
        toast.error(response.data.message);
      } else {
        toast.error("Network or server connection failed.");
      }
      toast.error("Submission Error. Please check your input and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isEditMode, resumeId, formData, cleanData, navigate]);

 const stepProps = useMemo(() => ({
  formData,
  setFormData,
  validationRules: VALIDATION_RULES,
  handleArrayInputChange: updateArrayItem,
  removeArrayItem,
  addArrayItem,
}), [formData, updateArrayItem, removeArrayItem, addArrayItem]);



  const buttonClasses = useMemo(() => ({
    primary: "flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100",
    secondary: "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5 hover:border-white/10 transition-all duration-300",
  }), []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 selection:text-purple-200 font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="grow pt-32 pb-20 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Edit Mode Badge */}
            {isEditMode && (
              <div className="flex items-center justify-center mb-8 animate-fade-up">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
                  <Pencil size={14} />
                  <span>Editing Resume Mode</span>
                </div>
              </div>
            )}

            <StepIndicator currentStep={currentStep} />

            {/* Form Container */}
            <div className="bg-zinc-900/30 backdrop-blur-xl rounded-3xl border border-white/5 p-8 md:p-12 mb-8 shadow-2xl relative overflow-hidden">
  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-500/50 via-indigo-500/50 to-transparent" />

  {currentStep === 1 && (
    <Step1Contact
      ref={stepRef}
      formData={formData}
      setFormData={setFormData}
      validationRules={VALIDATION_RULES}
      handleArrayInputChange={updateArrayItem}
      removeArrayItem={removeArrayItem}
      addArrayItem={addArrayItem}
    />
  )}

  {currentStep === 2 && (
    <Step2Professional
      ref={stepRef}
      formData={formData}
      setFormData={setFormData}
      validationRules={VALIDATION_RULES}
      handleArrayInputChange={updateArrayItem}
      removeArrayItem={removeArrayItem}
      addArrayItem={addArrayItem}
    />
  )}

  {currentStep === 3 && (
    <Step3Experience
      ref={stepRef}
      formData={formData}
      setFormData={setFormData}
      validationRules={VALIDATION_RULES}
      handleArrayInputChange={updateArrayItem}
      removeArrayItem={removeArrayItem}
      addArrayItem={addArrayItem}
    />
  )}

  {currentStep === 4 && (
    <Step4Languages
      ref={stepRef}
      formData={formData}
      setFormData={setFormData}
      validationRules={VALIDATION_RULES}
      handleArrayInputChange={updateArrayItem}
      removeArrayItem={removeArrayItem}
      addArrayItem={addArrayItem}
    />
  )}
</div>
    


            {/* Navigation Buttons */}
            <div className="flex justify-between items-center px-2">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`${buttonClasses.secondary} ${currentStep === 1 ? "opacity-0 cursor-default" : ""}`}
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <span className="text-zinc-500 text-sm font-medium tracking-wide">
                Step {currentStep} of 4
              </span>

              {currentStep === 4 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={buttonClasses.primary}
                >
                  <Save size={20} />
                  {isLoading
                    ? (isEditMode ? "Updating..." : "Creating...")
                    : (isEditMode ? "Update Resume" : "Create Resume")
                  }
                </button>
              ) : (
                <button onClick={handleNext} className={buttonClasses.primary}>
                  Next
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default CreateResume;