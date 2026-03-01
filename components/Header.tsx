import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Icons } from './ui/Icons';
import AuthModal from './AuthModal';
import { useAuth, useResume } from '../App';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const { resetResume } = useResume();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDashboardClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setIsAuthModalOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    resetResume();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-[#030712] rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300 relative">
                <Icons.FileText size={24} />
                <span className="absolute top-2 right-1.5 text-[8px] font-heading font-black text-indigo-400 leading-none">AI</span>
              </div>
              <span className="font-heading font-black text-2xl text-[#030712] tracking-tighter leading-none">
                ATSFreeResume
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center bg-slate-50 rounded-full px-2 py-1 border border-slate-100">
                <Link 
                  to="/dashboard" 
                  onClick={handleDashboardClick}
                  className={`flex items-center gap-2 text-[10px] font-heading font-black uppercase tracking-[0.15em] transition-all py-2.5 px-5 rounded-full ${
                    isActive('/dashboard') 
                      ? 'text-white bg-indigo-600 shadow-md' 
                      : 'text-slate-500 hover:text-navy-900'
                  }`}
                >
                  <Icons.Layout size={14} />
                  Dashboard
                </Link>
                
                <Link 
                  to="/convertats" 
                  className={`text-[10px] font-heading font-black uppercase tracking-[0.15em] transition-all py-2.5 px-5 rounded-full ${
                    isActive('/convertats') ? 'text-indigo-600' : 'text-slate-500 hover:text-navy-900'
                  }`}
                >Convert ATS
                  {/* Resume */}
                </Link>
                
                <Link 
                  to="/templates" 
                  className={`text-[10px] font-heading font-black uppercase tracking-[0.15em] transition-all py-2.5 px-5 rounded-full ${
                    isActive('/templates') ? 'text-indigo-600' : 'text-slate-500 hover:text-navy-900'
                  }`}
                >
                  Templates
                </Link>
                
                <Link 
                  to="/about" 
                  className={`text-[10px] font-heading font-black uppercase tracking-[0.15em] transition-all py-2.5 px-5 rounded-full ${
                    isActive('/about') ? 'text-indigo-600' : 'text-slate-500 hover:text-navy-900'
                  }`}
                >
                  About
                </Link>
              </div>
              
              <div className="h-6 w-px bg-slate-200"></div>

              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/dashboard"
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-white group-hover:scale-105 transition-transform">
                      <Icons.User size={18} />
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-red-500 text-[9px] font-heading font-black uppercase tracking-widest transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-navy-900 text-[10px] font-heading font-black uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </button>
              )}
              
              <Link 
                to="/builder"
                className="bg-navy-900 hover:bg-indigo-600 text-white px-7 py-3 rounded-full text-[10px] font-heading font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-navy-900/10 active:scale-95"
              >
                Build Resume
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-navy-900 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <Icons.X size={28} /> : <Icons.Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-2xl p-6 flex flex-col gap-3 animate-in slide-in-from-top-4 duration-300">
             <Link 
               to="/dashboard" 
               className={`font-heading font-black uppercase tracking-widest text-[10px] p-4 rounded-2xl flex items-center gap-4 ${isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-navy-900 hover:bg-slate-50'}`}
               onClick={(e) => { setMobileMenuOpen(false); handleDashboardClick(e); }}
             >
                <Icons.Layout size={20} /> Dashboard
             </Link>
             <Link to="/convertats" className="text-slate-500 font-heading font-black uppercase tracking-widest text-[10px] p-4 rounded-2xl hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>Convert ATS</Link>
             <Link to="/templates" className="text-slate-500 font-heading font-black uppercase tracking-widest text-[10px] p-4 rounded-2xl hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>Templates</Link>
             
             <div className="border-t border-slate-100 my-4 pt-4">
                {isLoggedIn ? (
                  <button 
                    className="text-red-500 font-heading font-black uppercase tracking-widest text-[10px] p-4 rounded-2xl flex items-center gap-4 w-full hover:bg-red-50 transition-colors"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icons.XCircle size={20} /> Log Out
                  </button>
                ) : (
                  <button 
                    className="text-navy-900 font-heading font-black uppercase tracking-widest text-[10px] p-4 rounded-2xl flex items-center gap-4 w-full hover:bg-slate-50 transition-colors"
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icons.User size={20} /> Sign In
                  </button>
                )}
             </div>
             
             <Link to="/builder" className="bg-navy-900 text-white text-center py-5 rounded-2xl text-[10px] font-heading font-black uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all" onClick={() => setMobileMenuOpen(false)}>Build Resume</Link>
          </div>
        )}
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={() => navigate('/dashboard')} 
      />
    </>
  );
};

export default Header;