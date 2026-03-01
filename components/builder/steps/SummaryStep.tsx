import React, { useState } from 'react';
import { useResume } from '../../../App';
import { Icons } from '../../ui/Icons';
import { generateResumeSummary, enhanceResumeSummary } from '../../../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '@/components/AuthModal';
import {auth} from '../../../firebase';
import { useAuth } from '../../../App';
import { useNavigate } from 'react-router-dom';
import PricingModal from '../../PricingModal';

const MotionDiv = motion.div as any;

const SummaryStep: React.FC = () => {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { resumeData, updateField } = useResume();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // AI Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stagingSummary, setStagingSummary] = useState('');
  const [mode, setMode] = useState<'generate' | 'enhance'>('generate');

  const handleAiAction = async (actionMode: 'generate' | 'enhance') => {
if (!auth.currentUser) {
    setIsAuthModalOpen(true);
    return;
  }

    if (actionMode === 'generate' && !resumeData.jobTitle && resumeData.skills.length === 0) {
      setError("Please add a Job Title or some Skills first to help the AI generate a relevant summary.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (actionMode === 'enhance' && (!resumeData.summary || resumeData.summary.trim().length < 10)) {
      setError("Please write a draft summary first to use the Enhance feature.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setMode(actionMode);
    setIsModalOpen(true);
    setStagingSummary('');
    setIsGenerating(true);
    setError(null);

    try {
      let summary = '';
      if (actionMode === 'generate') {
        summary = await generateResumeSummary(
          resumeData.jobTitle, 
          resumeData.skills, 
          resumeData.experience
        );
      } else {
        summary = await enhanceResumeSummary(
          resumeData.summary,
          resumeData.jobTitle,
          resumeData.skills
        );
      }
      
      if (summary) {
        setStagingSummary(summary);
      } else {
        throw new Error("No summary returned");
      }
    } catch (error:any) {
      if (error.message === 'Upgrade required') {
      setIsModalOpen(false );
      setIsGenerating(false);
      setIsPricingOpen(true);
      return;
    }
      setError("AI service failed. Please check your connection.");
      setStagingSummary("AI service is currently busy. Please try again in a few moments.");
    } finally {
      setIsGenerating(false);
    }
  };
 
  const applySummary = () => {
    // Safety check: Don't apply error messages as the actual summary
    if (stagingSummary && !stagingSummary.includes("Please try again") && !stagingSummary.includes("failed")) {
      updateField('summary', stagingSummary);
      setIsModalOpen(false);
    } else if (!isGenerating) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <AuthModal
  isOpen={isAuthModalOpen}
  onClose={() => setIsAuthModalOpen(false)}
  onLoginSuccess={() => {
    setIsAuthModalOpen(false);
  }}
/>
<PricingModal isOpen={isPricingOpen} onClose={() => { setIsPricingOpen(false);  }}  />
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-navy-900 mb-2">Professional Summary</h2>
        <p className="text-gray-500">Briefly describe your career goals and key achievements</p>
      </div>

      <div className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 relative z-10">
        <div className="flex flex-wrap justify-between items-center px-4 py-3 bg-gray-50/50 border-b border-gray-100 gap-3">
           <div className="flex items-center gap-4">
              <label className="text-xs font-bold text-navy-900 uppercase tracking-wider">Format</label>
              <div className="flex bg-gray-200/50 p-1 rounded-lg w-fit">
                  <button 
                    onClick={() => updateField('summaryType', 'paragraph')}
                    className={`flex items-center gap-2 py-1 px-3 rounded-md text-[10px] font-bold transition-all relative ${resumeData.summaryType === 'paragraph' ? 'text-navy-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {resumeData.summaryType === 'paragraph' && (
                        <MotionDiv layoutId="summary-toggle" className="absolute inset-0 bg-white rounded shadow-sm" />
                    )}
                    <Icons.Type size={12} className="relative z-10" />
                    <span className="relative z-10">Paragraph</span>
                  </button>
                  <button 
                    onClick={() => updateField('summaryType', 'list')}
                    className={`flex items-center gap-2 py-1 px-3 rounded-md text-[10px] font-bold transition-all relative ${resumeData.summaryType === 'list' ? 'text-navy-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {resumeData.summaryType === 'list' && (
                        <MotionDiv layoutId="summary-toggle" className="absolute inset-0 bg-white rounded shadow-sm" />
                    )}
                    <Icons.Menu size={12} className="relative z-10" />
                    <span className="relative z-10">List</span>
                  </button>
              </div>
           </div>
           
           <div className="flex gap-2">
              <button 
                onClick={() => handleAiAction('enhance')}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-xl font-bold text-[10px] md:text-xs shadow-sm hover:bg-indigo-50 transition-all duration-300"
              >
                <Icons.Zap size={14} className="text-indigo-500" />
                Enhance
              </button>
              <button 
                onClick={() => handleAiAction('generate')}
                className="flex items-center gap-1.5 px-3 py-2 bg-navy-900 text-white rounded-xl font-bold text-[10px] md:text-xs shadow-lg transition-all duration-300"
              >
                <Icons.Sparkles size={14} className="text-yellow-300" />
                Auto-generate
              </button>
           </div>
        </div>

        <div className="relative bg-white">
          <textarea 
            value={resumeData.summary}
            onChange={(e) => updateField('summary', e.target.value)}
            placeholder={resumeData.summaryType === 'list' ? "Enter summary points, each on a new line..." : "E.g. Dynamic Software Engineer with 5+ years of experience in..."}
            className="w-full h-72 px-6 py-6 outline-none resize-none text-base leading-relaxed text-gray-700 bg-white placeholder:text-gray-300 transition-all relative z-10"
          />
          
          <AnimatePresence>
            {error && !isModalOpen && (
              <MotionDiv 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-6 left-6 right-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm z-20"
              >
                <Icons.AlertCircle size={16} />
                {error}
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
         <div className="p-4 rounded-xl border border-gray-100 bg-blue-50/30 flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
               <Icons.Zap size={18} />
            </div>
            <div>
               <h4 className="font-bold text-navy-900 text-sm mb-1">AI Correction</h4>
               <p className="text-xs text-gray-500 leading-relaxed">
                  The <b>Enhance</b> tool uses ATS-friendly keywords to correct your tone.
               </p>
            </div>
         </div>
         <div className="p-4 rounded-xl border border-gray-100 bg-green-50/30 flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
               <Icons.CheckCircle size={18} />
            </div>
            <div>
               <h4 className="font-bold text-navy-900 text-sm mb-1">Best Practice</h4>
               <p className="text-xs text-gray-500 leading-relaxed">
                  Keep it under 100 words and focus on unique selling points.
               </p>
            </div>
         </div>
      </div>

      {/* AI POP-UP MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <MotionDiv 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isGenerating && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mode === 'generate' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                       {mode === 'generate' ? <Icons.Sparkles size={16} /> : <Icons.Zap size={16} />}
                    </div>
                    <div>
                       <h3 className="font-bold text-navy-900 text-sm">AI Summary {mode === 'generate' ? 'Generation' : 'Enhancement'}</h3>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Icons.X size={20} />
                 </button>
              </div>

              <div className="p-6 min-h-[300px] flex flex-col">
                 {isGenerating ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                       <div className={`w-12 h-12 border-4 rounded-full animate-spin mb-4 ${mode === 'generate' ? 'border-blue-100 border-t-blue-600' : 'border-indigo-100 border-t-indigo-600'}`} />
                       <p className="text-gray-500 text-sm font-medium animate-pulse">Writing...</p>
                    </div>
                 ) : (
                    <div className="space-y-4 flex-1 flex flex-col">
                       <div className={`flex-1 ${mode === 'generate' ? 'bg-blue-50/50 border-blue-100' : 'bg-indigo-50/50 border-indigo-100'} rounded-xl p-5 border relative group`}>
                          <textarea 
                            value={stagingSummary}
                            onChange={(e) => setStagingSummary(e.target.value)}
                            className="w-full h-64 bg-transparent border-none focus:ring-0 text-base text-gray-700 leading-relaxed resize-none font-sans"
                            placeholder="AI content will appear here..."
                          />
                       </div>
                    </div>
                 )}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end items-center gap-3">
                 <button 
                   onClick={applySummary}
                   disabled={isGenerating || !stagingSummary}
                   className="bg-navy-900 hover:bg-navy-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                 >
                    Apply Changes
                    <Icons.Check size={16} />
                 </button>
              </div>
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SummaryStep;