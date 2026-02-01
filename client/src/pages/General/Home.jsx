import React from "react";
import Navbar from "../../components/UserInterface/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Zap, Award, Clock, FileText, CheckCircle, Edit, Download, ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import Footer from "../../components/UserInterface/Footer";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 selection:text-purple-200 font-sans overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-[128px]"></div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        details > summary {
          list-style: none;
        }
        details > summary::-webkit-details-marker {
          display: none;
        }
      `}</style>

      <div className="relative z-10">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-300 animate-fade-up backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                Your Own AI is here
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
                  Build a Resume That  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
                   Fast Tracks Your Interview
                  </span>
                </h1>
                <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
                  Beat the ATS and land interviews at top companies. Our AI-powered builder optimizes your resume in real-time.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-l border-white/10 pl-6 py-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <CheckCircle size={18} className="text-purple-400" />
                  </div>
                  <span className="text-sm font-medium">ATS-Ready PDFs</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Sparkles size={18} className="text-blue-400" />
                  </div>
                  <span className="text-sm font-medium">AI Smart Suggestions</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Clock size={18} className="text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium">Instant Downloads</span>
                </div>
              </div>

              <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
                <button
                  onClick={() => {
                    const isLoggedIn = () => {
                      try {
                        
                        if (typeof localStorage !== "undefined") {
                          const user = localStorage.getItem("user");
                          return !!user;
                        }
                      } catch (e) { }
                      return false;
                    };

                    if (!isLoggedIn()) {
                      toast.info("Please sign up to create your resume");
                      navigate("/user/register");
                    } else {
                      navigate("/create-resume");
                    }
                  }}
                  className="
                    group relative inline-flex items-center justify-center gap-3 px-8 py-4 
                    bg-white text-black rounded-full font-bold text-lg
                    hover:bg-zinc-200 transition-all duration-300
                    shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]
                  "
                >
                  Build Your AI Resume
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="mt-4 text-sm text-zinc-600">No credit card required · Free templates included</p>
              </div>
            </div>

            <div className="lg:col-span-5 relative animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-3xl blur-2xl"></div>

              <div className="relative bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-transparent opacity-50"></div>

                <h3 className="text-xl font-bold text-white mb-8">Seamless Process</h3>

                <div className="relative space-y-8 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">

                  <div className="relative flex gap-6 group">
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 border border-white/10 group-hover:border-purple-500/50 transition-colors shadow-lg">
                      <Edit size={20} className="text-zinc-400 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">Enter Details</h4>
                      <p className="text-sm text-zinc-500 mt-1">Smart forms auto-suggest skills.</p>
                    </div>
                  </div>

                  <div className="relative flex gap-6 group">
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 border border-white/10 group-hover:border-blue-500/50 transition-colors shadow-lg">
                      <CheckCircle size={20} className="text-zinc-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">Select Template</h4>
                      <p className="text-sm text-zinc-500 mt-1">Professional, ATS-friendly designs.</p>
                    </div>
                  </div>

                  <div className="relative flex gap-6 group">
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 border border-white/10 group-hover:border-emerald-500/50 transition-colors shadow-lg">
                      <Download size={20} className="text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">Export & Apply</h4>
                      <p className="text-sm text-zinc-500 mt-1">Download PDF and start applying.</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="mt-32">
            <h2 className="text-3xl font-bold text-center mb-16">Why professionals choose CVPilot</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Zap, title: "Lightning Fast", desc: "Build in minutes with our intuitive drag-and-drop editor.", color: "text-amber-400" },
                { icon: Award, title: "AI-Powered", desc: "Advanced algorithms suggest the best keywords for your industry.", color: "text-blue-400" },
                { icon: FileText, title: "ATS Optimized", desc: "Templates designed to pass automated screening software.", color: "text-purple-400" },
                { icon: Clock, title: "Always Live", desc: "Edit your resume anytime. Your data is saved securely in the cloud.", color: "text-emerald-400" }
              ].map((feature, idx) => (
                <div key={idx} className="group p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 hover:bg-zinc-900/50 transition-all duration-300">
                  <div className="mb-4 p-3 rounded-xl bg-white/5 w-fit group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className={feature.color} size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-32 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

            <div className="space-y-4">
              {[
                { q: "How long does it take to create a resume?", a: "Most users create a complete resume in 5-15 minutes using our templates and AI-assisted suggestions." },
                { q: "Can I export my resume as PDF?", a: "Yes! You can export your resume in multiple formats including PDF, Word, and directly share a link." },
                { q: "Is my data secure?", a: "Your data is encrypted and stored securely. We never share your information with third parties." },
                { q: "Can I use AI to improve my resume content?", a: "Absolutely! Our AI assistant provides intelligent suggestions to enhance your descriptions and highlight your achievements." },
                { q: "Can I edit my resume after creating it?", a: "Yes, you can edit and update your resume anytime. All changes are automatically saved." }
              ].map((faq, i) => (
                <details key={i} className="group bg-zinc-900/30 border border-white/5 rounded-xl overflow-hidden transition-all duration-300 open:bg-zinc-900/50 open:border-white/10">
                  <summary className="flex items-center justify-between p-6 cursor-pointer text-zinc-200 font-medium hover:text-white transition-colors">
                    {faq.q}
                    <ChevronDown size={18} className="text-zinc-500 group-open:rotate-180 transition-transform duration-300" />
                  </summary>
                  <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

        </main>
      </div>
      <Footer/>
    </div>

  );
};

export default Home;