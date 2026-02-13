import React from 'react';
import { toast } from 'react-toastify';
import { Plus, X, Briefcase, FolderGit2, Award, Terminal } from 'lucide-react';



 const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                placeholder={placeholder}
            />
        </div>
    );

    // Reusable TextArea
    const TextArea = ({ label, value, onChange, placeholder, height = "h-20" }) => (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</label>
            <textarea
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all resize-none ${height}`}
                placeholder={placeholder}
            />
        </div>
    );

const Step3Experience = React.forwardRef(({ formData, handleArrayInputChange, removeArrayItem, addArrayItem, validationRules, setFormData }, ref) => {


    console.log("Rendered Step3");



    const validate = () => {

        // ===== SKILLS =====
        const validSkills = formData.technicalSkills.filter(
            (s) => s.name?.trim().length > 0
        );

        if (validSkills.length === 0) {
            toast.error("At least one skill required");
            return false;
        }

        for (let skill of validSkills) {
            if (!validationRules.skill.validate(skill.name)) {
                toast.error(`Skill: ${validationRules.skill.error}`);
                return false;
            }
        }

        // ===== WORK EXPERIENCE =====
        for (let work of formData.workExperience) {

            const hasAnyField =
                work.company?.trim() ||
                work.position?.trim() ||
                work.startDate?.trim() ||
                work.endDate?.trim() ||
                work.description?.trim();

            if (!hasAnyField) continue;

            if (!work.company || !work.position || !work.startDate) {
                toast.error("All work experience fields are required");
                return false;
            }

            if (!validationRules.company.validate(work.company)) {
                toast.error(`Work Exp: ${validationRules.company.error}`);
                return false;
            }

            if (!validationRules.position.validate(work.position)) {
                toast.error(`Work Exp: ${validationRules.position.error}`);
                return false;
            }

            if (!validationRules.startDate.validate(work.startDate)) {
                toast.error(`Work Exp: ${validationRules.startDate.error}`);
                return false;
            }

            if (work.description && work.description.length > 500) {
                toast.error(`Work Exp: Description cannot exceed 500 characters`);
                return false;
            }
        }

        // ===== PROJECTS =====
        for (let proj of formData.projects) {
            const hasAnyField =
                proj.title?.trim() || proj.description?.trim();

            if (!hasAnyField) continue;

            if (!validationRules.projectTitle.validate(proj.title)) {
                toast.error(`Project: ${validationRules.projectTitle.error}`);
                return false;
            }

            if (!validationRules.projectDescription.validate(proj.description)) {
                toast.error(`Project: ${validationRules.projectDescription.error}`);
                return false;
            }

            if (proj.link && !validationRules.linkedin.validate(proj.link)) {
                toast.error(`Project Link: Enter a valid URL`);
                return false;
            }
        }

        // ===== CERTIFICATIONS =====
        for (let cert of formData.certifications) {
            const hasAnyField =
                cert.title?.trim() ||
                cert.organization?.trim() ||
                cert.issueDate?.trim() ||
                cert.credentialUrl?.trim();

            if (!hasAnyField) continue;

            if (!validationRules.certTitle.validate(cert.title)) {
                toast.error(`Certification: ${validationRules.certTitle.error}`);
                return false;
            }

            if (cert.credentialUrl &&
                !validationRules.linkedin.validate(cert.credentialUrl)) {
                toast.error(`Certification URL: Provide a valid credential URL`);
                return false;
            }
        }

        return true;
    };


    React.useImperativeHandle(ref, () => ({
        validate: validate
    }));

    // Reusable Section Header
    const SectionHeader = ({ title, subtitle, onAdd, buttonText }) => (
        <div className="flex justify-between items-end mb-6 border-b border-white/5 pb-4">
            <div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="text-zinc-400 text-sm mt-1">{subtitle}</p>
            </div>
            {onAdd && (
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-all hover:border-purple-500/30"
                >
                    <Plus size={14} /> {buttonText}
                </button>
            )}
        </div>
    );

    // Reusable Remove Button
    const RemoveButton = ({ onClick }) => (
        <button
            onClick={onClick}
            className="absolute right-4 top-4 text-zinc-600 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-lg"
        >
            <X size={16} />
        </button>
    );

    // Reusable Input
   

    return (
        <div className="space-y-12 animate-fade-up">

            {/* Technical Skills */}
            <div>
                <SectionHeader
                    title="Technical Skills"
                    subtitle="Languages, frameworks, and tools you excel at."
                    onAdd={() => addArrayItem("technicalSkills")}
                    buttonText="Add Skill"
                />
                <div className="grid md:grid-cols-3 gap-4">
                    {formData.technicalSkills.map((skill, idx) => (
                        <div key={skill.id} className="relative group">
                            <div className="absolute left-3 top-3 text-zinc-600 pointer-events-none">
                                <Terminal size={16} />
                            </div>
                            <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => handleArrayInputChange("technicalSkills", idx, "name", e.target.value)}
                                className="w-full pl-10 pr-10 py-3 bg-zinc-900/30 border border-white/5 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-zinc-900/50 transition-all"
                                placeholder="e.g. React.js"
                            />
                            {formData.technicalSkills.length > 1 && (
                                <button
                                    onClick={() => removeArrayItem("technicalSkills", idx)}
                                    className="absolute right-2 top-2 text-zinc-600 hover:text-red-400 p-1 hover:bg-white/5 rounded"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Work Experience */}
            <div>
                <SectionHeader
                    title="Work Experience"
                    subtitle="Your past roles and achievements."
                    onAdd={() => addArrayItem("workExperience")}
                    buttonText="Add Experience"
                />
                <div className="space-y-6">
                    {formData.workExperience.map((work, idx) => {
                        console.log("Work ID:", work.id);

                        return (
                            <div
                                key={work.id}
                                className="relative p-6 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-white/10 transition-all"
                            >
                                <RemoveButton onClick={() => removeArrayItem("workExperience", idx)} />

                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                        <Briefcase size={20} />
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                                        Role #{idx + 1}
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <Input
                                        label="Company *"
                                        value={work.company}
                                        onChange={(e) =>
                                            handleArrayInputChange("workExperience", idx, "company", e.target.value)
                                        }
                                        placeholder="Google"
                                    /><Input label="Position *" value={work.position} onChange={(e) => handleArrayInputChange("workExperience", idx, "position", e.target.value)} placeholder="Senior Developer" />
                                <Input label="Start Date *" type="date" value={work.startDate} onChange={(e) => handleArrayInputChange("workExperience", idx, "startDate", e.target.value)} />
                                <Input label="End Date" type="date" value={work.endDate} onChange={(e) => handleArrayInputChange("workExperience", idx, "endDate", e.target.value)} />
                                <div className="md:col-span-2">
                                    <TextArea label="Description" value={work.description} onChange={(e) => handleArrayInputChange("workExperience", idx, "description", e.target.value)} placeholder="Describe your key responsibilities and achievements..." />
                                </div>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>

            {/* Projects */}
            <div>
                <SectionHeader
                    title="Projects"
                    subtitle="Notable projects you've worked on."
                    onAdd={() => addArrayItem("projects")}
                    buttonText="Add Project"
                />
                <div className="space-y-6">
                    {formData.projects.map((proj, idx) => (
                        <div key={proj.id} className="relative p-6 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                            <RemoveButton onClick={() => removeArrayItem("projects", idx)} />

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                    <FolderGit2 size={20} />
                                </div>
                                <span className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Project #{idx + 1}</span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <Input label="Project Title *" value={proj.title} onChange={(e) => handleArrayInputChange("projects", idx, "title", e.target.value)} placeholder="E-commerce App" />
                                <Input label="Project Link" value={proj.link} onChange={(e) => handleArrayInputChange("projects", idx, "link", e.target.value)} placeholder="https://..." type="url" />
                                <div className="md:col-span-2">
                                    <TextArea label="Description *" value={proj.description} onChange={(e) => handleArrayInputChange("projects", idx, "description", e.target.value)} placeholder="Briefly describe the tech stack and outcome..." />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Certifications */}
            <div>
                <SectionHeader
                    title="Certifications"
                    subtitle="Courses, certifications and awards."
                    onAdd={() => addArrayItem("certifications")}
                    buttonText="Add Cert"
                />
                <div className="space-y-6">
                    {formData.certifications.map((cert, idx) => (
                        <div key={cert.id} className="relative p-6 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                            <RemoveButton onClick={() => removeArrayItem("certifications", idx)} />

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                                    <Award size={20} />
                                </div>
                                <span className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Certificate #{idx + 1}</span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <Input label="Title *" value={cert.title} onChange={(e) => handleArrayInputChange("certifications", idx, "title", e.target.value)} placeholder="AWS Certified" />
                                <Input label="Organization" value={cert.organization} onChange={(e) => handleArrayInputChange("certifications", idx, "organization", e.target.value)} placeholder="Amazon" />
                                <Input label="Issue Date" type="date" value={cert.issueDate} onChange={(e) => handleArrayInputChange("certifications", idx, "issueDate", e.target.value)} />
                                <Input label="Credential URL" type="url" value={cert.credentialUrl} onChange={(e) => handleArrayInputChange("certifications", idx, "credentialUrl", e.target.value)} placeholder="https://..." />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default Step3Experience;
