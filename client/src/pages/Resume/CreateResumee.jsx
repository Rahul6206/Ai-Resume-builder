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

// Newly separated components
import NavigationButtons from "./Creation/NavigationButtons";
import BackgroundEffects from "./Creation/BackgroundEffects";
import EditModeBadge from "./Creation/EditModeBadge";

// Hook and Constants
import { 
  useResumeForm, 
  INITIAL_FORM_DATA, 
  VALIDATION_RULES 
} from "../../hooks/useResumeForm";

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
      technicalSkills: addIds(resumeData.technicalSkills),
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
      const apiCall = isEditMode && resumeId  ? updateResume(resumeId, cleanedData)  : createResume(cleanedData);
     
      
      try {
        const response = await apiCall;

      
      toast.success(isEditMode ? "Resume updated successfully!" : "Resume created successfully!");

      navigate(`/resume-preview/${response.data.resume._id}`);
        
      } catch (error) {
        
        toast.error(error?.response?.data?.message?.message);
        
      }
      
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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 selection:text-purple-200 font-sans">
      {/* Background Effects */}
      <BackgroundEffects />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="grow pt-32 pb-20 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Edit Mode Badge */}
            <EditModeBadge isVisible={isEditMode} />

            <StepIndicator currentStep={currentStep} />

            {/* Form Container */}
            <div className="bg-zinc-900/30 backdrop-blur-xl rounded-3xl border border-white/5 p-8 md:p-12 mb-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-500/50 via-indigo-500/50 to-transparent" />

              {currentStep === 1 && (
                <Step1Contact
                  ref={stepRef}
                  {...stepProps}
                />
              )}

              {currentStep === 2 && (
                <Step2Professional
                  ref={stepRef}
                  {...stepProps}
                />
              )}

              {currentStep === 3 && (
                <Step3Experience
                  ref={stepRef}
                  {...stepProps}
                />
              )}

              {currentStep === 4 && (
                <Step4Languages
                  ref={stepRef}
                  {...stepProps}
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <NavigationButtons
              currentStep={currentStep}
              totalSteps={4}
              isLoading={isLoading}
              isEditMode={isEditMode}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default CreateResume;
