import React from 'react';

const StepIndicator = ({ currentStep }) => {
    const steps = [
        { num: 1, label: "Contact" },
        { num: 2, label: "Professional" },
        { num: 3, label: "Experience" },
        { num: 4, label: "Languages" },
    ];
    return (
        <div className="mb-12 relative z-10">
            {/* Background Line */}
            <div className="absolute top-5 left-0 w-full h-[2px] bg-zinc-800 -z-10 rounded-full " />

            <div className="flex justify-between items-center w-full max-w-4xl mx-auto">
                {steps.map((step, idx) => {
                    const isActive = step.num <= currentStep;
                    const isCurrent = step.num === currentStep;

                    return (
                        <div key={step.num} className="flex flex-col items-center relative group">
                            <div
                                className={`
                                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 border-2
                                    ${isActive
                                        ? "bg-zinc-900 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                                        : "bg-black border-zinc-800 text-zinc-600"
                                    }
                                    ${isCurrent ? "scale-110 ring-4 ring-purple-500/20" : ""}
                                `}
                            >
                                {isActive ? (
                                    <span className="bg-linear-to-br from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                        {step.num}
                                    </span>
                                ) : (
                                    step.num
                                )}
                            </div>

                            <span
                                className={`
                                    absolute -bottom-8 text-xs font-medium tracking-wide transition-all duration-300
                                    ${isActive ? "text-white" : "text-zinc-600"}
                                `}
                            >
                                {step.label}
                            </span>

                            {/* Connecting Line Progress */}
                            {idx < steps.length - 1 && (
                                <div
                                    className={`
                                        absolute top-5 left-1/2 w-[calc(100%*2)] h-[2px] -z-20 origin-left transition-all duration-700
                                        ${step.num < currentStep ? "bg-linear-to-r from-purple-600 to-indigo-600 scale-x-100" : "bg-transparent scale-x-0"}
                                    `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StepIndicator;