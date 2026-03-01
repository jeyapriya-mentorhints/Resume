import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Icons } from '../ui/Icons';
import { steps } from './stepsConfig';
import CircularProgress from '../ui/CircularProgress';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

const BuilderHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentStepIndex = steps.findIndex(step => location.pathname.includes(step.path));
  // Default to 0 if not found
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;
  const currentStep = steps[activeIndex];
  
  const progress = ((activeIndex + 1) / steps.length) * 100;

  const handleStepClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 h-20">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Left: Logo (Replacing Back Arrow) */}
          <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
            <div className="w-10 h-10 bg-[#061c3d] rounded-xl flex items-center justify-center text-white relative shadow-md">
              <Icons.FileText size={20} />
              <span className="absolute top-1.5 right-1 text-[7px] font-black text-blue-500 leading-none">AI</span>
            </div>
            <span className="hidden sm:block font-bold text-sm text-[#061c3d] tracking-tight">ATSFreeResume</span>
          </Link>

          {/* Center: Step Info & Dropdown Trigger */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              Step {activeIndex + 1} of {steps.length}
            </span>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 text-navy-900 font-bold text-lg hover:opacity-80 transition-opacity"
            >
              {currentStep.label}
              <MotionDiv 
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Icons.ChevronRight size={16} className="rotate-90" />
              </MotionDiv>
            </button>
          </div>

          {/* Right: Progress */}
          <div className="bg-blue-50/50 p-1.5 rounded-full">
             <CircularProgress percentage={progress} size={42} strokeWidth={3} />
          </div>
        </div>
      </header>

      {/* Dropdown Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <MotionDiv 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 z-30 top-20"
            />
            
            {/* Menu Content */}
            <MotionDiv
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-20 left-0 w-full bg-white z-40 shadow-xl border-b border-gray-100 max-h-[calc(100vh-5rem)] overflow-y-auto"
            >
              <div className="max-w-3xl mx-auto py-6 px-4">
                 <div className="space-y-2">
                    {steps.map((step, index) => {
                       const Icon = step.icon;
                       let statusText = "";
                       let iconColor = "text-gray-400 bg-gray-100";
                       let textColor = "text-gray-600";

                       if (index === activeIndex) {
                          statusText = "Current Step";
                          iconColor = "text-white bg-blue-500";
                          textColor = "text-navy-900 font-bold";
                       } else if (index < activeIndex) {
                          statusText = "Completed";
                          iconColor = "text-white bg-navy-900";
                          textColor = "text-navy-900 font-medium";
                       } else if (index === activeIndex + 1) {
                          statusText = "Next Step";
                       }

                       return (
                          <button
                             key={step.id}
                             onClick={() => handleStepClick(step.path)}
                             className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-gray-50 ${index === activeIndex ? 'bg-blue-50/50' : ''}`}
                          >
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                                {index < activeIndex ? <Icons.Check size={18} /> : <Icon size={18} />}
                             </div>
                             <div className="flex-1 text-left">
                                <div className={`text-base ${textColor}`}>{step.label}</div>
                                <div className="text-xs text-gray-400 font-medium">{statusText}</div>
                             </div>
                             {index === activeIndex && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                             )}
                          </button>
                       );
                    })}
                 </div>

                 <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                    <button 
                       onClick={() => setIsMenuOpen(false)}
                       className="text-xs font-bold text-gray-400 hover:text-navy-900 uppercase tracking-widest"
                    >
                       Close Menu
                    </button>
                 </div>
              </div>
            </MotionDiv>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default BuilderHeader;