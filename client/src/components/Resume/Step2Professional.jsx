import React from 'react';
import { toast } from 'react-toastify';
import { Plus, X, GraduationCap, AlignLeft, Calendar } from 'lucide-react';

const Step2Professional = React.forwardRef(({ formData, handleArrayInputChange, removeArrayItem, addArrayItem, validationRules, setFormData }, ref) => {

    const handleBasicInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const validate = () => {
        if (!validationRules.profileSummary.validate(formData.profileSummary)) {
            toast.error(validationRules.profileSummary.error);
            return false;
        }

        const hasValidEducationEntry = formData.education.some(edu => edu.degree.trim() || edu.institution.trim());

        if (formData.education.length === 0 || !hasValidEducationEntry) {
            toast.error("At least one education entry required");
            return false;
        }

        for (let edu of formData.education) {
            if (!edu.degree && !edu.institution && !edu.startYear) continue;

            if (!validationRules.degree.validate(edu.degree)) {
                toast.error(`Education: ${validationRules.degree.error}`);
                return false;
            }
            if (!validationRules.institution.validate(edu.institution)) {
                toast.error(`Education: ${validationRules.institution.error}`);
                return false;
            }
            if (!validationRules.startYear.validate(edu.startYear)) {
                toast.error(`Education: ${validationRules.startYear.error}`);
                return false;
            }
        }
        return true;
    };

    React.useImperativeHandle(ref, () => ({
        validate: validate
    }));

    return (
        <div className="space-y-10 animate-fade-up">

            {/* Profile Summary Section */}
            <div>
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-white mb-2">Professional Summary</h2>
                    <p className="text-zinc-400 text-sm">Write a short bio that highlights your career goals.</p>
                </div>

                <div className="group relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                        <AlignLeft size={18} className="text-zinc-600 group-focus-within:text-purple-400 transition-colors" />
                    </div>
                    <textarea
                        value={formData.profileSummary}
                        onChange={(e) => handleBasicInputChange("profileSummary", e.target.value)}
                        className="
                            w-full pl-10 pr-4 py-3 h-32
                            bg-zinc-900/50 border border-white/10 rounded-xl 
                            text-white placeholder-zinc-600 
                            focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 
                            transition-all resize-none
                        "
                        placeholder="e.g. Passionate software engineer with 5 years of experience..."
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-zinc-500">
                        {formData.profileSummary.length}/800
                    </div>
                </div>
            </div>

            {/* Education Section */}
            <div>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            Education
                        </h3>
                        <p className="text-zinc-400 text-sm mt-1">Add your academic background.</p>
                    </div>
                    <button
                        onClick={() => addArrayItem("education")}
                        className="
                            flex items-center gap-2 px-4 py-2 
                            bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg 
                            text-sm font-medium text-white transition-all
                            hover:border-purple-500/30
                        "
                    >
                        <Plus size={16} /> <span className="hidden sm:inline">Add Education</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {formData.education.map((edu, idx) => (
                        <div key={idx} className="group p-6 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-white/10 transition-all relative">

                            {/* Remove Button */}
                            {formData.education.length > 0 && (
                                <button
                                    onClick={() => removeArrayItem("education", idx)}
                                    className="absolute right-4 top-4 text-zinc-600 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-lg"
                                >
                                    <X size={18} />
                                </button>
                            )}

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                    <GraduationCap size={20} />
                                </div>
                                <span className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Education #{idx + 1}</span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Degree *</label>
                                    <input
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => handleArrayInputChange("education", idx, "degree", e.target.value)}
                                        className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                                        placeholder="e.g. Bachelor of Technology"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Institution *</label>
                                    <input
                                        type="text"
                                        value={edu.institution}
                                        onChange={(e) => handleArrayInputChange("education", idx, "institution", e.target.value)}
                                        className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                                        placeholder="e.g. University of California"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Start Year *</label>
                                    <div className="relative">
                                        <Calendar size={14} className="absolute left-3 top-3 text-zinc-600" />
                                        <input
                                            type="number"
                                            value={edu.startYear}
                                            onChange={(e) => handleArrayInputChange("education", idx, "startYear", e.target.value)}
                                            className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                                            placeholder="2020"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">End Year</label>
                                    <div className="relative">
                                        <Calendar size={14} className="absolute left-3 top-3 text-zinc-600" />
                                        <input
                                            type="number"
                                            value={edu.endYear}
                                            onChange={(e) => handleArrayInputChange("education", idx, "endYear", e.target.value)}
                                            className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                                            placeholder="2024"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Grade / CGPA</label>
                                    <input
                                        type="text"
                                        value={edu.percentage}
                                        onChange={(e) => handleArrayInputChange("education", idx, "percentage", e.target.value)}
                                        className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                                        placeholder="e.g. 3.8 GPA"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default Step2Professional;