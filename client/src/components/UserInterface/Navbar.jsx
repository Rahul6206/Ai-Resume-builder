import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, FileText, Github } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const authenticated = !!user;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    } finally {
      navigate("/");
    }
  };

  const GITHUB_REPO_URL = "https://github.com/Rahul6206/Ai-Resume-builder";

  return (<><div className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/60 border-b border-white/10 shadow-lg transition-all duration-300">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex justify-between items-center">
      <Link to="/" className="flex items-center group"><span className="font-extrabold text-xl md:text-2xl text-white tracking-wider transition-colors duration-300 group-hover:text-purple-400">CVPilot</span></Link>
      <div className="hidden md:flex items-center space-x-6">
        {authenticated && <button onClick={() => navigate("/my_resume")} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all duration-300 text-sm font-medium py-2 px-4 rounded-lg hover:bg-white/5"><FileText size={18} className="text-blue-500" /><span>My Resumes</span></button>}
        {authenticated ? <button onClick={handleLogout} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all duration-300 text-sm font-medium py-2 px-4 rounded-lg hover:bg-white/5"><LogIn size={18} className="text-purple-500" /><span>Logout</span></button> : <Link to="/user/login" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all duration-300 text-sm font-medium py-2 px-4 rounded-lg hover:bg-white/5"><LogIn size={18} className="text-purple-500" /><span>Sign In</span></Link>}
        <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="bg-zinc-800 text-white font-semibold px-3 py-2.5 rounded-xl border border-white/10"><Github size={18} /></a>
      </div>
      <div className="md:hidden text-zinc-400 cursor-pointer" onClick={() => setOpen(!open)}>{open ? <X size={24} /> : <Menu size={24} />}</div>
    </div>
    {open && <div className="md:hidden absolute top-full left-0 w-full backdrop-blur-xl bg-black/90 border-b border-white/10"><div className="flex flex-col py-6 px-6 space-y-2 text-white">{authenticated ? <button onClick={handleLogout} className="text-left">Logout</button> : <Link to="/user/login" onClick={()=>setOpen(false)}>Sign In</Link>}</div></div>}
  </div></>);
};

export default Navbar;
