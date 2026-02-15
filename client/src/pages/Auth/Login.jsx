import React, { useState } from "react";
import { Mail, Lock, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { loginUser, sendOtp } from "../../api/authApi";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // Handle input change
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Handle login submission
    const handleLogin = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.email.trim()) {
            toast.error("Email is required.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (!formData.password.trim()) {
            toast.error("Password is required.");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);
            const res = await loginUser({
                email: formData.email.toLowerCase(),
                password: formData.password,
            });

            if (res.data.success) {
                toast.success("Login successful!");


                localStorage.setItem("user", JSON.stringify(res.data.user));

                navigate("/");
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Login failed. Try again.";
            toast.error(msg);
            console.log(error.response.data)
            console.log("Login Error:", error.response?.data);
            if (
                error.response?.status === 403 &&
                error.response.data.action === "VERIFY_OTP"
            ) {
                // router.push(`/verify-otp?email=${error.response.data.email}`);
                try {
                    const { email } = error.response.data;
                    const res = await sendOtp({ email })
                    if (res.data.success) {
                        navigate("/user/verifyUser", { state: { email: error.response.data.email } });
                        toast.success("Verification code sent to your email.");
                    }
                } catch (error) {
                    toast.error("Failed to send verification code. Please try again.");
                    console.log("Login OTP Send Error:", res.data);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-5 relative overflow-hidden bg-black text-white font-sans selection:bg-purple-500/30 selection:text-purple-200">

            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                <div className="absolute top-0 left-0 w-72 h-72 bg-purple-900/20 rounded-full blur-[128px]"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-900/10 rounded-full blur-[128px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">


                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            Sign in to continue building your professional resume.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">

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
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                    Password
                                </label>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="text-zinc-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
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
                            <div className="absolute inset-0 w-full h-full bg-linear-to-r from-purple-600 to-indigo-600 transition-all duration-300 group-hover:brightness-110"></div>

                            <div className="relative flex items-center justify-center gap-2 text-white">
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight size={20} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="text-center mt-8 pt-6 border-t border-white/5">
                        <p className="text-zinc-500 text-sm">
                            Don't have an account?{" "}
                            <Link
                                to="/user/register"
                                className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
                            >
                                Register Now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;