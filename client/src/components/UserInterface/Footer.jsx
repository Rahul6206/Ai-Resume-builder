import React from "react";
import { Mail, Phone, Linkedin, Twitter, Github,  Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-black text-white border-t border-white/10 pt-16 pb-8 overflow-hidden font-sans">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">

          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-extrabold text-2xl text-white tracking-wider group-hover:text-purple-400 transition-colors">
                CVPilot
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Build professional, ATS-friendly resumes in minutes with our AI-powered platform. Land your dream job faster.
            </p>

            <div className="flex gap-4">
              <SocialIcon href="https://www.linkedin.com/in/rahul-kumar-pramanik-799933352/" icon={Linkedin} />
              <SocialIcon href="mailto:rahulrp8677@gmail.com" icon={Mail} />
              <SocialIcon href="https://github.com/Rahul6206" icon={Github} />
            </div>
          </div>

          <div className="md:text-right flex flex-col md:items-end">
            <h4 className="font-bold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li className="flex items-center gap-3 justify-start md:justify-end">
                <Mail size={16} className="text-purple-500" />
                <span>rahulrp8677@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 justify-start md:justify-end">
                <Phone size={16} className="text-purple-500" />
                <span>xxxxxxxxxx</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} CVPilot. All rights reserved.
          </p>

          <p className="text-zinc-500 text-sm flex items-center gap-1.5">
            Made with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> by <span className="text-white font-medium">Rahul Kuamr Pramanik</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

const SocialIcon = ({ href, icon: Icon }) => (
  <a
    href={href}
    
    target="_blank"
    rel="noopener noreferrer"
    className="
            w-10 h-10 rounded-full bg-zinc-900 border border-white/10 
            flex items-center justify-center text-zinc-400
            hover:bg-purple-600 hover:text-white hover:border-purple-500 hover:-translate-y-1
            transition-all duration-300
        "
  >
    <Icon size={18} />
  </a>
);

export default Footer;