import React from "react";
import { BrowserRouter as Router, Routes ,Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyUser from "../pages/Auth/VerifyUser";
import CreateResume from "../pages/Resume/CreateResume";
import GenerateAiResume from "../pages/Resume/GenerateAiResume";
import ResumePreview from "../pages/Resume/ResumePreview";
import Home from "../pages/General/Home";
import MyResume from "../pages/Resume/MyResume";
import NotFound from "../pages/General/NotFound";





const AppRoutes = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/user/register" element={<Register/>}/>
                    <Route path="/user/login" element={<Login/>}/>
                    <Route path="/user/verifyUser" element={<VerifyUser/>}/>
                    <Route path="/create-resume" element={<CreateResume/>}/>
                    <Route path="/generate-ai-resume/:resumeId/:template" element={<GenerateAiResume/>}/>
                    <Route path="/resume-preview/:resumeId" element={<ResumePreview />} />
                    <Route path="/my_resume" element={<MyResume/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Router>
        </>
    )
}

export default AppRoutes
