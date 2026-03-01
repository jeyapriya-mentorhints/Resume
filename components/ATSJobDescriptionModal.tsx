

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './ui/Icons';

const MotionDiv = motion.div as any;

interface ATSJobDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOptimize: (jd: string) => void;
  onSkip: () => void;
}

const ATSJobDescriptionModal: React.FC<ATSJobDescriptionModalProps> = ({ isOpen, onClose, onOptimize, onSkip }) => {
  const [jd, setJd] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOptimize = () => {
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
        setIsProcessing(false);
        onOptimize(jd);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-sans">
        <MotionDiv 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white/90 backdrop-blur-sm"
        />

        <MotionDiv
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden p-8 md:p-10 text-center"
        >
           <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                 <Icons.Target size={32} />
              </div>
           </div>

           <h2 className="text-2xl font-bold text-navy-900 mb-2">Paste Job Description</h2>
           <p className="text-gray-500 text-sm mb-8">
              We'll tailor your resume keywords to match this specific role.
           </p>

           <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste JD here..."
              className="w-full h-40 p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white outline-none resize-none text-sm text-gray-700 mb-6"
           />

           <div className="flex items-center gap-4">
               <button 
                 onClick={handleOptimize}
                 disabled={isProcessing}
                 className="flex-1 bg-[#5850EC] hover:bg-[#4338ca] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
               >
                 {isProcessing ? 'Optimizing...' : 'Optimize'}
               </button>
               
               <button 
                 onClick={onSkip}
                 className="px-6 py-3.5 text-gray-500 hover:text-navy-900 font-medium transition-colors"
               >
                 Skip
               </button>
           </div>
        </MotionDiv>
      </div>
    </AnimatePresence>
  );
};

export default ATSJobDescriptionModal;