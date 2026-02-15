import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { verifyOtp } from "../../api/authApi";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Link } from "react-router-dom";

const VerifyUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      toast.error("Please register first to verify your email.");
      navigate("/user/register");
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setVerifyCode(e.target.value);
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!verifyCode.trim()) {
      toast.error("Verification code is required.");
      return;
    }

    if (verifyCode.trim().length !== 6) {
      toast.error("Verification code must be 6 digits.");
      return;
    }

    if (!/^\d{6}$/.test(verifyCode)) {
      toast.error("Verification code must contain only numbers.");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp({
        email: email.toLowerCase(),
        verifyCode: verifyCode,
      });
      
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Email verified successfully!");
        navigate("/");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Verification failed. Try again.";
      toast.error(msg);
      console.log("Verification Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-purple-900 via-black to-black"></div>

      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-700 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-600 opacity-30 rounded-full blur-3xl animate-pulse delay-1500"></div>

      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 animate__animated animate__fadeIn">
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-300 text-center mb-8 text-sm">
          Enter the verification code sent to your email address to complete registration.
        </p>

        <div className="mb-6 p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-gray-400 text-xs">Verification code sent to:</p>
          <p className="text-white font-semibold text-sm">{email}</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="text-gray-200 text-sm mb-1 block">
              Verification Code
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                maxLength="6"
                value={verifyCode}
                onChange={handleChange}
                inputMode="numeric"
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-2xl tracking-widest"
              />
              <Lock className="absolute right-3 top-3 text-gray-300" size={20} />
            </div>
            <p className="text-gray-400 text-xs mt-1">
              Check your email for the 6-digit verification code
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-linear-to-r from-purple-600 to-blue-500 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 mt-6"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6">
          Didn't receive the code?{" "}
          <Link to="/user/register" className="text-purple-400 hover:underline">Back to Register </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyUser;
