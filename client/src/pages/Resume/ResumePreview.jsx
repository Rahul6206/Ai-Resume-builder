import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getResumeById } from "../../api/resumeApi";
import { generateAiResumes } from "../../api/aiApi";
import Navbar from "../../components/UserInterface/Navbar";
import { Download, FileText, Check, LayoutTemplate, Loader2, Sparkles, ChevronRight, User, Mail, Phone, Hash, Code2 } from "lucide-react";
import Footer from "../../components/UserInterface/Footer";

const ResumePreview = () => {
    const { resumeId } = useParams();
    const [selectedTemplate, setSelectedTemplate] = useState("executive");
    const [resume, setResume] = useState(null);
    const [loadingType, setLoadingType] = useState(null);

    useEffect(() => {
        fetchResume();
    }, []);

    const fetchResume = async () => {
        try {
            const res = await getResumeById(resumeId);
            setResume(res.data.resume);
        } catch (err) {
            toast.error("Unable to load resume.");
        }
    };

    const handleGeneratePdf = async () => {
        if (!resume) {
            toast.error("Resume not loaded");
            return;
        }

        if (!selectedTemplate) {
            toast.error("Template not selected");
            return;
        }

        setLoadingType("pdf");

        try {
            const res = await generateAiResumes(selectedTemplate, resume);

            const blob = new Blob([res.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${resume.fullname.replaceAll(" ", "_")}_Resume.pdf`;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            window.URL.revokeObjectURL(url);

            toast.success("AI Resume PDF Generated!");
        } catch (err) {
            toast.error("Failed to generate AI resume PDF");
        } finally {
            setLoadingType(null);
        }
    };


    if (!resume) {
        return (
            <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/10 shadow-xl backdrop-blur-sm">
                        <Loader2 className="animate-spin text-purple-500" size={32} />
                    </div>
                    <p className="text-zinc-500 text-sm font-medium tracking-wide animate-pulse">LOADING RESUME...</p>
                </div>
            </div>
        );
    }

    const templates = [
        { id: "modern", name: "Modern", desc: "Clean & minimalistic", color: "bg-blue-500" },
        { id: "creative", name: "Creative", desc: "Bold & colorful", color: "bg-purple-500" },
        { id: "executive", name: "Executive", desc: "Professional & strict", color: "bg-emerald-500" }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 selection:text-purple-200 font-sans">

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[128px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-[128px]"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                <main className="max-w-[90rem] mx-auto px-6 lg:px-8 pt-32 pb-20 w-full">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 animate-fade-up">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 backdrop-blur-sm mb-4">
                                <Sparkles size={12} className="text-purple-400" />
                                AI Optimized Export
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                                Resume Preview
                            </h1>
                            <p className="text-zinc-400 max-w-xl text-lg">
                                Review your data and generate a professional PDF.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start h-full">

                        <div className="h-full animate-fade-up" style={{ animationDelay: '0.1s' }}>
                            <div className="h-full bg-zinc-900/40 backdrop-blur-2xl rounded-3xl border border-white/5 p-6 shadow-2xl relative overflow-hidden flex flex-col">

                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                                    <div className="w-14 h-14 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-white/10 flex items-center justify-center shadow-inner">
                                        <User size={28} className="text-zinc-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white truncate max-w-[200px]">{resume.fullname}</h2>
                                        <p className="text-zinc-500 font-medium text-sm">Candidate Profile</p>
                                    </div>
                                </div>

                                <div className="space-y-6 flex-grow">
                                    <div>
                                        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <div className="w-1 h-3 bg-purple-500 rounded-full"></div>
                                            Contact Info
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="p-3 bg-black/20 rounded-xl border border-white/5 flex items-center gap-3">
                                                <div className="p-1.5 bg-white/5 rounded-lg text-zinc-400">
                                                    <Mail size={16} />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-[10px] text-zinc-500 uppercase">Email</p>
                                                    <p className="text-sm text-white font-medium truncate" title={resume.email}>{resume.email}</p>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-black/20 rounded-xl border border-white/5 flex items-center gap-3">
                                                <div className="p-1.5 bg-white/5 rounded-lg text-zinc-400">
                                                    <Phone size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-zinc-500 uppercase">Phone</p>
                                                    <p className="text-sm text-white font-medium">{resume.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
                                            Skills
                                        </h3>
                                        <div className="bg-black/20 rounded-xl border border-white/5 p-4">
                                            <div className="flex flex-wrap gap-2">
                                                {resume.technicalSkills.map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2.5 py-1 bg-zinc-800/50 rounded-md text-xs text-zinc-300 border border-white/5"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                                            Summary
                                        </h3>
                                        <div className="p-4 bg-black/20 rounded-xl border border-white/5 text-zinc-400 text-sm leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
                                            {resume.profileSummary || "No summary provided."}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-full animate-fade-up" style={{ animationDelay: '0.2s' }}>
                            <div className="h-full bg-zinc-900/40 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-xl flex flex-col">
                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <LayoutTemplate size={20} className="text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white">Select Template</h3>
                                        <p className="text-xs text-zinc-500">Choose your PDF style</p>
                                    </div>
                                </div>

                                <div className="space-y-3 flex-grow">
                                    {templates.map((tpl) => (
                                        <button
                                            key={tpl.id}
                                            onClick={() => setSelectedTemplate(tpl.id)}
                                            className={`
                                                w-full relative group flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 text-left
                                                ${selectedTemplate === tpl.id
                                                    ? "bg-white/5 border-purple-500/50 shadow-inner"
                                                    : "bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10"
                                                }
                                            `}
                                        >
                                            <div className={`
                                                w-12 h-12 rounded-lg flex items-center justify-center transition-all
                                                ${selectedTemplate === tpl.id ? tpl.color : "bg-zinc-800"}
                                            `}>
                                                <FileText size={20} className="text-white" />
                                            </div>

                                            <div className="flex-1">
                                                <p className={`text-sm font-semibold transition-colors ${selectedTemplate === tpl.id ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}`}>
                                                    {tpl.name}
                                                </p>
                                                <p className="text-xs text-zinc-600">{tpl.desc}</p>
                                            </div>

                                            {selectedTemplate === tpl.id && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-purple-500/20 p-1 rounded-full">
                                                    <Check size={14} className="text-purple-400" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="h-full animate-fade-up" style={{ animationDelay: '0.3s' }}>
                            <div className="h-full bg-zinc-900/40 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-xl flex flex-col justify-between">

                                <div>
                                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                        <Download size={32} className="text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 text-center">Ready to Export?</h3>
                                    <p className="text-zinc-500 text-sm mb-8 px-2 text-center leading-relaxed">
                                        Your resume is ready. Generate a polished PDF using our AI layout engine with the <span className="text-white font-medium">{selectedTemplate}</span> template.
                                    </p>
                                </div>

                                <button
                                    onClick={handleGeneratePdf}
                                    disabled={loadingType !== null}
                                    className={`
                                        w-full relative group overflow-hidden rounded-2xl font-bold text-lg py-5 transition-all duration-300 shadow-xl
                                        ${loadingType === 'pdf' ? "cursor-not-allowed opacity-80" : "hover:scale-[1.02] hover:shadow-emerald-900/40"}
                                    `}
                                >
                                    <div className={`absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-300 ${loadingType === 'pdf' ? "" : "group-hover:brightness-110"}`}></div>

                                    <div className="relative flex items-center justify-center gap-3 text-white">
                                        {loadingType === 'pdf' ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Download PDF</span>
                                                <ChevronRight size={20} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </>
                                        )}
                                    </div>
                                </button>

                                <div className="mt-6 text-center">
                                    <p className="text-xs text-zinc-600">
                                        Securely generated & stored.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default ResumePreview;