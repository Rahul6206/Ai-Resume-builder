import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { createResume, updateResume } from "../../api/resumeApi"

// Imported Step Components
import Navbar from "../../components/UserInterface/Navbar";
import Footer from "../../components/UserInterface/Footer";
import StepIndicator from "../../components/Resume/StepIndicator";
import Step1Contact from "../../components/Resume/Step1Contact";
import Step2Professional from "../../components/Resume/Step2Professional";
import Step3Experience from "../../components/Resume/Step3Experience";
import Step4Languages from "../../components/Resume/Step4Languages";
import { ChevronLeft, ChevronRight, Save, Pencil, Sparkles } from "../../icons";

const CreateResume = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [resumeId, setResumeId] = useState(null);

  const stepRef = useRef({});

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    profileSummary: "",
    education: [{ degree: "", institution: "", startYear: "", endYear: "", percentage: "" }],
    technicalSkills:  [
  { id: crypto.randomUUID(), name: "" }
],
    workExperience: [
  {
    id: crypto.randomUUID(),
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: ""
  }
],

    projects: [{ title: "", description: "", technologies: [], link: "", githubLink: "" }],
    certifications: [{ title: "", organization: "", issueDate: "", credentialUrl: "" }],
    languages: ["English", ""],
    interests: ["", ""],
  });

  useEffect(() => {
   if (location.state && location.state.resumeData) {
  const data = location.state.resumeData;

  const withIds = (arr) =>
    arr.map((item) => ({
      id: item.id || item._id || crypto.randomUUID(),
      ...item,
    }));

  setFormData((prev) => ({
    ...prev,
    ...data,
    workExperience: withIds(data.workExperience || prev.workExperience),
    projects: withIds(data.projects || prev.projects),
    certifications: withIds(data.certifications || prev.certifications),
  }));
}

  }, [location.state]);

  const validationRules = {
    fullname: { validate: (val) => val.trim().length >= 3 && val.trim().length <= 100, error: "Full name is required (3-100 characters)" },
    email: { validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), error: "Enter a valid email" },
    phone: { validate: (val) => /^[0-9]{10}$/.test(val), error: "Phone number must be 10 digits" },
    linkedin: { validate: (val) => !val || (val && /^https?:\/\/.+/.test(val)), error: "Enter valid LinkedIn URL" },
    github: { validate: (val) => !val || (val && /^https?:\/\/.+/.test(val)), error: "Enter valid GitHub URL" },
    portfolio: { validate: (val) => !val || (val && /^https?:\/\/.+/.test(val)), error: "Enter valid portfolio URL" },
    profileSummary: { validate: (val) => val.trim().length >= 20 && val.trim().length <= 800, error: "Profile summary must be descriptive (20-800 characters)" },

    // Education
    degree: { validate: (val) => val.trim().length >= 2, error: "Degree is required (min 2 characters)" },
    institution: { validate: (val) => val.trim().length >= 3, error: "Institution is required (min 3 characters)" },
    startYear: { validate: (val) => { const year = parseInt(val); return year >= 1900 && year <= new Date().getFullYear(); }, error: "Enter a valid start year" },

    // Skills
    skill: { validate: (val) => val.trim().length >= 2, error: "Skill name must be at least 2 characters" },

    // Work Experience
    company: { validate: (val) => val.trim().length >= 2, error: "Company name is required (min 2 characters)" },
    position: { validate: (val) => val.trim().length >= 2, error: "Position is required (min 2 characters)" },
    startDate: { validate: (val) => val && !isNaN(Date.parse(val)), error: "Start date is required" },

    // Projects
    projectTitle: { validate: (val) => val.trim().length >= 2, error: "Project title is required (min 2 characters)" },
    projectDescription: { validate: (val) => val.trim().length >= 10, error: "Description should be at least 10 characters" },

    // Certifications
    certTitle: { validate: (val) => val.trim().length >= 3, error: "Certificate title is required (min 3 characters)" },

    // Languages & Interests
    language: { validate: (val) => val.trim().length >= 2, error: "Language name is required (min 2 characters)" },
    interest: { validate: (val) => val.trim().length >= 2, error: "Interest name is required (min 2 characters)" },
  };

  const handleArrayInputChange = (arrayName, index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev[arrayName]];
      if (field === "") {
        updated[index] = value;
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, [arrayName]: updated };
    });
  };

  const addArrayItem = (arrayName) => {
  setFormData((prev) => {
    const newItem =
    arrayName === "education" ? { degree: "", institution: "", startYear: "", endYear: "", percentage: "" }
      : arrayName === "workExperience"
        ? {
            id: crypto.randomUUID(),
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
          }
        : arrayName === "projects"
        ? {
            id: crypto.randomUUID(),
            title: "",
            description: "",
            technologies: [],
            link: "",
            githubLink: "",
          }
        : arrayName === "certifications"
        ? {
            id: crypto.randomUUID(),
            title: "",
            organization: "",
            issueDate: "",
            credentialUrl: "",
          }
        : "";

    return { ...prev, [arrayName]: [...prev[arrayName], newItem] };
  });
};


  const removeArrayItem = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };


  const handleNext = () => {
    if (stepRef.current && stepRef.current.validate && stepRef.current.validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (stepRef.current && stepRef.current.validate && stepRef.current.validate()) {
      try {
        setIsLoading(true);
        toast.info(isEditMode ? "Updating resume..." : "Creating resume...");

        const cleanedData = {
          ...formData,
          technicalSkills: formData.technicalSkills.filter(s => s.trim() !== ''),
          languages: formData.languages.filter(s => s.trim() !== ''),
          interests: formData.interests.filter(s => s.trim() !== ''),

          workExperience: formData.workExperience.filter(exp => exp.company.trim() || exp.position.trim()),
          projects: formData.projects.filter(proj => proj.title.trim()),
          certifications: formData.certifications.filter(cert => cert.title.trim()),

          linkedin: formData.linkedin || undefined,
          github: formData.github || undefined,
          portfolio: formData.portfolio || undefined,
        };

        let response;
        if (isEditMode && resumeId) {
          response = await updateResume(resumeId, cleanedData);
          toast.success("Resume updated successfully!");
        } else {
          response = await createResume(cleanedData);
          toast.success("Resume created successfully!");
        }

        const targetResumeId = response.data.resume._id;
        navigate(`/resume-preview/${targetResumeId}`);

      } catch (error) {
        let errorMessage = "An unexpected error occurred.";

        if (error.response && error.response.data && error.response.data.errors) {
          errorMessage = error.response.data.message || "Validation failed on the server.";
          toast.error(errorMessage);
          error.response.data.errors.forEach(err => {
            toast.warn(`Server: Field '${err.field}' - ${err.message}`, { autoClose: 7000 });
          });
        } else if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
          toast.error(errorMessage);
        } else {
          toast.error("Network or server connection failed.");
        }
        console.error("Submission Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStep = () => {
    const stepProps = {
      formData,
      setFormData,
      validationRules,
      handleArrayInputChange,
      removeArrayItem,
      addArrayItem,
      ref: stepRef,
    };

    switch (currentStep) {
      case 1:
        return <Step1Contact {...stepProps} />;
      case 2:
        return <Step2Professional {...stepProps} />;
      case 3:
        return <Step3Experience {...stepProps} />;
      case 4:
        return <Step4Languages {...stepProps} />;
      default:
        return <div>Error: Invalid Step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 selection:text-purple-200 font-sans">

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-[128px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-grow pt-32 pb-20 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">

            {isEditMode && (
              <div className="flex items-center justify-center mb-8 animate-fade-up">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
                  <Pencil size={14} />
                  <span>Editing Resume Mode</span>
                </div>
              </div>
            )}

            <StepIndicator currentStep={currentStep} />

            <div className="bg-zinc-900/30 backdrop-blur-xl rounded-3xl border border-white/5 p-8 md:p-12 mb-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/50 via-indigo-500/50 to-transparent"></div>

              {renderStep()}
            </div>

            <div className="flex justify-between items-center px-2">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
                  ${currentStep === 1
                    ? "opacity-0 cursor-default"
                    : "bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5 hover:border-white/10"
                  }
                `}
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
                  className="
                    flex items-center gap-2 px-8 py-3 rounded-xl font-semibold 
                    bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                    hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98]
                    transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100
                  "
                >
                  <Save size={20} />
                  {isLoading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Resume" : "Create Resume")}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="
                    flex items-center gap-2 px-8 py-3 rounded-xl font-semibold 
                    bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                    hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98]
                    transition-all duration-300
                  "
                >
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
