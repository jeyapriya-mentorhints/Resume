
import React, { useState } from 'react';
import { useResume,useAuth } from '../../../App';
import AuthModal from '@/components/AuthModal';
import { useNavigate } from 'react-router-dom';
import {auth} from '../../../firebase';
import { Icons } from '../../ui/Icons';
import { Experience } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import PricingModal from '../../PricingModal';
import { generateExperienceDescription, enhanceExperienceDescription } from '../../../services/geminiService';

const MotionDiv = motion.div as any;

const ExperienceStep: React.FC = () => {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const { resumeData, updateField } = useResume();
  const navigate = useNavigate();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { isLoggedIn, logout } = useAuth();

  // AI Modal State
  const [aiModal, setAiModal] = useState<{ 
    isOpen: boolean; 
    expId: string; 
    title: string; 
    employer: string; 
    content: string; 
    isLoading: boolean;
    mode: 'generate' | 'enhance';
  }>({
    isOpen: false,
    expId: '',
    title: '',
    employer: '',
    content: '',
    isLoading: false,
    mode: 'generate'
  });

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      jobTitle: '',
      employer: '',
      startDate: '',
      endDate: '',
      location: '',
      description: '',
      descriptionType: 'list'
    };
    updateField('experience', [...resumeData.experience, newExp]);
  };

  const removeExperience = (id: string) => {
    updateField('experience', resumeData.experience.filter(exp => exp.id !== id));
  };

  const updateExperienceItem = (id: string, field: keyof Experience, value: any) => {
    const updated = resumeData.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateField('experience', updated);
  };

  const handleAiAction = async (
  id: string,
  title: string,
  employer: string,
  mode: 'generate' | 'enhance',
  currentDesc?: string
) => {

  if (!auth.currentUser) {
    setIsAuthModalOpen(true);   // <-- ONLY open auth modal
    return;            // <-- STOP execution
  }
  // Validation (unchanged)
  if (mode === 'generate' && (!title || !employer)) {
    alert("Please enter Job Title and Employer first.");
    return;
  }

  if (mode === 'enhance' && (!currentDesc || currentDesc.trim().length < 5)) {
    alert("Please write some content first.");
    return;
  }

  setAiModal({
    isOpen: true,
    expId: id,
    title,
    employer,
    content: '',
    isLoading: true,
    mode
  });

  try {
    let result = '';

    if (mode === 'generate') {
      result = await generateExperienceDescription(title, employer);
    } else {
      result = await enhanceExperienceDescription(currentDesc || '', title);
    }

    setAiModal(prev => ({
      ...prev,
      content: result,
      isLoading: false
    }));

  } catch (error: any) {

    // 🔐 NOT LOGGED IN → redirect to login
    // if (error.message === "Not authenticated") {
    //   setIsAuthModalOpen(true);
    //   return;
    // }

    // 💳 SUBSCRIPTION REQUIRED → pricing modal
    if (error.message === "Upgrade required") {
      setAiModal(prev => ({ ...prev, isOpen: false }));
      // updateField("showPricingModal", true); // or however you open pricing
      setIsPricingOpen(true);
      return;
    }

    // ❌ Generic error
    setAiModal(prev => ({
      ...prev,
      content: "AI service failed. Please try again later.",
      isLoading: false
    }));
  }
};

  const applyAiContent = () => {
    updateExperienceItem(aiModal.expId, 'description', aiModal.content);
    setAiModal(prev => ({ ...prev, isOpen: false }));
  };
  


  const redoAiAction = async () => {
    setAiModal(prev => ({ ...prev, isLoading: true, content: '' }));
    try {
      let result = '';
      const exp = resumeData.experience.find(e => e.id === aiModal.expId);
      if (aiModal.mode === 'generate') {
        result = await generateExperienceDescription(aiModal.title, aiModal.employer);
      } else {
        result = await enhanceExperienceDescription(exp?.description || '', aiModal.title);
      }
      setAiModal(prev => ({ ...prev, content: result, isLoading: false }));
    } catch (error) {
      setAiModal(prev => ({ ...prev, content: "Failed to process request. Please try again.", isLoading: false }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
       <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={() => navigate('/builder/experience')} 
      />
       <PricingModal isOpen={isPricingOpen} onClose={() => { setIsPricingOpen(false); setAiModal({isOpen:false})}}  />
  
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-navy-900 mb-2">Career Experience</h2>
        <p className="text-gray-500">List your roles, achievements, and impact at work</p>
      </div>

      <div className="space-y-8">
        <AnimatePresence>
          {resumeData.experience.map((exp, index) => (
            <MotionDiv 
              key={exp.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="relative group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              <button 
                onClick={() => removeExperience(exp.id)}
                className="absolute right-4 top-4 text-gray-300 hover:text-red-500 transition-colors p-2"
              >
                <Icons.Trash2 size={18} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                <div className="space-y-1.5">
                   <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Job title</label>
                   <input 
                     value={exp.jobTitle}
                     onChange={(e) => updateExperienceItem(exp.id, 'jobTitle', e.target.value)}
                     className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold"
                     placeholder="e.g. Frontend Developer"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Employer</label>
                   <input 
                     value={exp.employer}
                     onChange={(e) => updateExperienceItem(exp.id, 'employer', e.target.value)}
                     className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold"
                     placeholder="e.g. Google"
                   />
                </div>
              </div>

              <div className="space-y-4">
                 <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                       <button 
                         onClick={() => updateExperienceItem(exp.id, 'descriptionType', 'paragraph')}
                         className={`flex items-center gap-2 py-1.5 px-4 rounded-lg text-xs font-bold transition-all relative ${exp.descriptionType === 'paragraph' ? 'text-navy-900' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                          {exp.descriptionType === 'paragraph' && (
                             <MotionDiv layoutId={`exp-toggle-${exp.id}`} className="absolute inset-0 bg-white rounded-lg shadow-sm" />
                          )}
                          <Icons.Type size={14} className="relative z-10" />
                          <span className="relative z-10">Paragraph</span>
                       </button>
                       <button 
                         onClick={() => updateExperienceItem(exp.id, 'descriptionType', 'list')}
                         className={`flex items-center gap-2 py-1.5 px-4 rounded-lg text-xs font-bold transition-all relative ${(!exp.descriptionType || exp.descriptionType === 'list') ? 'text-navy-900' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                          {(!exp.descriptionType || exp.descriptionType === 'list') && (
                             <MotionDiv layoutId={`exp-toggle-${exp.id}`} className="absolute inset-0 bg-white rounded-lg shadow-sm" />
                          )}
                          <Icons.Menu size={14} className="relative z-10" />
                          <span className="relative z-10">List</span>
                       </button>
                    </div>

                    <div className="flex gap-2">
                        <button 
                          onClick={() => handleAiAction(exp.id, exp.jobTitle, exp.employer, 'enhance', exp.description)}
                          className="flex items-center gap-1 bg-white border border-indigo-200 text-indigo-600 text-xs px-2.5 py-1.5 rounded-md hover:bg-indigo-50 transition-colors shadow-sm font-bold"
                        >
                           <Icons.Zap size={12} className="text-indigo-500" />
                           Enhance
                        </button>
                        <button 
                          onClick={() => handleAiAction(exp.id, exp.jobTitle, exp.employer, 'generate')}
                          className="flex items-center gap-1 bg-navy-900 text-white text-xs px-2.5 py-1.5 rounded-md hover:bg-navy-800 transition-colors shadow-sm font-bold"
                        >
                           <Icons.Sparkles size={12} className="text-yellow-300" />
                           Auto-fill
                        </button>
                    </div>
                 </div>
                 <textarea 
                   placeholder={exp.descriptionType === 'list' ? "Enter points, each on a new line..." : "Describe your role in paragraph form..."} 
                   value={exp.description}
                   onChange={(e) => updateExperienceItem(exp.id, 'description', e.target.value)}
                   className="w-full px-4 py-4 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 outline-none h-32 resize-none leading-relaxed transition-all"
                 />
              </div>
            </MotionDiv>
          ))}
        </AnimatePresence>

        <div className="flex justify-center mt-8">
           <button 
             onClick={addExperience}
             className="flex items-center gap-2 px-8 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/30 transition-all font-bold group"
           >
             <Icons.Plus size={20} />
             Add experience
           </button>
        </div>
      </div>

      {/* AI ACTION MODAL - REUSED FROM PREVIOUS VERSION */}
      <AnimatePresence>
        {aiModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <MotionDiv 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !aiModal.isLoading && setAiModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${aiModal.mode === 'generate' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
                       {aiModal.mode === 'generate' ? <Icons.Sparkles size={16} /> : <Icons.Zap size={16} />}
                    </div>
                    <div>
                       <h3 className="font-bold text-navy-900 text-sm">AI {aiModal.mode === 'generate' ? 'Suggestions' : 'Enhancement'}</h3>
                    </div>
                 </div>
                 <button onClick={() => setAiModal(prev => ({ ...prev, isOpen: false }))} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Icons.X size={20} />
                 </button>
              </div>

              <div className="p-6">
                 {aiModal.isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                       <div className={`w-12 h-12 border-4 rounded-full animate-spin mb-4 ${aiModal.mode === 'generate' ? 'border-purple-100 border-t-purple-600' : 'border-indigo-100 border-t-indigo-600'}`} />
                       <p className="text-gray-500 text-sm font-medium animate-pulse">Thinking...</p>
                    </div>
                 ) : (
                    <div className="space-y-4">
                       <div className={`${aiModal.mode === 'generate' ? 'bg-purple-50/50 border-purple-100' : 'bg-indigo-50/50 border-indigo-100'} rounded-xl p-4 border`}>
                          <textarea 
                            value={aiModal.content}
                            onChange={(e) => setAiModal(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full h-64 bg-transparent border-none focus:ring-0 text-sm text-gray-700 leading-loose resize-none font-sans"
                            placeholder="AI content will appear here..."
                          />
                       </div>
                    </div>
                 )}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end items-center gap-3">
                 <button 
                   onClick={applyAiContent}
                   disabled={aiModal.isLoading || !aiModal.content}
                   className="bg-navy-900 hover:bg-navy-800 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
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

export default ExperienceStep;
