import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FileText, Rocket, RefreshCw, Loader2, Calendar, Edit, Plus, Search, Pencil, Trash2, AlertTriangle, X } from "lucide-react";
import { getMyResumes, deleteResume } from "../../api/resumeApi"; // Import deleteResume
import Navbar from "../../components/UserInterface/Navbar";
import Footer from "../../components/UserInterface/Footer";

const MyResumes = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const fetchResumes = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getMyResumes();
            if (res.data.success) {
                setResumes(res.data.resumes || []);
            } else {
                setError("Failed to load resumes. Server response not successful.");
                toast.error("Failed to fetch resumes list.");
            }
        } catch (err) {
            toast.error("Fetch Resumes failed.");
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError("Authentication failed. Please log in.");
                toast.error("Session expired or unauthorized access.");
            } else if (err.response && err.response.status === 404) {
                setError("API endpoint not found. Please verify the resume retrieval route.");
                toast.error("Routing error (404) encountered.");
            }
            else {
                setError("Network or server connection failed.");
                toast.error("Connection failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    const handleGenerateAi = (resumeId) => {
        navigate(`/resume-preview/${resumeId}`);
    };

    const handleCreateNew = () => {
        navigate("/create-resume");
    };

    const handleEditResume = (resume) => {
        navigate("/create-resume", { state: { resumeData: resume } });
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
    };

    const cancelDelete = () => {
        setDeleteId(null);
    };

    const executeDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            const res = await deleteResume(deleteId);

            setResumes(prev => prev.filter(r => r._id !== deleteId));
            toast.success("Resume deleted successfully.");
        } catch (err) {
            
            toast.error("Failed to delete resume. Please try again.");
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/10 shadow-xl backdrop-blur-sm">
                        <Loader2 className="animate-spin text-purple-500" size={32} />
                    </div>
                    <p className="text-zinc-500 text-sm font-medium tracking-wide animate-pulse">SYNCING RESUMES...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 selection:text-purple-200 font-sans relative">

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[128px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-[128px]"></div>
            </div>

            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform scale-100 transition-transform duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                                <AlertTriangle size={24} className="text-red-500" />
                            </div>
                            <button onClick={cancelDelete} className="text-zinc-500 hover:text-white transition-colors cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">Delete Resume?</h3>
                        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                            This action cannot be undone. This resume will be permanently removed from your account.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-zinc-300 font-medium hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all flex justify-center items-center gap-2 shadow-lg shadow-red-900/20 cursor-pointer"
                            >
                                {isDeleting ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        <Trash2 size={18} />
                                        <span>Delete</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                <main className="grow max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 w-full">

                    {error ? (
                        <div className="flex flex-col items-center justify-center h-[60vh]">
                            <div className="p-8 rounded-2xl bg-red-950/20 border border-red-500/20 text-center max-w-md backdrop-blur-xl">
                                <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                                    <FileText size={24} className="text-red-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Unable to Load Data</h3>
                                <p className="text-red-200/60 mb-6 text-sm leading-relaxed">{error}</p>
                                <button
                                    onClick={fetchResumes}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/20 mx-auto cursor-pointer"
                                >
                                    <RefreshCw size={16} /> Try Again
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-fade-up">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                                        My Resumes
                                    </h1>
                                    <p className="text-zinc-400">
                                        You have <span className="text-white font-semibold">{resumes.length}</span> saved resume{resumes.length !== 1 ? 's' : ''}.
                                    </p>
                                </div>
                                <button
                                    onClick={handleCreateNew}
                                    className="
                                        group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold cursor-pointer
                                        bg-linear-to-r from-purple-600 to-indigo-600 text-white 
                                        shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 
                                        hover:scale-[1.02] active:scale-[0.98]
                                        transition-all duration-300
                                    "
                                >
                                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                    <span>Create New</span>
                                </button>
                            </div>

                            {resumes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 px-4 rounded-3xl bg-zinc-900/30 border border-white/5 border-dashed">
                                    <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
                                        <FileText size={32} className="text-zinc-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No Resumes Found</h3>
                                    <p className="text-zinc-500 mb-8 max-w-sm text-center">It looks like you haven't created any resumes yet. Start your professional journey today.</p>
                                    <button
                                        onClick={handleCreateNew}
                                        className="
                                            flex items-center gap-2 px-8 py-3 rounded-xl font-semibold cursor-pointer
                                            bg-linear-to-r from-emerald-500 to-teal-500 text-white 
                                            shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40
                                            hover:scale-[1.02] active:scale-[0.98]
                                            transition-all duration-300
                                        "
                                    >
                                        <Rocket size={18} className="animate-pulse" />
                                        Start Creating
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {resumes.map((resume) => (
                                        <div
                                            key={resume._id}
                                            className="
                                                group relative flex flex-col justify-between
                                                p-6 rounded-2xl 
                                                bg-zinc-900/40 backdrop-blur-sm 
                                                border border-white/5 hover:border-purple-500/30
                                                hover:bg-zinc-900/60
                                                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                                            "
                                        >
                                            <div className="mb-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-purple-500/20 transition-colors">
                                                        <FileText size={24} className="text-zinc-400 group-hover:text-purple-400 transition-colors" />
                                                    </div>
                                                    <span className="text-xs font-medium text-zinc-500 bg-black/40 px-3 py-1 rounded-full border border-white/5 flex items-center gap-1.5">
                                                        <Calendar size={12} />
                                                        {formatDate(resume.updatedAt)}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-bold text-white mb-2 truncate pr-4">
                                                    {resume.fullname || "Untitled Resume"}
                                                </h3>
                                                <p className="text-sm text-zinc-400 line-clamp-2 h-10 leading-relaxed">
                                                    {resume.profileSummary || "No professional summary added yet."}
                                                </p>
                                            </div>
                                            <div className="space-y-3 mt-auto">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => handleEditResume(resume)}
                                                        className="
                                                            flex items-center justify-center gap-2 px-4 py-2.5 
                                                            rounded-xl text-sm font-bold cursor-pointer
                                                            bg-indigo-600 text-white
                                                            hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30
                                                            transition-all duration-300
                                                        "
                                                    >
                                                        <Pencil size={16} />
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleGenerateAi(resume._id)}
                                                        className="
                                                            flex items-center justify-center gap-2 px-4 py-2.5 
                                                            rounded-xl text-sm font-bold cursor-pointer
                                                            bg-linear-to-r from-emerald-600 to-teal-600 text-white
                                                            hover:from-emerald-500 hover:to-teal-500
                                                            hover:shadow-lg hover:shadow-emerald-500/30
                                                            transition-all duration-300 group/btn
                                                        "
                                                    >
                                                        <Rocket size={16} className="group-hover/btn:animate-bounce" />
                                                        Generate
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => confirmDelete(resume._id)}
                                                    className="
                                                        w-full flex items-center justify-center gap-2 px-4 py-2 
                                                        rounded-xl text-sm font-medium cursor-pointer
                                                        text-red-400 bg-red-500/5 border border-red-500/10
                                                        hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-300
                                                        transition-all duration-300
                                                    "
                                                >
                                                    <Trash2 size={14} />
                                                    <span>Delete Resume</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default MyResumes;