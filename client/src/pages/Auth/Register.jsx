import React, { useState } from "react";
import { Mail, Lock, User, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { registerUser, sendOtp } from "../../api/authApi";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    // handle input change
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // handle register submission
    const handleRegister = async (e) => {
        e.preventDefault();

        if (!formData.fullname || !formData.email || !formData.password) {
            toast.error("All fields are required.");
            return;
        }

        try {
            setLoading(true);
            const res = await registerUser(formData);

            if (res.data.success) {
                // toast.success("Verification code sent to your email.");
                    try {
                        const res =await sendOtp(formData)
                        if(res.data.success){
                            toast.success("Verification code sent to your email.");
                        }
                    } catch (error) {
                        toast.error("Failed to send verification code. Please try again.");
                        console.log("REgister OTP Send Error:", error.response?.data);
                    }

                if (res.data.user) {
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                }

                navigate("/user/verifyUser", { state: { email: formData.email } });
            }
        } catch (error) {
            console.log("Full error:", error.response?.data);
            const msg =
                error.response?.data?.message || "Registration failed. Try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-5 relative overflow-hidden bg-black text-white font-sans selection:bg-purple-500/30 selection:text-purple-200">

            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-0 left-0 w-72 h-72 bg-purple-900/20 rounded-full blur-[128px]"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-900/10 rounded-full blur-[128px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">


                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            Create Account
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            Join and build your professional resume effortlessly.
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="text-zinc-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                                </div>
                                <input
                                    type="text"
                                    name="fullname"
                                    placeholder="Enter your full name"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    className="
                                        w-full pl-11 pr-4 py-3.5 
                                        bg-black/40 border border-white/10 rounded-xl 
                                        text-white placeholder-zinc-600 
                                        focus:outline-none focus:border-purple-500/50 focus:bg-zinc-900/50 
                                        transition-all duration-200
                                    "
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="text-zinc-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="
                                        w-full pl-11 pr-4 py-3.5 
                                        bg-black/40 border border-white/10 rounded-xl 
                                        text-white placeholder-zinc-600 
                                        focus:outline-none focus:border-purple-500/50 focus:bg-zinc-900/50 
                                        transition-all duration-200
                                    "
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="text-zinc-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="
                                        w-full pl-11 pr-4 py-3.5 
                                        bg-black/40 border border-white/10 rounded-xl 
                                        text-white placeholder-zinc-600 
                                        focus:outline-none focus:border-purple-500/50 focus:bg-zinc-900/50 
                                        transition-all duration-200
                                    "
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full relative group overflow-hidden rounded-xl font-bold text-lg py-3.5 transition-all duration-300 shadow-lg mt-2
                                disabled:opacity-70 disabled:cursor-not-allowed
                                hover:scale-[1.02] hover:shadow-purple-900/30
                            "
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 group-hover:brightness-110"></div>

                            <div className="relative flex items-center justify-center gap-2 text-white">
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Register</span>
                                        <ArrowRight size={20} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    </>
                                )}
                            </div>
                        </button>

                    </form>

                    <div className="text-center mt-8 pt-6 border-t border-white/5">
                        <p className="text-zinc-500 text-sm">
                            Already have an account?{" "}
                            <Link
                                to="/user/login"
                                className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;