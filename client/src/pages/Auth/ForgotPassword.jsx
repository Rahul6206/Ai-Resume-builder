import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "../../api/authApi";

const ForgotPassword = () => {
const navigate= useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await forgotPassword({ email: email.trim().toLowerCase() });
      toast.success("reset send to email");
      
        navigate("/user/reset-password", { state: { email } })
      
    } catch {
      toast.error("Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 p-6 bg-zinc-900 rounded-xl">
        <h1 className="text-2xl font-bold">Forgot password</h1>
        <input className="w-full p-3 bg-black border border-zinc-700 rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button disabled={loading} className="w-full py-3 rounded bg-purple-600">{loading ? "Sending..." : "Send Reset Code"}</button>
        <Link className="text-purple-300 text-sm" to="/user/reset-password">Already have a code? Reset password</Link>
      </form>
    </div>
  );
};

export default ForgotPassword;
