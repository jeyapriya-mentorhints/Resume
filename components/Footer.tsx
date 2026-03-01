import React from 'react';
import { Icons } from './ui/Icons';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#030712] text-white py-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#030712] relative shadow-lg">
                <Icons.FileText size={20} fill="currentColor" />
                <span className="absolute top-1.5 right-1 text-[7px] font-heading font-black text-indigo-600 leading-none">AI</span>
              </div>
              <span className="text-2xl font-heading font-black tracking-tighter">ATSFreeResume</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
              We build AI Powered resume with wide range of ATS friendly templates to choose from.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="font-heading font-black text-[10px] uppercase tracking-[0.25em] text-indigo-400 mb-8">Reach us</h3>
            <ul className="space-y-5 text-slate-400 text-sm font-medium">
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-black text-[10px] uppercase tracking-[0.25em] text-indigo-400 mb-8">Templates</h3>
            <ul className="space-y-5 text-slate-400 text-sm font-medium">
              <li><Link to="/convertats" className="hover:text-white transition-colors">Convert Ats</Link></li>
              <li><Link to="/templates" className="hover:text-white transition-colors">Resume</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-6">Legal</h3>
            <ul className="space-y-4 text-gray-400 text-xs">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-black text-[10px] uppercase tracking-[0.25em] text-indigo-400 mb-8">Headquarters</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              info@mentorhints.com<br/>
              {/* 901 N Pitt Str., Suite 170<br/>
              Alexandria, VA 22314, USA */}
              Address: Innovb Millenia, 2nd floor, East Wing, RMZ, Millenia Business Park, Campus 1A, No.143, Dr. M.G.R. Road (North Veeranam Salai), Perungudi, Sholinganallur, Chennai - 600096.
            </p>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-5">
             <a href="#" className="w-10 h-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all duration-300">
                <Icons.Menu className="w-4 h-4 text-white" />
             </a>
             <a href="#" className="w-10 h-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all duration-300">
                <Icons.Wrench className="w-4 h-4 text-white" />
             </a>
             <a href="#" className="w-10 h-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all duration-300">
                <Icons.Briefcase className="w-4 h-4 text-white" />
             </a>
             <a href="#" className="w-10 h-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all duration-300">
                <Icons.User className="w-4 h-4 text-white" />
             </a>
          </div>
          <div className="text-[10px] font-heading font-black text-slate-500 uppercase tracking-[0.2em]">
            &copy; 2026 Mentorhints software solution pvt ltd
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;