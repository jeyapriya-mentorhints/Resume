import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './ui/Icons';

const MotionDiv = motion.div as any;

interface ImportResumeModalProps {
  isOpen: boolean;
  progress: number;
  stepLabel: string;
  insightIndex: number;
  aiInsights: string[];
  importSteps: string[];
}

const ImportResumeModal: React.FC<ImportResumeModalProps> = ({
  isOpen,
  progress,
  stepLabel,
  insightIndex,
  aiInsights,
  importSteps
}) => {
  // Internal state to handle the "creep" effect so users don't see a stalled bar
  const [displayProgress, setDisplayProgress] = useState(progress);

  useEffect(() => {
    // Jump immediately to the new progress if the parent pushes a significant update
    if (progress > displayProgress || progress === 100 || progress === 0) {
      setDisplayProgress(progress);
    }
  }, [progress]);

  useEffect(() => {
    let interval: any;
    
    // If the modal is open and we aren't at the end, trickle the progress forward
    // This solves the "stuck at 45%" UX issue while waiting for AI responses
    if (isOpen && displayProgress < 99 && displayProgress >= 10) {
      interval = setInterval(() => {
        setDisplayProgress(prev => {
          // If the real progress hasn't reached the next milestone (e.g. 75%), 
          // we creep up slowly to keep the UI alive.
          if (prev < 99) {
            return prev + 0.3;
          }
          return prev;
        });
      }, 600);
    }

    return () => clearInterval(interval);
  }, [isOpen, displayProgress]);

  const roundedProgress = Math.floor(displayProgress);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           {/* Backdrop */}
           <MotionDiv 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 bg-navy-900/60 backdrop-blur-xl"
           />

           {/* Modal Card */}
           <MotionDiv
             initial={{ scale: 0.9, opacity: 0, y: 20 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             exit={{ scale: 0.9, opacity: 0, y: 20 }}
             className="relative bg-white w-full max-w-md rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden p-10 text-center border border-white/20"
           >
              {/* Doc Icon with High-Tech Radar Scanning Effect */}
              <div className="relative w-32 h-32 mx-auto mb-10">
                 {/* Radar Waves */}
                 {[1, 2, 3].map((i) => (
                   <MotionDiv
                     key={i}
                     className="absolute inset-0 border-2 border-blue-500/30 rounded-full"
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1.6, opacity: 0 }}
                     transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                   />
                 ))}
                 
                 <div className="absolute inset-0 bg-blue-50 rounded-[32px] shadow-inner"></div>
                 <div className="relative z-10 w-full h-full flex items-center justify-center text-blue-600">
                    <Icons.FileText size={56} strokeWidth={1.5} />
                 </div>
                 
                 {/* Refined Laser Scanner Line */}
                 <MotionDiv 
                    className="absolute left-6 right-6 h-1 z-20 rounded-full bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,1)]"
                    animate={{ top: ['20%', '80%', '20%'] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                 />
              </div>

              <div className="space-y-1 mb-8">
                <h3 className="text-2xl font-bold text-navy-900 tracking-tight">Processing Resume</h3>
                <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">Intelligent AI Extraction</p>
              </div>
              
              {/* Active AI Insights Carousel */}
              <div className="h-6 flex items-center justify-center mb-4">
                <AnimatePresence mode="wait">
                  <MotionDiv
                    key={insightIndex}
                    initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                    className="text-gray-400 text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <Icons.Sparkles size={14} className="text-yellow-500" fill="currentColor" />
                    {aiInsights[insightIndex]}
                  </MotionDiv>
                </AnimatePresence>
              </div>

              {/* Progress Section */}
              <div className="space-y-4 mb-10">
                 {/* Step Indicators */}
                 <div className="flex justify-between items-center gap-1 mb-2 px-1">
                    {importSteps.map((step, idx) => {
                      const currentStepIndex = importSteps.indexOf(stepLabel);
                      const isCompleted = idx < currentStepIndex;
                      const isActive = idx === currentStepIndex;
                      
                      return (
                        <div key={idx} className="flex-1 h-1 rounded-full overflow-hidden bg-gray-100">
                           <MotionDiv 
                              className={`h-full ${isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-transparent'}`}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: (isCompleted || isActive) ? 1 : 0 }}
                              transition={{ duration: 0.5 }}
                              style={{ originX: 0 }}
                           />
                        </div>
                      );
                    })}
                 </div>

                 <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-2">
                       <MotionDiv 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="text-blue-500"
                       >
                          <Icons.Wrench size={12} />
                       </MotionDiv>
                       <span className="text-gray-500 text-[11px] font-bold italic tracking-tight">{stepLabel}</span>
                    </div>
                    {/* Fixed: Use roundedProgress which maps to displayProgress creep */}
                    <span className="text-blue-600 text-xs font-black tracking-tighter">{roundedProgress}%</span>
                 </div>

                 {/* Shimmering Progress Bar */}
                 <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden relative border border-gray-50 shadow-inner">
                    <MotionDiv 
                       className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600"
                       initial={{ width: "0%" }}
                       animate={{ width: `${displayProgress}%` }}
                       transition={{ type: "spring", bounce: 0, duration: 1.2 }}
                    />
                    {/* Shimmer Overlay */}
                    <MotionDiv 
                       className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2"
                       animate={{ x: ['-100%', '300%'] }}
                       transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                 </div>
              </div>

              {/* Engaging Tip Card with floating micro-interaction */}
              <MotionDiv 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-3xl border border-blue-100/50 text-left relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Icons.Sparkles size={40} />
                 </div>
                 <div className="flex gap-4">
                    <div className="mt-1 text-blue-500 flex-shrink-0">
                       <div className="p-2 bg-white rounded-xl shadow-sm">
                          <Icons.Zap size={20} fill="currentColor" />
                       </div>
                    </div>
                    <div>
                       <div className="text-[11px] font-bold text-navy-900 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                          Pro Tip 
                          <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                       </div>
                       <p className="text-[12px] text-gray-600 leading-relaxed font-medium">
                          Our AI identifies <b>quantifiable metrics</b> (like % growth) which can boost your initial screening success rate by up to <b>45%</b>.
                       </p>
                    </div>
                 </div>
              </MotionDiv>
           </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImportResumeModal;