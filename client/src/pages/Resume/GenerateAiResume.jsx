import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { generateAiResumes } from "../../api/aiApi";
import Navbar from "../../components/UserInterface/Navbar";
import Footer from "../../components/UserInterface/Footer";

const GenerateAiResume = () => {
  const { resumeId, template } = useParams();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const generateResume = async () => {
      try {
        if (!template) {
          toast.error("Template not selected");
          navigate("/create-resume");
          return;
        }

        const response = await generateAiResumes(template);

        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfURL = URL.createObjectURL(pdfBlob);

        const link = document.createElement("a");
        link.href = pdfURL;
        link.download = `resume-${template}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(pdfURL);

        toast.success("Resume generated successfully!");
        setTimeout(() => navigate("/"), 2000);

      } catch (error) {
        
        toast.error("Failed to generate resume");
        navigate("/create-resume");
      } finally {
        setIsGenerating(false);
      }
    };

    generateResume();
  }, [template]);

  return (
    <>
      <Background>
        <Navbar />
        <div className="pt-20 pb-12 px-4 md:px-8 min-h-screen flex items-center justify-center">
          <div className="max-w-2xl w-full mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12">
              {isGenerating ? (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-purple-500 animate-spin"></div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Generating Your Resume
                    </h2>
                    <p className="text-gray-400">
                      Using AI to enhance and optimize your resume for maximum impact...
                    </p>
                  </div>
                  <div className="pt-4">
                    <div className="flex justify-center gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="text-6xl text-green-500">✓</div>
                  <h2 className="text-2xl font-bold text-white">
                    Resume Generated Successfully!
                  </h2>
                  <p className="text-gray-400">
                    Your AI-enhanced resume has been generated and downloaded automatically.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Background>
      <Footer />
    </>
  );
};

export default GenerateAiResume;
