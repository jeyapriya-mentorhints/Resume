
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../components/ui/Icons';
import Header from '../components/Header';
import { useResume } from '../App';
import { optimizeResumeForJD } from '../services/geminiService';
import SEO from '@/components/SEO';

const MotionDiv = motion.div as any;

const JobTarget: React.FC = () => {
  const navigate = useNavigate();
  const { resumeData, setResumeData } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const statusMessages = [
    "Analyzing Job Description...",
    "Extracting critical keywords...",
    "Aligning professional summary...",
    "Optimizing experience bullet points...",
    "Cross-referencing technical skills...",
    "Finalizing ATS-friendly version..."
  ];

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      let idx = 0;
      setStatusMessage(statusMessages[0]);
      interval = setInterval(() => {
        idx = (idx + 1) % statusMessages.length;
        setStatusMessage(statusMessages[idx]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      alert("Please paste a job description to optimize your resume.");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const optimizedData = await optimizeResumeForJD(resumeData, jobDescription);
      
      if (optimizedData) {
        setResumeData(prev => ({
          ...prev,
          ...optimizedData,
          // Ensure we don't lose non-optimized fields like education if AI misses them
          education: optimizedData.education || prev.education,
          certifications: optimizedData.certifications || prev.certifications,
          languages: optimizedData.languages || prev.languages,
          customSections: optimizedData.customSections || prev.customSections,
        }));
        
        // Brief pause for "success" feel
        await new Promise(r => setTimeout(r, 800));
        navigate('/success');
      } else {
        alert("AI Optimization failed. We'll proceed with your current content.");
        navigate('/success');
      }
    } catch (error) {
      console.error("Analyze error:", error);
      alert("Something went wrong. Proceeding with your current resume.");
      navigate('/success');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSkip = () => {
    navigate('/success');
  };

  return (
    <><SEO
  title="Target Your Resume for Jobs"
  description="Optimize and tailor your resume for specific job roles using smart keyword targeting."
  canonical="/job-target"
/>

    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center relative overflow-hidden"
        >
           {/* Decor */}
           <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>

           <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                 <Icons.Target size={40} strokeWidth={1.5} />
              </div>
           </div>

           <h1 className="text-3xl font-bold text-navy-900 mb-4">
             Target a specific job
           </h1>

           <p className="text-gray-500 leading-relaxed mb-8 text-sm md:text-base px-2">
             Paste the job description below. Our AI will rewrite your summary and experience points to mirror exactly what the recruiter is looking for.
           </p>

           <div className="relative mb-8 text-left">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 block">Job Description / Requirements</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the requirements section from the job post here..."
                className="w-full h-48 p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white outline-none resize-none text-sm text-gray-700 placeholder:text-gray-300 transition-colors"
              />
           </div>

           <div className="space-y-4">
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Icons.Sparkles size={20} className="group-hover:animate-pulse text-yellow-300" />
                    Analyze & Optimize Content
                  </>
                )}
              </button>

              <button 
                onClick={handleSkip}
                disabled={isAnalyzing}
                className="text-gray-400 hover:text-navy-900 font-medium text-sm transition-colors block mx-auto"
              >
                Skip this step
              </button>
           </div>

           {/* AI Insight Bubble during Analysis */}
           <AnimatePresence>
             {isAnalyzing && (
               <MotionDiv
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="absolute bottom-6 left-6 right-6 p-4 bg-navy-900 text-white rounded-2xl shadow-2xl flex items-center gap-3 z-20"
               >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                     <Icons.Sparkles size={16} className="text-blue-400" />
                  </div>
                  <div className="text-left">
                     <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">AI Agent Active</div>
                     <div className="text-xs font-medium text-white/90">{statusMessage}</div>
                  </div>
               </MotionDiv>
             )}
           </AnimatePresence>
        </MotionDiv>
      </main>
    </div></>
  );
};

export default JobTarget;
