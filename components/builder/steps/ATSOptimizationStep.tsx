import React, { useState, useEffect } from 'react';
import { useAuth, useResume } from '../../../App';
import { Icons } from '../../ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../../AuthModal';
import {auth} from '../../../firebase';
import PricingModal from '../../PricingModal';
import ATSJobDescriptionModal from '../../ATSJobDescriptionModal';
import { optimizeResumeForJD } from '../../../services/geminiService';
import { useNavigate } from 'react-router-dom';

const MotionDiv = motion.div as any;

const ATSOptimizationStep: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { resumeData, setResumeData } = useResume();
  const navigate = useNavigate();
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isJdOpen, setIsJdOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [pendingJd, setPendingJd] = useState<string | null>(null);

  // Listen for footer trigger (though user requested its removal, keeping logic for main button)
  useEffect(() => {
    const handleFooterTrigger = () => startAtsFlow();
    window.addEventListener('trigger-ats-boost', handleFooterTrigger);
    return () => window.removeEventListener('trigger-ats-boost', handleFooterTrigger);
  }, [isLoggedIn]);

  const startAtsFlow = () => {
    if (!isLoggedIn) {
      setIsAuthOpen(true);
      return;
    }
    // New Workflow: Start with Job Description first
    setIsJdOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    setIsJdOpen(true);
  };

  const executeOptimization = async (jd: string) => {
     if (!auth.currentUser) {
        setIsAuthOpen(true);   // <-- ONLY open auth modal
        return;            // <-- STOP execution
      }
    setIsOptimizing(true);
    try {
      const optimizedData = await optimizeResumeForJD(resumeData, jd);
      if (optimizedData) {
        // setResumeData(prev => ({ ...prev, ...optimizedData }));
        setResumeData(prev => {
  const updated = {
    ...prev,

    summary: optimizedData.summary ?? prev.summary,

    skills: optimizedData.skills ?? prev.skills,

    experience: optimizedData.experience
      ? optimizedData.experience.map((optExp, index) => ({
          ...prev.experience[index],   // preserve id, dates, employer
          ...optExp                    // apply optimized content
        }))
      : prev.experience,
  };

  // 🔒 persist immediately (important in your app)
  localStorage.setItem("resumeData", JSON.stringify(updated));
 console.log(
  "FINAL EXPERIENCE IDS:",
  updated.experience.map(e => e.id)
);

  return updated;
});


        console.log("ATS Optimization successful", optimizedData);
      }
      setTimeout(() => {
        setIsOptimizing(false);
        navigate('/preview');
      }, 1500);
    } catch (error:any) {
       if (error.message === "Upgrade required") {
      setIsJdOpen( false);
      setIsOptimizing(false);
      // updateField("showPricingModal", true); // or however you open pricing
      setIsPricingOpen(true)
      return;
    }
      console.error("Optimization failed", error);
      setIsOptimizing(false);
      navigate('/preview');
    }
  };

  const handlePricingContinue = () => {
    localStorage.setItem('hasPlan', 'true');
    setIsPricingOpen(false);
    // If we have a stored JD from the previous step, process it now
    if (pendingJd) {
      executeOptimization(pendingJd);
      setPendingJd(null);
    }
  };

  const handleOptimizeRequest = (jd: string) => {
    setIsJdOpen(false);
    
    // Check if plan is active
    const hasPlan = localStorage.getItem('hasPlan') === 'true';
    // if (!hasPlan) {
      // Store JD and open pricing
      // setPendingJd(jd);
      // setIsPricingOpen(true);
      // return;
    // }

    // Plan exists, execute immediately
    executeOptimization(jd);
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-indigo-50 rounded-3xl text-indigo-600 mb-4 shadow-sm border border-indigo-100">
           <Icons.Sparkles size={32} className="animate-pulse" />
        </div>
        <h2 className="text-4xl font-bold text-navy-900 mb-3">Ultimate ATS Power-Up</h2>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Pass automated screening systems with 99% accuracy.
        </p>
      </div>

      {/* Main Action Section */}
      <div className="bg-navy-900 rounded-3xl p-8 md:p-10 text-center text-white relative overflow-hidden shadow-2xl mb-12">
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
         <div className="relative z-5">
            <h3 className="text-2xl font-bold mb-6">Ready to land that interview?</h3>
            
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={startAtsFlow}
                disabled={isOptimizing}
                className="w-full max-w-sm px-10 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isOptimizing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Optimizing Resume...
                  </>
                ) : (
                  <>
                    <Icons.Sparkles size={20} />
                    Boost ATS Score Now
                  </>
                )}
              </button>
              
              <button 
                onClick={() => navigate('/preview')}
                className="text-blue-300 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors py-2"
              >
                Skip for now
              </button>
            </div>

            <p className="text-blue-200/20 text-[10px] uppercase font-black tracking-widest mt-10">
              Powered by Gemini 3 Pro Engine
            </p>
         </div>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-12">
         {[
           { title: "Keyword Injection", desc: "Automatically inserts missing industry terms.", icon: Icons.Target, color: "text-blue-500", bg: "bg-blue-50" },
           { title: "Quantified Impact", desc: "Rewrites bullets to focus on metrics.", icon: Icons.TrendingUp, color: "text-green-500", bg: "bg-green-50" },
           { title: "Smart Formatting", desc: "Ensures fonts and spacing are 100% parseable.", icon: Icons.Layout, color: "text-purple-500", bg: "bg-purple-50" },
           { title: "Job Description Match", desc: "Tailors every word to your specific role.", icon: Icons.Search, color: "text-amber-500", bg: "bg-amber-50" }
         ].map((feature, i) => (
           <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center shrink-0`}>
                 <feature.icon size={20} />
              </div>
              <div>
                 <h4 className="font-bold text-navy-900 text-sm mb-1">{feature.title}</h4>
                 <p className="text-[11px] text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={handleAuthSuccess} />
      <PricingModal isOpen={isPricingOpen} onClose={() => { setIsPricingOpen(false); setPendingJd(null); }} onContinue={handlePricingContinue} />
      <ATSJobDescriptionModal 
        isOpen={isJdOpen} 
        onClose={() => setIsJdOpen(false)} 
        onOptimize={handleOptimizeRequest} 
        onSkip={() => navigate('/preview')} 
      />
    </div>
  );
};

export default ATSOptimizationStep;