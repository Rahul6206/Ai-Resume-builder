import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../api/authApi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", resetCode: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await resetPassword({ ...formData, email: formData.email.trim().toLowerCase() });
      toast.success("Password reset successfully. Please login.");
      navigate("/user/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 p-6 bg-zinc-900 rounded-xl">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <input className="w-full p-3 bg-black border border-zinc-700 rounded" type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} />
        <input className="w-full p-3 bg-black border border-zinc-700 rounded" type="text" maxLength={6} placeholder="6-digit code" value={formData.resetCode} onChange={(e) => setFormData((p) => ({ ...p, resetCode: e.target.value }))} />
        <input className="w-full p-3 bg-black border border-zinc-700 rounded" type="password" placeholder="New password" value={formData.newPassword} onChange={(e) => setFormData((p) => ({ ...p, newPassword: e.target.value }))} />
        <button disabled={loading} className="w-full py-3 rounded bg-purple-600">{loading ? "Resetting..." : "Reset Password"}</button>
      </form>
    </div>
  );
};

export default ResetPassword;
