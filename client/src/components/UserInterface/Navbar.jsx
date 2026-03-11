import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, Rocket, FileText, Github } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api/axios"; 

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    const GITHUB_REPO_URL = "https://github.com/Rahul6206/Ai-Resume-builder";

    const checkAuth = () => {
        const user = localStorage.getItem("user");
        return !!user; 
    };

    useEffect(() => {
        setAuthenticated(checkAuth());

        function onStorage() {
            setAuthenticated(checkAuth());
        }
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const handleLogout = async () => {
        try {
            
            await api.post("/auth/logout");

            localStorage.removeItem("user");
            setAuthenticated(false);

            toast.success("Logged out successfully");
            navigate("/");
        } catch (err) {
            console.error(err);
            localStorage.removeItem("user");
            setAuthenticated(false);
            navigate("/");
        }
    };

    const handleMyResumes = () => {
        navigate("/my_resume");
        if (open) setOpen(false);
    };

    return (
        <>
            <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/60 border-b border-white/10 shadow-lg transition-all duration-300">

                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex justify-between items-center">

                    <Link to="/" className="flex items-center group">
                        <span className="
                            font-extrabold text-xl md:text-2xl text-white tracking-wider
                            transition-colors duration-300
                            group-hover:text-purple-400
                        ">CVPilot
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-6">

                        {authenticated && (
                            <button
                                onClick={handleMyResumes}
                                className="
                                    flex items-center gap-2 text-zinc-400 group
                                    hover:text-white transition-all duration-300 text-sm font-medium
                                    py-2 px-4 rounded-lg
                                    hover:bg-white/5
                                "
                            >
                                <FileText size={18} className="text-blue-500 group-hover:text-blue-400 transition-colors" />
                                <span>My Resumes</span>
                            </button>
                        )}

                        {authenticated ? (
                            <button
                                onClick={handleLogout}
                                className="
                                    flex items-center gap-2 text-zinc-400 group
                                    hover:text-white transition-all duration-300 text-sm font-medium
                                    py-2 px-4 rounded-lg
                                    hover:bg-white/5
                                "
                            >
                                <LogIn size={18} className="text-purple-500 group-hover:text-purple-400 transition-colors" />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <Link
                                to="/user/login"
                                className="
                                    flex items-center gap-2 text-zinc-400 group
                                    hover:text-white transition-all duration-300 text-sm font-medium
                                    py-2 px-4 rounded-lg
                                    hover:bg-white/5
                                "
                            >
                                <LogIn size={18} className="text-purple-500 group-hover:text-purple-400 transition-colors" />
                                <span>Sign In</span>
                            </Link>
                        )}

                        <div className="h-6 w-px bg-white/10 mx-2"></div>

                        <a
                            href={GITHUB_REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                relative overflow-hidden
                                flex items-center gap-2 
                                bg-zinc-800 text-white 
                                font-semibold
                                px-3 py-2.5 rounded-xl transition-all duration-300 shadow-lg text-sm
                                hover:scale-[1.03] hover:bg-zinc-700 hover:shadow-purple-500/10
                                border border-white/10 group
                            "
                        >
                            <Github size={18} className="group-hover:text-purple-400 transition-colors" />
                        </a>

                    </div>

                    <div
                        className="md:hidden text-zinc-400 cursor-pointer hover:text-white transition p-2 hover:bg-white/5 rounded-lg"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`
                        md:hidden absolute top-full left-0 w-full
                        backdrop-blur-xl bg-black/90 border-b border-white/10
                        transform transition-all duration-300 overflow-hidden shadow-2xl
                        ${open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}
                    `}
                >
                    <div className="flex flex-col py-6 px-6 space-y-2 text-white">
                        {authenticated && (
                            <button
                                className="flex items-center gap-3 text-zinc-400 hover:text-white transition text-base py-3 px-4 hover:bg-white/5 rounded-xl w-full text-left"
                                onClick={handleMyResumes}
                            >
                                <FileText size={20} className="text-blue-500" />
                                My Resumes
                            </button>
                        )}

                        {authenticated ? (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setOpen(false);
                                }}
                                className="flex items-center gap-3 text-zinc-400 hover:text-white transition text-base py-3 px-4 hover:bg-white/5 rounded-xl w-full text-left"
                            >
                                <LogIn size={20} className="text-purple-500" />
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/user/login"
                                className="flex items-center gap-3 text-zinc-400 hover:text-white transition text-base py-3 px-4 hover:bg-white/5 rounded-xl"
                                onClick={() => setOpen(false)}
                            >
                                <LogIn size={20} className="text-purple-500" />
                                Sign In
                            </Link>
                        )}

                        <div className="h-px bg-white/5 my-4"></div>

                        <a
                            href={GITHUB_REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setOpen(false)}
                            className="
                                flex items-center justify-center gap-2 
                                bg-zinc-800 text-white 
                                font-bold text-base
                                px-4 py-3.5 rounded-xl transition hover:opacity-90 w-full 
                                shadow-lg shadow-purple-900/10 hover:bg-zinc-700
                                border border-white/10
                            "
                        >
                            <Github size={20} />
                            Contribute
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
