import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

const NavigationButtons = ({ 
  currentStep, 
  totalSteps = 4,
  isLoading = false,
  isEditMode = false,
  onPrevious, 
  onNext, 
  onSubmit 
}) => {
  
  const buttonClasses = useMemo(() => ({
    primary: "flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100",
    secondary: "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5 hover:border-white/10 transition-all duration-300",
  }), []);

  const isFinalStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className="flex justify-between items-center px-2">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={isFirstStep}
        className={`${buttonClasses.secondary} ${isFirstStep ? "opacity-0 cursor-default" : ""}`}
      >
        <ChevronLeft size={20} />
        Previous
      </button>

      {/* Step Indicator */}
      <span className="text-zinc-500 text-sm font-medium tracking-wide">
        Step {currentStep} of {totalSteps}
      </span>

      {/* Next/Submit Button */}
      {isFinalStep ? (
        <button
          onClick={onSubmit}
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
        <button onClick={onNext} className={buttonClasses.primary}>
          Next
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;
