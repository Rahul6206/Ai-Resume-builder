import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyUser from "../pages/Auth/VerifyUser";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import GenerateAiResume from "../pages/Resume/GenerateAiResume";
import ResumePreview from "../pages/Resume/ResumePreview";
import Home from "../pages/General/Home";
import MyResume from "../pages/Resume/MyResume";
import NotFound from "../pages/General/NotFound";
import CreateResume from "../pages/Resume/CreateResumee";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/verifyUser" element={<VerifyUser />} />
        <Route path="/user/forgot-password" element={<ForgotPassword />} />
        <Route path="/user/reset-password" element={<ResetPassword />} />
        <Route path="/create-resume" element={<ProtectedRoute><CreateResume /></ProtectedRoute>} />
        <Route path="/generate-ai-resume/:resumeId/:template" element={<ProtectedRoute><GenerateAiResume /></ProtectedRoute>} />
        <Route path="/resume-preview/:resumeId" element={<ProtectedRoute><ResumePreview /></ProtectedRoute>} />
        <Route path="/my_resume" element={<ProtectedRoute><MyResume /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
