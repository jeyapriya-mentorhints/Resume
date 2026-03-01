import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { TemplatesMap } from '../components/templates';
import { ResumeData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../components/ui/Icons';
import { useResume } from '../App';
import { parseResumeFromText } from '../services/geminiService';
import { parseResumeFromTextLocal } from '../services/localParserService';
import ImportResumeModal from '../components/ImportResumeModal';
import SEO from '../components/SEO';
import { extractTextFromFile } from "@/services/extractTextFromFile";
// import { parseResumeText } from "@/services/localParserService";


const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;

// ENRICHED dummy data for the homepage preview to look "fulfilled"
const previewData: ResumeData = {
  firstName: "Jane",
  lastName: "Doe",
  jobTitle: "Senior Software Engineer",
  email: "jane.doe@example.com",
  phone: "(555) 123-4567",
  address: "123 Tech Lane",
  city: "San Francisco",
  country: "CA",
  summary: "Results-driven Senior Software Engineer with over 8 years of experience specializing in building scalable, high-performance web applications. Proven track record of leading cross-functional teams and implementing modern frontend architectures. Expert in React ecosystem, TypeScript, and cloud infrastructure with a deep focus on UI/UX best practices and accessibility.",
  experience: [
    {
      id: "1",
      jobTitle: "Senior Frontend Lead",
      employer: "TechFlow Solutions",
      startDate: "2021-03",
      endDate: "Present",
      location: "San Francisco, CA",
      description: "• Lead a team of 12 developers in rebuilding the core customer dashboard, improving load times by 40%.\n• Architected a reusable component library using React and Tailwind CSS, adopted by 5 independent product teams.\n• Mentored junior developers and implemented standardized code review processes that reduced production bugs by 25%.\n• Spearheaded the migration to Next.js, resulting in a 30% improvement in SEO rankings."
    },
    {
      id: "2",
      jobTitle: "Software Engineer II",
      employer: "Creative Digital Agency",
      startDate: "2018-06",
      endDate: "2021-02",
      location: "Austin, TX",
      description: "• Developed responsive e-commerce websites for major Fortune 500 retail clients, increasing mobile conversion rates by 15%.\n• Integrated third-party payment gateways (Stripe, PayPal) and managed headless CMS integrations using Contentful.\n• Collaborated closely with UI/UX designers to ensure pixel-perfect implementation of complex interactive designs."
    },
    {
      id: "3",
      jobTitle: "Junior Web Developer",
      employer: "StartUp Hub",
      startDate: "2016-05",
      endDate: "2018-05",
      location: "San Jose, CA",
      description: "• Assisted in the development of a real-time analytics platform using Vue.js and Firebase.\n• Wrote unit tests and end-to-end tests using Jest and Cypress, maintaining 90% code coverage.\n• Optimized SQL queries for the internal reporting dashboard, reducing load times by 2 seconds."
    }
  ],
  education: [
    {
      id: "1",
      school: "Stanford University",
      degree: "Master of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2018",
      endDate: "2020",
      location: "Stanford, CA"
    },
    {
      id: "2",
      school: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2012",
      endDate: "2016",
      location: "Berkeley, CA"
    }
  ],
  projects: [
    {
      id: "p1",
      title: "Open Source UI Framework",
      link: "github.com/janedoe/ui-core",
      description: "A lightweight, accessible UI component library built with React and Radix UI primitives.",
      technologies: ["React", "TypeScript", "Tailwind"]
    },
    {
      id: "p2",
      title: "AI Resume Scanner",
      link: "resumescan.ai",
      description: "A tool that uses NLP to analyze resumes against job descriptions for ATS compatibility.",
      technologies: ["Python", "TensorFlow", "React"]
    }
  ],
  skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "GraphQL", "AWS", "Next.js", "Docker", "Redux", "CI/CD", "Jest", "PostgreSQL", "System Design"],
  certifications: [],
  languages: [],
  achievements: [],
  customSections: [],
  templateId: 'modern',
  fontFamily: 'Poppins',
  accentColor: '#2563eb',
  fontSize: 'medium',
  customGaps: {},
};

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const SmartResumeIllustration = () => {
  const [step, setStep] = useState(0); // 0: Idle/Targeting, 1: Writing, 2: Done/Applying
  const [cursorPhase, setCursorPhase] = useState('idle');

  useEffect(() => {
    const cycle = async () => {
      // 1. Move cursor to "Enhance"
      setCursorPhase('targeting');
      await new Promise(r => setTimeout(r, 1200));
      
      // 2. Start Writing
      setStep(1);
      setCursorPhase('waiting');
      await new Promise(r => setTimeout(r, 2500));
      
      // 3. Finish writing, show "Apply Changes"
      setStep(2);
      await new Promise(r => setTimeout(r, 500));
      
      // 4. Move cursor to "Apply Changes"
      setCursorPhase('applying');
      await new Promise(r => setTimeout(r, 1500));
      
      // 5. Reset
      setStep(0);
      setCursorPhase('idle');
      await new Promise(r => setTimeout(r, 1000));
    };

    const interval = setInterval(cycle, 7000);
    cycle(); // Initial run
    return () => clearInterval(interval);
  }, []);

  // Cursor variants
  const cursorVariants = {
    idle: { x: 300, y: 350, opacity: 0 },
    targeting: { x: 120, y: 110, opacity: 1 },
    waiting: { x: 140, y: 130, opacity: 0.5, scale: 0.8 },
    applying: { x: 260, y: 385, opacity: 1, scale: 1 },
  };

  return (
    <div className="w-full h-[450px] bg-slate-50 rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-200 shadow-inner">
       {/* Background Glow */}
       <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-40 translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40 -translate-x-1/3 translate-y-1/3"></div>
       </div>

       {/* AI UI Card */}
       <MotionDiv 
          className="relative z-10 w-[340px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
       >
          {/* Header Area */}
          <div className="px-6 pt-5 pb-3 bg-white flex flex-col gap-4 border-b border-slate-50">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-heading font-black text-slate-400 uppercase tracking-widest">Format</span>
                   <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
                      <div className="px-3 py-1 bg-white text-navy-900 rounded-md text-[10px] font-bold shadow-sm flex items-center gap-1.5">
                         <Icons.Type size={12} className="text-slate-400" />
                         Paragraph
                      </div>
                      <div className="px-3 py-1 text-slate-400 rounded-md text-[10px] font-bold flex items-center gap-1.5">
                         <Icons.Menu size={12} />
                         List
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex gap-2">
                <MotionDiv 
                  className={`flex-1 rounded-xl px-4 py-2 flex items-center justify-center gap-2 border shadow-sm transition-colors duration-300 ${cursorPhase === 'targeting' || step === 1 ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}
                >
                   <Icons.Zap size={14} fill="currentColor" />
                   <span className="text-[10px] font-heading font-black uppercase tracking-wider">Enhance</span>
                </MotionDiv>
                <div className="flex-1 bg-navy-900 text-white rounded-xl px-4 py-2 flex items-center justify-center gap-2 shadow-lg opacity-40">
                   <Icons.Sparkles size={14} className="text-yellow-400" />
                   <span className="text-[10px] font-heading font-black uppercase tracking-wider">Auto-generate</span>
                </div>
             </div>
          </div>

          {/* Content Area */}
          <div className="p-6 h-[220px] relative">
             <AnimatePresence mode="wait">
                {step === 1 ? (
                   /* WRITING STATE */
                   <MotionDiv 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                   >
                      <div className="relative w-12 h-12">
                         <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                         <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <span className="text-slate-400 text-sm font-medium animate-pulse">Writing...</span>
                   </MotionDiv>
                ) : step === 2 ? (
                   /* FINAL STATE */
                   <MotionDiv 
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col"
                   >
                      <div className="flex-1 text-xs text-slate-600 leading-[1.8] font-medium text-justify overflow-hidden pr-2">
                         <p>
                            Results-driven Middleware Specialist with an award-winning track record of architecting and optimizing high-availability WebSphere and WebLogic environments for global leaders like Wipro, HCL, and Infosys. I spearhead the full-lifecycle administration of complex messaging infrastructures using IBM MQ...
                         </p>
                      </div>
                      <div className="absolute top-6 right-3 bottom-6 w-1 bg-slate-100 rounded-full">
                         <MotionDiv 
                           className="w-full bg-slate-300 rounded-full" 
                           animate={{ height: ['20%', '40%', '30%'], top: ['10%', '60%', '20%'] }}
                           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                         />
                      </div>
                   </MotionDiv>
                ) : (
                  /* IDLE / START STATE */
                  <MotionDiv key="idle" className="opacity-20 space-y-4">
                      <div className="h-2 w-full bg-slate-100 rounded"></div>
                      <div className="h-2 w-5/6 bg-slate-100 rounded"></div>
                      <div className="h-2 w-4/6 bg-slate-100 rounded"></div>
                  </MotionDiv>
                )}
             </AnimatePresence>
          </div>

          {/* Footer Action */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
             <MotionDiv 
               className="text-white px-5 py-2.5 rounded-xl text-[11px] font-heading font-black uppercase tracking-widest flex items-center gap-2 shadow-lg transition-colors duration-300"
               animate={{ 
                 backgroundColor: step === 2 ? '#475569' : '#cbd5e1',
                 scale: cursorPhase === 'applying' ? [1, 0.95, 1] : 1
               }}
             >
                Apply Changes
                <Icons.Check size={14} strokeWidth={4} />
             </MotionDiv>
          </div>

          {/* Animated Cursor Arrow */}
          <MotionDiv
            className="absolute z-50 pointer-events-none drop-shadow-xl"
            variants={cursorVariants}
            animate={cursorPhase}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="rotate-[-15deg]">
                <path d="M4 4L11.5 21L14 14L21 11.5L4 4Z" fill="#030712" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                {/* Clicking effect ring */}
                {(cursorPhase === 'targeting' || cursorPhase === 'applying') && (
                  <MotionDiv
                    className="absolute -inset-2 border-2 border-indigo-400 rounded-full"
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6, repeat: 1 }}
                  />
                )}
             </svg>
          </MotionDiv>
       </MotionDiv>

       {/* Floating Tooltips */}
       <MotionDiv 
          className="absolute right-4 bottom-12 bg-white p-3 rounded-2xl shadow-xl border border-blue-50 flex items-start gap-3 w-48 z-20"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1 }}
       >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
             <Icons.CheckCircle size={16} />
          </div>
          <div>
             <div className="text-[9px] font-heading font-black text-navy-900 uppercase">Best Practice</div>
             <p className="text-[8px] text-slate-500 leading-tight mt-1">Keep it under 100 words and focus on unique selling points.</p>
          </div>
       </MotionDiv>
    </div>
  );
};

const AutoGenerationIllustration = () => {
  return (
    <div className="w-full h-[400px] bg-indigo-50/50 rounded-3xl relative overflow-hidden flex items-center justify-center border border-indigo-100 shadow-inner group">
       <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-200 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4"></div>
       </div>

       <div className="relative z-10 w-[300px] h-[340px]">
          <MotionDiv 
             className="absolute left-0 top-0 w-64 h-80 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden flex flex-col z-10"
             initial={{ y: 20, rotate: -2 }}
             whileInView={{ y: 0, rotate: -2 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5 }}
          >
             <div className="flex h-full">
                <div className="w-1/3 bg-[#0f172a] p-3 flex flex-col items-center pt-6">
                   <div className="w-10 h-10 bg-slate-600 rounded-full mb-4 border-2 border-white/20"></div>
                   <div className="w-full space-y-2">
                      <div className="h-1 bg-white/20 rounded-full w-full"></div>
                      <div className="h-1 bg-white/20 rounded-full w-3/4"></div>
                      <div className="h-1 bg-white/20 rounded-full w-5/6"></div>
                   </div>
                   <div className="w-full space-y-2 mt-auto pb-4">
                      <div className="h-1 bg-white/20 rounded-full w-full"></div>
                      <div className="h-1 bg-white/20 rounded-full w-2/3"></div>
                   </div>
                </div>
                <div className="flex-1 p-4 space-y-4">
                   <div>
                      <div className="h-3 bg-[#0f172a] rounded w-3/4 mb-1"></div>
                      <div className="h-1.5 bg-slate-300 rounded w-1/2"></div>
                   </div>
                   
                   <div className="space-y-2 pt-2">
                      <div className="h-1.5 bg-slate-100 rounded w-full"></div>
                      <div className="h-1.5 bg-slate-100 rounded w-full"></div>
                   </div>

                   <div className="relative p-2 rounded bg-indigo-50 border border-indigo-100">
                      <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[8px] font-heading font-black px-1.5 py-0.5 rounded-full shadow-sm">AI</div>
                      <div className="h-1.5 bg-indigo-200 rounded w-full mb-1.5"></div>
                      <div className="h-1.5 bg-indigo-200 rounded w-3/4"></div>
                   </div>

                   <div className="space-y-2">
                      <div className="h-1.5 bg-slate-100 rounded w-full"></div>
                   </div>
                </div>
             </div>
          </MotionDiv>

          <MotionDiv
             className="absolute -right-4 bottom-8 z-20 pointer-events-none"
             initial={{ x: 40, opacity: 0 }}
             whileInView={{ x: 0, opacity: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.2 }}
          >
             <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M70 30V15" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
                <circle cx="70" cy="15" r="5" fill="#facc15" stroke="#0f172a" strokeWidth="3" />
                <rect x="35" y="30" width="70" height="50" rx="12" fill="#e0f2fe" stroke="#0f172a" strokeWidth="4" />
                <circle cx="55" cy="50" r="6" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
                <circle cx="85" cy="50" r="6" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
                <path d="M60 65C60 65 65 70 70 70C75 70 80 65 80 65" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                <path d="M45 85H95V120C95 128.284 88.2843 135 80 135H60C51.7157 135 45 128.284 45 120V85Z" fill="#f1f5f9" stroke="#0f172a" strokeWidth="4" />
             </svg>
          </MotionDiv>

          <MotionDiv 
             className="absolute -left-4 top-16 z-30"
             initial={{ scale: 0 }}
             whileInView={{ scale: 1 }}
             viewport={{ once: true }}
             transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
          >
             <div className="w-16 h-16 bg-emerald-500 rounded-full border-4 border-[#0f172a] flex items-center justify-center shadow-xl">
                <Icons.Check size={32} className="text-white stroke-[4]" />
             </div>
          </MotionDiv>
       </div>
    </div>
  );
};

const AtsIllustration = () => {
  return (
    <div className="w-full h-[400px] bg-slate-50 rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-200 shadow-inner group">
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
         <path d="M50 0 V400 M150 0 V400 M250 0 V400 M350 0 V400 M450 0 V400" stroke="#6366f1" strokeWidth="0.5" />
         <path d="M0 50 H600 M0 150 H600 M0 250 H600 M0 350 H600" stroke="#6366f1" strokeWidth="0.5" />
      </svg>

      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-[80px]"></div>

      <div className="relative z-10 w-[240px] h-[320px] bg-white rounded-xl border border-slate-100 shadow-2xl p-6 flex flex-col">
         <div className="flex gap-3 mb-8 relative">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-indigo-200 rounded-full opacity-50"></div>
            </div>
            <div className="flex-1 space-y-2 py-1">
               <div className="h-2 w-full bg-indigo-50 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-600 w-1/2 animate-[shimmer_2s_infinite]"></div>
               </div>
               <div className="h-2 w-2/3 bg-slate-100 rounded-full"></div>
            </div>
         </div>

         <div className="space-y-6 relative">
            <div className="relative">
               <div className="text-[9px] font-heading font-black text-indigo-900 uppercase tracking-[0.2em] mb-2">Experience</div>
               <div className="space-y-2">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full"></div>
                  <div className="h-1.5 w-5/6 bg-slate-100 rounded-full"></div>
               </div>
            </div>

            <div className="relative">
               <div className="text-[9px] font-heading font-black text-indigo-900 uppercase tracking-[0.2em] mb-2">Skills</div>
               <div className="space-y-2">
                  <div className="h-2 w-full bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)]"></div>
                  <div className="h-1.5 w-4/5 bg-slate-100 rounded-full"></div>
               </div>
            </div>

            <div className="relative">
               <div className="text-[9px] font-heading font-black text-indigo-900 uppercase tracking-[0.2em] mb-2">Education</div>
               <div className="space-y-2">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full"></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const HeroIllustration = () => {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center select-none pointer-events-none lg:pointer-events-auto">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-indigo-100/30 via-blue-50/30 to-slate-50/30 opacity-80 rounded-full blur-3xl" />
      
      <div className="absolute z-0 w-[300px] md:w-[360px] aspect-[210/297] bg-white rounded-xl shadow-lg border border-slate-100 transform -rotate-6 translate-x-12 translate-y-6 opacity-30"></div>
      <div className="absolute z-0 w-[300px] md:w-[360px] aspect-[210/297] bg-white rounded-xl shadow-lg border border-slate-100 transform rotate-3 -translate-x-8 translate-y-3 opacity-50"></div>

      <MotionDiv 
         className="relative z-10 w-[320px] md:w-[400px] aspect-[210/297] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
         initial={{ y: 20, rotate: -1 }}
         animate={{ y: 0, rotate: -1 }}
         whileHover={{ rotate: 0, scale: 1.02 }}
         transition={{ duration: 0.8, ease: "easeOut" }}
      >
         <div className="p-8 pb-4">
            <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                    <div className="h-7 w-40 bg-navy-900 rounded-md" />
                    <div className="h-3 w-32 bg-indigo-600 rounded-md opacity-90" />
                </div>
                <div className="space-y-2 text-right">
                    <div className="h-1.5 w-24 bg-slate-200 rounded-full ml-auto" />
                    <div className="h-1.5 w-28 bg-slate-200 rounded-full ml-auto" />
                </div>
            </div>
            
            <div className="h-[2px] w-full bg-indigo-500/10 mb-8" />

            <div className="grid grid-cols-12 gap-8">
               <div className="col-span-8 space-y-8">
                  <div>
                      <div className="flex items-center gap-2 mb-3">
                         <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                         <div className="h-2 w-28 bg-navy-900/10 rounded-full" /> 
                      </div>
                      <div className="space-y-2.5">
                          <div className="h-2 bg-slate-100 rounded-full w-full" />
                          <div className="h-2 bg-slate-100 rounded-full w-full" />
                      </div>
                  </div>
               </div>

               <div className="col-span-4 space-y-8 border-l border-slate-50 pl-6">
                  <div>
                      <div className="h-2 w-12 bg-navy-900/10 rounded-full mb-4" />
                      <div className="flex flex-wrap gap-2">
                          {[...Array(6)].map((_, i) => (
                              <div key={i} className="h-5 px-3 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-center">
                                  <div className="h-1 w-8 bg-indigo-400/40 rounded-full" />
                              </div>
                          ))}
                      </div>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="mt-auto h-24 bg-gradient-to-t from-white to-transparent" />
      </MotionDiv>

      <MotionDiv 
         className="absolute z-20 top-20 right-0 md:-right-16 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white/50 w-56"
         initial={{ x: 50, opacity: 0 }}
         animate={{ x: 0, opacity: 1 }}
         transition={{ delay: 0.6, duration: 0.6 }}
      >
         <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
               <Icons.Sparkles size={24} fill="currentColor" />
            </div>
            <div className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-heading font-black rounded-md flex items-center gap-1 border border-emerald-100 uppercase tracking-tight">
               <Icons.TrendingUp size={10} /> +45% ATS SCORE
            </div>
         </div>
         <div className="space-y-1">
            <div className="text-[11px] font-heading font-black text-slate-400 uppercase tracking-[0.15em]">AI Optimization</div>
            <div className="text-lg font-heading font-extrabold text-navy-900 leading-[1.2]">Optimized Summary <br/>& Keywords</div>
         </div>
      </MotionDiv>

      <MotionDiv 
         className="absolute z-30 bottom-16 left-0 md:-left-16"
         initial={{ y: 50, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.8, duration: 0.6 }}
      >
         <div className="bg-navy-900 text-white p-2.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 group cursor-pointer hover:bg-slate-900 transition-colors">
            <div className="bg-white/10 p-4 rounded-xl flex items-center gap-3">
                <div className="space-y-1.5">
                    <div className="h-1.5 w-12 bg-white/40 rounded-full" />
                    <div className="h-1.5 w-16 bg-white/20 rounded-full" />
                </div>
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                   <Icons.ChevronRight size={18} />
                </div>
            </div>
            <div className="pr-5">
                <div className="text-[10px] font-heading font-black text-indigo-400 uppercase mb-0.5 tracking-[0.2em]">Interactive</div>
                <div className="text-sm font-heading font-bold">Auto-Fill Content</div>
            </div>
         </div>
      </MotionDiv>
    </div>
  );
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ATS Free Resume",
  "url": "https://atsfreeresume.in",
  "logo": "https://atsfreeresume.in/logo.png"
};
const Home: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStepLabel, setImportStepLabel] = useState('Initializing...');
  const { setResumeData } = useResume();
  const navigate = useNavigate();

  const importSteps = [
    "Reading file data...",
    "Extracting raw content...",
    "AI is parsing your history...",
    "Identifying key skills...",
    "Structuring for ATS formatting...",
    "Finalizing profile data..."
  ];

  const [insightIndex, setInsightIndex] = useState(0);
  const aiInsights = [
    "Scanning document for 50+ layout markers...",
    "Normalizing job titles for ATS clarity...",
    "Extracting quantifiable metrics (%, $, #)...",
    "Matching skills to industry standard taxonomy...",
    "Benchmarking against top professional templates...",
    "Detecting hidden keywords for recruiter searches..."
  ];

  useEffect(() => {
    let interval: any;
    if (isImporting) {
      interval = setInterval(() => {
        setInsightIndex(prev => (prev + 1) % aiInsights.length);
      }, 2400);
    }
    return () => {
       if (interval) clearInterval(interval);
    };
  }, [isImporting]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      if (!window.pdfjsLib) {
         reject(new Error("PDF Library not loaded. Check internet connection."));
         return;
      }
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
        try {
          // @ts-ignore
          const pdf = await window.pdfjsLib.getDocument({ data: typedarray }).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
          }
          resolve(fullText);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportProgress(10);
    setImportStepLabel(importSteps[0]);

    try {
      await new Promise(r => setTimeout(r, 600));
      setImportProgress(25);
      setImportStepLabel(importSteps[1]);

      let textToParse = '';

      if (file.type === 'application/json') {
        const text = await file.text();
        const data = JSON.parse(text);
        setResumeData(prev => ({ ...prev, ...data }));
        setImportProgress(100);
        setImportStepLabel("Success!");
        setTimeout(() => navigate('/builder/summary'), 800);
        setIsImporting(false);
        return;
      } else if (file.type === 'application/pdf') {
        try {
           textToParse = await extractTextFromPdf(file);
        } catch (err) {
           console.error("PDF Extraction Error:", err);
           alert("Could not read PDF. If running locally, ensure you have internet access for the PDF library.");
           setIsImporting(false);
           return;
        }
      } else {
        alert("Please upload a PDF or JSON file.");
        setIsImporting(false);
        return;
      }

      if (textToParse) {
        setImportProgress(45);
        setImportStepLabel(importSteps[2]);
        
        const aiResult = await parseResumeFromText(textToParse);
        
        setImportProgress(75);
        setImportStepLabel(importSteps[3]);
        await new Promise(r => setTimeout(r, 400));
        
        setImportProgress(90);
        setImportStepLabel(importSteps[4]);

        let extractedData: Partial<ResumeData> = {};
        if (aiResult && aiResult.resumeData) {
           extractedData = aiResult.resumeData || {};
        } else {
           console.log("AI parsing unavailable. Using Local Parser.");
           extractedData = parseResumeFromTextLocal(textToParse) || {};
        }

        if (extractedData && typeof extractedData === 'object' && Object.keys(extractedData).length > 0) {
           setResumeData(prev => ({ ...prev, ...extractedData }));
           setImportProgress(100);
           setImportStepLabel(importSteps[5]);
           setTimeout(() => {
              navigate('/builder/header');
           }, 1000);
        } else {
           alert("Could not extract data from resume. Please try filling it manually.");
           setIsImporting(false);
        }
      }

    } catch (error) {
      console.error("Import failed:", error);
      alert("Failed to import resume. Please try again.");
      setIsImporting(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

// const handleFileChange = async (
//   e: React.ChangeEvent<HTMLInputElement>
// ) => {
//   const file = e.target.files?.[0];
//   if (!file) return;

//   try {
//     setImportProgress(34);

//     const text = await extractTextFromFile(file);

//     if (text.length < 300) {
//       throw new Error("Unreadable resume");
//     }

//    //  setImportStep("Structuring resume data…");
//  setImportProgress(67);

//     const parsedData = parseResumeFromTextLocal(text);

//     setResumeData(prev => ({
//       ...prev,
//       ...parsedData,
//     }));

//    //  setImportStep("Resume imported successfully");
//    setImportProgress(100);
//   } catch (err) {
//     console.error(err);
//     alert(
//       "We couldn’t fully read this resume. Please review the imported content."
//     );
//   }
// };


  return (
   <><SEO
  title="Free ATS Resume Builder"
  description="Create a free ATS-friendly resume online with modern templates."
  canonical="/"
  ogImage="/og/default.png"
  schema={organizationSchema}
/>

    <div className="flex flex-col min-h-screen bg-white font-sans text-navy-900 overflow-x-hidden">
      <Header />
      
      <main className="flex-1">
        <input 
          type="file" 
          accept=".pdf,.json" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />

        {/* --- Hero Section --- */}
        <section className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
           <div className="grid lg:grid-cols-2 gap-12 items-center">
              <MotionDiv 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                 <MotionDiv variants={fadeInUp} className="text-[10px] font-heading font-black text-indigo-600 uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
                    <span className="w-8 h-0.5 bg-indigo-600 inline-block"></span>
                    Online Resume Builder
                 </MotionDiv>
                 <MotionH1 variants={fadeInUp} className="text-4xl md:text-7xl font-heading font-black leading-[1.05] mb-6 text-navy-900 tracking-tighter">
                    Free <br />
                    ATS-Friendly <br />
                    <span className="text-indigo-600">CV Maker</span>
                 </MotionH1>
                 
                 <MotionDiv variants={fadeInUp} className="space-y-4 mb-10 max-w-xl">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 text-indigo-500 shrink-0">
                        <Icons.Zap size={22} fill="currentColor" />
                      </div>
                      <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium">
                        AI Resume Builder – Create an ATS‑Friendly resume in minutes with free resume templates and smart resume maker tools.
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="mt-1 text-indigo-600 shrink-0">
                        <Icons.Briefcase size={22} fill="currentColor" />
                      </div>
                      <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium">
                        Best alternate for myresumebuilder, resume now, or nova resume.
                      </p>
                    </div>
                 </MotionDiv>

                 <MotionDiv variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 items-center justify-center md:justify-start">
                    <Link 
                      to="/builder"
                      className="w-full sm:w-52 py-5 bg-navy-900 text-white font-heading font-black uppercase tracking-widest text-xs rounded-full hover:bg-indigo-600 transition-all shadow-xl shadow-navy-900/20 hover:shadow-indigo-600/30 transform hover:-translate-y-1 flex items-center justify-center"
                    >
                       Build Resume
                    </Link>
                    <button 
                      onClick={handleImportClick}
                      disabled={isImporting}
                      className="w-full sm:w-52 py-5 bg-white text-navy-900 border-2 border-navy-900 font-heading font-black uppercase tracking-widest text-xs rounded-full hover:bg-navy-900 hover:text-white transition-all shadow-sm transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-60"
                    >
                       <Icons.Upload size={18} strokeWidth={3} />
                       Import Resume
                    </button>
                 </MotionDiv>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, x: 50, rotate: 2 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative hidden lg:block"
              >
                 <HeroIllustration />
              </MotionDiv>
           </div>
        </section>

        {/* --- Top Templates Section (Free Resume Templates) --- */}
        <section className="bg-slate-50 py-32 overflow-hidden">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <MotionDiv 
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true, margin: "-100px" }}
                 variants={fadeInUp}
                 className="text-center mb-20"
              >
                 <h2 className="text-4xl md:text-5xl font-heading font-black text-navy-900 mb-4 tracking-tighter">Our top templates</h2>
                 <p className="text-slate-500 max-w-xl mx-auto text-lg font-medium">Professionally designed, ATS-friendly templates that get you hired.</p>
              </MotionDiv>

              <div className="flex flex-col lg:flex-row items-center gap-20">
                 <MotionDiv 
                    className="lg:w-2/5"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInLeft}
                 >
                    <h3 className="text-3xl md:text-4xl font-heading font-extrabold text-navy-900 mb-6 tracking-tight leading-tight">Free Resume Templates</h3>
                    <p className="text-slate-500 mb-10 leading-loose text-lg font-medium">
                       Choose from 20+ resume template designs with the right format for a resume to highlight your skills. From writing resumes to creating your resume, our intelligent AI cv maker and free resume template builder help you build your resume fast using free resume templates that are ATS‑ready and recruiter‑approved.
                    </p>
                    <Link 
                      to="/templates"
                      className="inline-flex items-center gap-3 px-10 py-4 bg-navy-900 text-white font-heading font-black uppercase tracking-widest text-xs rounded-full hover:bg-indigo-600 transition-all shadow-xl"
                    >
                       View All Templates <Icons.ChevronRight size={18} strokeWidth={3} />
                    </Link>
                 </MotionDiv>

                 <div className="lg:w-3/5 relative h-[600px] flex items-center justify-center">
                    <MotionDiv 
                       className="absolute left-0 lg:left-10 top-10 z-0"
                       initial={{ opacity: 0, x: -50, rotate: -10 }}
                       whileInView={{ opacity: 0.6, x: 0, rotate: -6 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.8 }}
                    >
                        <div className="w-[300px] h-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                           <div className="w-[210mm] h-[297mm] origin-top-left transform scale-[0.38]">
                              <TemplatesMap.professional data={previewData} />
                           </div>
                        </div>
                    </MotionDiv>

                    <MotionDiv 
                       className="absolute right-0 lg:right-10 top-10 z-0"
                       initial={{ opacity: 0, x: 50, rotate: 10 }}
                       whileInView={{ opacity: 0.6, x: 0, rotate: 6 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.8 }}
                    >
                        <div className="w-[300px] h-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                           <div className="w-[210mm] h-[297mm] origin-top-left transform scale-[0.38]">
                              <TemplatesMap.minimal data={previewData} />
                           </div>
                        </div>
                    </MotionDiv>
                    
                    <MotionDiv 
                       className="relative z-10"
                       initial={{ opacity: 0, y: 50, scale: 0.9 }}
                       whileInView={{ opacity: 1, y: 0, scale: 1 }}
                       viewport={{ once: true }}
                       whileHover={{ y: -15, transition: { duration: 0.3 } }}
                       transition={{ duration: 0.6 }}
                    >
                       <div className="w-[360px] h-[520px] bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)]">
                          <div className="w-[210mm] h-[297mm] origin-top-left transform scale-[0.43]">
                             <TemplatesMap.modern data={previewData} />
                          </div>
                       </div>
                    </MotionDiv>
                 </div>
              </div>
           </div>
        </section>

        {/* --- Change Resume to ATS friendly Section --- */}
        <section className="py-32 bg-white border-b border-slate-50">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                 <MotionDiv 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInLeft}
                    className="order-1 lg:order-1"
                 >
                    <h2 className="text-4xl md:text-5xl font-heading font-black text-navy-900 mb-12 tracking-tighter leading-tight">
                       Change Resume to ATS friendly
                    </h2>
                    
                    <div className="space-y-12 mb-12">
                       <div className="flex gap-6 items-start">
                          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 shadow-sm border border-indigo-100">
                             <Icons.Target size={28} strokeWidth={2} />
                          </div>
                          <p className="text-navy-900 text-xl font-heading font-bold leading-snug tracking-tight pt-1">
                             We make your ATS‑friendly CV truly stand out by intelligently analysing job descriptions
                          </p>
                       </div>

                       <div className="flex gap-6 items-start">
                          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 shadow-sm border border-amber-100">
                             <Icons.Zap size={28} fill="currentColor" />
                          </div>
                          <p className="text-slate-500 text-lg leading-relaxed font-medium">
                             Simply add the job description, and our AI resume builder instantly adapts your resume with the right keywords, formatting, and structure. With our collection of ATS‑friendly resume templates, this ensures your resume passes Applicant Tracking Systems (ATS) and aligns perfectly with recruiter expectations—helping you land interviews faster.
                          </p>
                       </div>
                    </div>

                    <Link to="/builder" className="inline-flex items-center gap-3 px-12 py-5 bg-navy-900 text-white font-heading font-black uppercase tracking-widest text-xs rounded-full hover:bg-indigo-600 transition-all shadow-2xl transform hover:-translate-y-1">
                       Get Started Now <Icons.ChevronRight size={20} strokeWidth={3} />
                    </Link>
                 </MotionDiv>
                 
                 <MotionDiv 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInRight}
                    className="order-2 lg:order-2"
                 >
                    <div className="relative">
                       <div className="absolute inset-0 bg-indigo-600 rounded-3xl transform rotate-3 opacity-5"></div>
                       <AtsIllustration />
                    </div>
                 </MotionDiv>
              </div>
           </div>
        </section>

        <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <MotionDiv 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-24"
           >
              <h2 className="text-4xl md:text-5xl font-heading font-black text-navy-900 mb-5 tracking-tighter leading-tight">Tools Designed to Land You Interviews</h2>
              <p className="text-slate-500 max-w-xl mx-auto text-lg font-medium">From AI optimization to ATS friendly templates & everything you need.</p>
           </MotionDiv>

           <div className="space-y-40">
              <MotionDiv 
                 className="grid md:grid-cols-2 gap-20 items-center"
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true, margin: "-100px" }}
                 variants={staggerContainer}
              >
                 <MotionDiv variants={fadeInLeft} className="order-2 md:order-1 relative">
                    <SmartResumeIllustration />
                 </MotionDiv>
                 <MotionDiv variants={fadeInRight} className="order-1 md:order-2 md:pl-10">
                    <h3 className="text-3xl md:text-4xl font-heading font-black text-navy-900 mb-6 tracking-tight">Smarter Resumes. More Interviews.</h3>
                    <p className="text-slate-500 leading-relaxed mb-8 text-xl font-medium">
                       Just paste the job description or industry you are looking for and let AI do the heavy lifting—optimizing your resume to meet recruiter's expectations perfectly.
                    </p>
                 </MotionDiv>
              </MotionDiv>

              <MotionDiv 
                 className="grid md:grid-cols-2 gap-20 items-center"
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true, margin: "-100px" }}
                 variants={staggerContainer}
              >
                 <MotionDiv variants={fadeInLeft} className="order-1 md:order-1 md:pr-10">
                    <h3 className="text-3xl md:text-4xl font-heading font-black text-navy-900 mb-6 tracking-tight">Auto generation makes easy</h3>
                    <p className="text-gray-500 leading-relaxed mb-8 text-xl font-medium">
                       Skip the struggle of writing—our auto-generate feature creates polished resume content in just a click. Fast, smart, and completely hassle-free.
                    </p>
                 </MotionDiv>
                 <MotionDiv variants={fadeInRight} className="order-2 md:order-2 relative">
                    <div className="absolute inset-0 bg-indigo-600 rounded-3xl transform -rotate-3 opacity-10"></div>
                    <AutoGenerationIllustration />
                 </MotionDiv>
              </MotionDiv>

              <MotionDiv 
                 className="grid md:grid-cols-2 gap-20 items-center"
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true, margin: "-100px" }}
                 variants={staggerContainer}
              >
                 <MotionDiv variants={fadeInLeft} className="order-2 md:order-1 relative">
                    <div className="absolute inset-0 bg-indigo-50 rounded-3xl transform rotate-2 opacity-50"></div>
                    <AtsIllustration />
                 </MotionDiv>
                 <MotionDiv variants={fadeInRight} className="order-1 md:order-2 md:pl-10">
                    <h3 className="text-3xl md:text-4xl font-heading font-black text-navy-900 mb-6 tracking-tight">ATS-Ready Resume Templates</h3>
                    <p className="text-slate-500 leading-relaxed mb-8 text-xl font-medium">
                       Choose from recruiter-approved templates designed specifically to pass Applicant Tracking Systems (ATS) without losing visual appeal.
                    </p>
                 </MotionDiv>
              </MotionDiv>
           </div>
        </section>

        <section className="py-32 bg-slate-50">
           <div className="max-w-6xl mx-auto px-4 text-center">
              <MotionH1 
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true }}
                 variants={fadeInUp}
                 className="text-4xl md:text-5xl font-heading font-black text-navy-900 mb-20 tracking-tighter"
              >
                 Hear from our customers
              </MotionH1>
              
              <MotionDiv 
                 className="grid md:grid-cols-3 gap-10 text-left"
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true }}
                 variants={staggerContainer}
              >
                 {[
                    {
                       text: "Loved the auto-generate feature, it saved me so much time and gave me polished content I wouldn't have written myself.",
                       author: "Sarah J.",
                       role: "Product Manager"
                    },
                    {
                       text: "A game-changer! Simple to use, with modern templates and AI suggestions that actually impress recruiters.",
                       author: "Mark T.",
                       role: "Developer"
                    },
                    {
                       text: "Super easy to use—AI tailored my resume perfectly to the job description and saved me hours of editing.",
                       author: "Emily R.",
                       role: "Designer"
                    }
                 ].map((t, i) => (
                    <MotionDiv 
                       key={i} 
                       variants={fadeInUp}
                       className="bg-white p-10 rounded-[32px] hover:shadow-2xl transition-all duration-500 border border-slate-100"
                    >
                       <div className="flex gap-1 mb-6">
                          {[1,2,3,4,5].map(star => <Icons.Sparkles key={star} size={16} className="text-indigo-400 fill-indigo-400" />)}
                       </div>
                       <p className="text-slate-600 text-lg mb-8 leading-relaxed font-medium">"{t.text}"</p>
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-heading font-black">
                             {t.author[0]}
                          </div>
                          <div>
                             <div className="font-heading font-black text-navy-900 text-sm uppercase tracking-wider">{t.author}</div>
                             <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t.role}</div>
                          </div>
                       </div>
                    </MotionDiv>
                 ))}
              </MotionDiv>
           </div>
        </section>

        <section className="py-32 px-4">
           <MotionDiv 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto bg-navy-900 rounded-[48px] py-24 px-10 text-center text-white relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]"
           >
              <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -ml-20 -mt-20"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mb-20"></div>

              <h2 className="text-4xl md:text-6xl font-heading font-black mb-6 tracking-tighter relative z-10 leading-tight">Build. Apply. Get Hired.</h2>
              <p className="text-indigo-100/70 mb-12 max-w-lg mx-auto relative z-10 text-xl font-medium">
                 Create your optimized resume in minutes with AI and ATS-friendly templates.
              </p>
              <Link 
                to="/builder"
                className="relative z-10 px-12 py-5 bg-white text-navy-900 font-heading font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-indigo-50 transition-all shadow-2xl transform hover:-translate-y-1 inline-block"
              >
                 Start Building Now
              </Link>
           </MotionDiv>
        </section>

        <ImportResumeModal 
          isOpen={isImporting}
          progress={importProgress}
          stepLabel={importStepLabel}
          insightIndex={insightIndex}
          aiInsights={aiInsights}
          importSteps={importSteps}
        />
      </main>

      <Footer />
    </div>
    </>
  );
};

export default Home;