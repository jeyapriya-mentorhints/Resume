

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icons } from '../components/ui/Icons';
import Header from '../components/Header';
import SEO from '@/components/SEO';

const MotionDiv = motion.div as any;

const ATS: React.FC = () => {
  const navigate = useNavigate();
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleAction = () => {
    setIsOptimizing(true);
    // Navigate to Job Target page instead of direct optimization
    setTimeout(() => {
      navigate('/job-target');
    }, 100);
  };

  const handleSkip = () => {
    navigate('/success');
  };

  return (<><SEO
  title="ATS Resume Checker"
  description="Check your resume against ATS systems and get your resume score."
  canonical="/ats"
  ogImage="/og/ats-checker.png"
/>
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center relative overflow-hidden"
        >
           {/* Decor */}
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>

           <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-200">
                 <Icons.Sparkles className="text-white w-10 h-10" />
              </div>
           </div>

           <h1 className="text-3xl font-bold text-navy-900 mb-4">
             Make it ATS Friendly
           </h1>

           <p className="text-gray-500 leading-relaxed mb-10 text-lg">
             Our AI engine will scan your resume against industry standards and optimize keywords to ensure you pass automated screenings.
           </p>

           <button 
             onClick={handleAction}
             disabled={isOptimizing}
             className="w-full bg-[#4F46E5] hover:bg-[#4338ca] text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mb-6"
           >
             {isOptimizing ? (
               <>
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 Processing...
               </>
             ) : (
               <>
                 <Icons.Sparkles size={20} />
                 Make it ATS Friendly
               </>
             )}
           </button>

           <button 
             onClick={handleSkip}
             className="text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors"
           >
             Skip
           </button>
        </MotionDiv>
      </main>
    </div>
    </>
  );
};

export default ATS;