import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Icons } from '../components/ui/Icons';
import Header from '../components/Header';
import { useResume, useAuth } from '../App';
import { parseResumeFromText, parseResumeFromImage } from '../services/geminiService';
import { parseResumeFromTextLocal } from '../services/localParserService';
import { AnalysisResult, ResumeData } from '../types';
import CircularProgress from '../components/ui/CircularProgress';
import AuthModal from '../components/AuthModal';
import ATSSignUpModal from '../components/ATSSignUpModal';
import ATSPricingModal from '../components/ATSPricingModal';
import ATSJobDescriptionModal from '../components/ATSJobDescriptionModal';
import {auth} from '../firebase';
import PricingModal from '../components/PricingModal';
import { optimizeResumeForJD } from '../services/geminiService';
import SEO from '@/components/SEO';

const UploadResume: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setResumeData, resumeData } = useResume();
  const { isLoggedIn } = useAuth();
   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  
  
  // States for flow control
  const [viewState, setViewState] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [statusText, setStatusText] = useState('');
  
  // Data States
  const [localAnalysis, setLocalAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'parsed' | 'raw'>('parsed');
  
  // Workflow Modal States
  // const [isAtsSignUpOpen, setIsAtsSignUpOpen] = useState(false);
//   const [isAtsPricingOpen, setIsAtsPricingOpen] = useState(false);
//   const [isAtsJdOpen, setIsAtsJdOpen] = useState(false);

    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const [isJdOpen, setIsJdOpen] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
  const [pendingJd, setPendingJd] = useState<string | null>(null);
  useEffect(() => {
  if (!auth.currentUser) {
    setViewState('upload');
    setLocalAnalysis(null);
  }
}, []);


  // Load persisted analysis if available (for back navigation)
  useEffect(() => {
    if (Object.keys(resumeData).length > 0 && !localAnalysis) {
        const savedAnalysis = localStorage.getItem('lastAnalysisResult');
        if (savedAnalysis) {
            try {
                setLocalAnalysis(JSON.parse(savedAnalysis));
                setViewState('result');
            } catch (e) {
                console.error("Failed to restore analysis", e);
            }
        }
    }
  }, []);

  useEffect(() => {
    if (localAnalysis) {
        localStorage.setItem('lastAnalysisResult', JSON.stringify(localAnalysis));
    }
  }, [localAnalysis]);

  const defaultAnalysis: AnalysisResult = {
    score: 65,
    summary: "Good start, but needs some polishing for ATS systems.",
    strengths: [
      "Clean, modern layout structure",
      "Clear contact information provided"
    ],
    weaknesses: [
      "Lack of quantifiable metrics in experience",
      "Skills section could be more specific"
    ],
    suggestions: [
      { title: "Experience", description: "Quantify achievements with metrics (percentages, numbers)." },
      { title: "Summary", description: "Add a strong professional summary at the top." }
    ]
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      if (!window.pdfjsLib) {
         reject(new Error("PDF Library not loaded."));
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

  const convertPdfToImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      if (!window.pdfjsLib) {
         reject(new Error("PDF Library not loaded."));
         return;
      }
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
        try {
          // @ts-ignore
          const pdf = await window.pdfjsLib.getDocument({ data: typedarray }).promise;
          // Render 1st page
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({ canvasContext: context, viewport: viewport }).promise;
          
          // Convert to base64 string (remove data prefix)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(dataUrl.split(',')[1]);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const processFile = async (file: File) => {
    setViewState('analyzing');
    setStatusText('Processing file...');

    try {
      let result: { resumeData: Partial<ResumeData>, analysis: AnalysisResult } | null = null;
      let parsedData: Partial<ResumeData> = {};
      let analysisData: AnalysisResult = defaultAnalysis;
      
      if (file.type === 'application/json') {
        const text = await file.text();
        parsedData = JSON.parse(text);
      } 
      else if (file.type === 'application/pdf') {
        setStatusText('Reading PDF...');
        const text = await extractTextFromPdf(file);
        
        // Intelligent Fallback: Check if text is mostly empty (scanned PDF or Image-based PDF)
        if (text.trim().length < 50) {
           setStatusText('Image-based PDF detected. Switching to AI Vision...');
           try {
              const imageBase64 = await convertPdfToImage(file);
              setStatusText('Analyzing visual layout...');
              result = await parseResumeFromImage(imageBase64, 'image/jpeg');
              
              if (result) {
                parsedData = result.resumeData;
                analysisData = result.analysis;
              } else {
                 throw new Error("Vision parsing failed");
              }
           } catch (visionError) {
              console.error("Vision fallback failed", visionError);
              alert("Could not read PDF text or image. Please try a different file.");
              setViewState('upload');
              return;
           }
        } else {
           setStatusText('Analyzing content...');
           result = await parseResumeFromText(text);
           
           if (!result) {
              console.log("AI parsing unavailable. Using Local Parser.");
              setStatusText('Using local parser...');
              parsedData = parseResumeFromTextLocal(text);
              const completeness = Object.keys(parsedData).filter(k => Array.isArray(parsedData[k as keyof ResumeData]) ? (parsedData[k as keyof ResumeData] as any[]).length > 0 : !!parsedData[k as keyof ResumeData]).length;
              analysisData = { ...defaultAnalysis, score: Math.min(100, completeness * 10 + 40) };
           } else {
              parsedData = result.resumeData;
              analysisData = result.analysis;
           }
        }
      } 
      else if (file.type.startsWith('image/')) {
        setStatusText('Processing image...');
        const base64 = await blobToBase64(file);
        setStatusText('Analyzing visual layout...');
        result = await parseResumeFromImage(base64, file.type);
        
        if (result) {
          parsedData = result.resumeData;
          analysisData = result.analysis;
        } else {
           throw new Error("Image parsing failed");
        }
      } 
      else {
        alert("Unsupported file format.");
        setViewState('upload');
        return;
      }

      setResumeData(prev => ({ 
        ...prev, 
        ...parsedData,
        experience: parsedData.experience || prev.experience || [],
        education: parsedData.education || prev.education || [],
        skills: parsedData.skills || prev.skills || [],
        projects: parsedData.projects || prev.projects || [],
        certifications: parsedData.certifications || prev.certifications || [],
        languages: parsedData.languages || prev.languages || [],
        achievements: parsedData.achievements || prev.achievements || [],
        customSections: parsedData.customSections || prev.customSections || [],
      }));
      setLocalAnalysis(analysisData);
      
      setViewState('result');

    } catch (error) {
      console.error("File processing error:", error);
      alert("An error occurred while processing the file.");
      setViewState('upload');
    } finally {
      setStatusText('');
    }
  };

  const handleMakeAtsFriendly = () => {
   //  setIsAtsSignUpOpen(true);
   if (!auth.currentUser) {
    setIsAuthModalOpen(true);
    return;
  }

  if (!resumeData || !resumeData.experience?.length) {
    alert("Please upload a resume first.");
    return;
  }

  setIsJdOpen(true);
  };

  const handleSignUpSuccess = () => {
    setIsAuthModalOpen(false);
    // setTimeout(() => {
    //     setIsPricingOpen(true);
    // }, 300);
  };

  const handlePricingContinue = () => {
    setIsPricingOpen(false);
    setTimeout(() => {
        setIsJdOpen(true);
    }, 300);
  };

  const handleJdOptimize = (jd: string) => {
    console.log("Optimizing for JD:", jd);
    setIsJdOpen(false);
    navigate('/ats-templates');
  };

  const handleJdSkip = () => {
     setIsJdOpen(false);
     navigate('/ats-templates');
  };

  const executeOptimization = async (jd: string, resume: ResumeData) => {
       if (!auth.currentUser) {
          setIsAuthModalOpen(true);   // <-- ONLY open auth modal
          return;            // <-- STOP execution
        }
      setIsOptimizing(true);
      try {
         setViewState('analyzing');
        const optimizedData = await optimizeResumeForJD(resume, jd);
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
         
setIsOptimizing(false);

    if (error.message === "Upgrade required") {
      setViewState('result');      // 🔑 CRITICAL
      setIsPricingOpen(true);      // ✅ NOW VISIBLE
      return;
    }

    console.error("Optimization failed", error);
    setViewState('result');
      }
    };
const handleOptimizeRequest = (jd: string) => {
    setIsJdOpen(false);
    // setViewState('analyzing');   
    // Check if plan is active
    const hasPlan = localStorage.getItem('hasPlan') === 'true';
    // if (!hasPlan) {
      // Store JD and open pricing
      // setPendingJd(jd);
      // setIsPricingOpen(true);
      // return;
    // }

    // Plan exists, execute immediately
    executeOptimization(jd,resumeData);
  };
  if (viewState === 'analyzing') {
    return (<><SEO
  title="Upload Resume for ATS Check"
  description="Upload your resume to analyze ATS compatibility instantly."
  canonical="/upload-resume"
  ogImage="/og/upload.png"
/>
    <div className="min-h-screen bg-white flex flex-col font-sans text-navy-900">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center justify-center max-w-lg text-center animate-in fade-in duration-500">
             <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <Icons.FileText className="text-blue-600 w-10 h-10" />
                </div>
             </div>
             <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-3">Analyzing your resume...</h2>
             <p className="text-gray-500 text-lg">
               {statusText || "Reading structure, extracting skills, and identifying improvements."}
             </p>
          </div>
        </main>
      </div></>
    );
  }

  if (viewState === 'result' && localAnalysis) {
     return (
      <><SEO
  title="Upload Resume for ATS Check"
  description="Upload your resume to analyze ATS compatibility instantly."
  canonical="/upload-resume"
  ogImage="/og/upload.png"
/>
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-navy-900">
           <Header />
           {/* <ATSJobDescriptionModal 
        isOpen={isJdOpen} 
        onClose={() => setIsJdOpen(false)} 
        onOptimize={handleOptimizeRequest} 
        onSkip={() => navigate('/preview')} 
      /> */}
                 <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleSignUpSuccess} />
      <PricingModal isOpen={isPricingOpen} onClose={() => { setIsPricingOpen(false); setPendingJd(null); }} onContinue={handlePricingContinue} />
           <ATSJobDescriptionModal 
        isOpen={isJdOpen} 
        onClose={() => setIsJdOpen(false)} 
        onOptimize={handleOptimizeRequest} 
        onSkip={() => navigate('/preview')} 
      />
           <main className="flex-1 p-4 md:p-8">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                 
                 {/* LEFT COLUMN: Analysis Cards */}
                 <div className="lg:col-span-4 space-y-6">
                    
                    {/* Score Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                       <h3 className="font-bold text-navy-900 mb-6">Resume Score</h3>
                       <div className="flex justify-center mb-6">
                          <CircularProgress percentage={localAnalysis.score} size={140} strokeWidth={12} color={localAnalysis.score > 70 ? "#eab308" : "#ef4444"} />
                       </div>
                       <p className="text-sm text-gray-500 mb-6">{localAnalysis.summary || "Analysis complete."}</p>
                       <button 
                         onClick={handleMakeAtsFriendly}
                         className="w-full bg-[#4F46E5] hover:bg-[#4338ca] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                       >
                          <Icons.Sparkles size={18} />
                          Make it ATS Friendly <Icons.ArrowLeft className="rotate-180" size={16} />
                       </button>
                    </div>

                    {/* Key Insights */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                       <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                          <Icons.Target size={18} className="text-blue-500" /> Key Insights
                       </h3>
                       
                       <div className="space-y-4">
                          {localAnalysis.strengths?.length > 0 && (
                             <div>
                                <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Strengths</h4>
                                <ul className="space-y-2">
                                   {localAnalysis.strengths.map((s, i) => (
                                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                         <Icons.CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                         {s}
                                      </li>
                                   ))}
                                </ul>
                             </div>
                          )}

                          {localAnalysis.weaknesses?.length > 0 && (
                             <div className="mt-4 pt-4 border-t border-gray-50">
                                <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Needs Improvement</h4>
                                <ul className="space-y-2">
                                   {localAnalysis.weaknesses.map((w, i) => (
                                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                         <Icons.XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                                         {w}
                                      </li>
                                   ))}
                                </ul>
                             </div>
                          )}
                       </div>
                    </div>

                    {/* AI Suggestions */}
                    <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                       <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                          <Icons.Zap size={18} className="text-blue-600" fill="currentColor" /> AI Suggestions
                       </h3>
                       <div className="space-y-3">
                          {localAnalysis.suggestions?.map((sugg, i) => (
                             <div key={i} className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                                <h4 className="text-sm font-bold text-blue-700 mb-1">{sugg.title}</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">{sugg.description}</p>
                             </div>
                          ))}
                       </div>
                    </div>

                 </div>

                 {/* RIGHT COLUMN: Parsed Content */}
                 <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-8rem)] overflow-hidden">
                    
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100">
                       <button 
                         onClick={() => setActiveTab('parsed')}
                         className={`px-6 py-4 text-sm font-bold transition-colors relative ${activeTab === 'parsed' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                          Parsed Resume
                          {activeTab === 'parsed' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
                       </button>
                       <button 
                         onClick={() => setActiveTab('raw')}
                         className={`px-6 py-4 text-sm font-bold transition-colors relative ${activeTab === 'raw' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                          Raw Analysis Data
                          {activeTab === 'raw' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
                       </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
                       
                       {activeTab === 'parsed' ? (
                          <div className="max-w-3xl mx-auto bg-white p-10 shadow-sm min-h-full">
                             {/* Header */}
                             <div className="mb-8 border-b border-gray-100 pb-6">
                                <h1 className="text-3xl font-bold text-navy-900 mb-2 uppercase tracking-tight">{resumeData.firstName} {resumeData.lastName}</h1>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                   {resumeData.email && <span className="flex items-center gap-1"><Icons.Mail size={14}/> {resumeData.email}</span>}
                                   {resumeData.phone && <span className="flex items-center gap-1"><Icons.Phone size={14}/> {resumeData.phone}</span>}
                                   {resumeData.city && <span className="flex items-center gap-1"><Icons.MapPin size={14}/> {resumeData.city}</span>}
                                </div>
                             </div>

                             {/* Summary */}
                             {resumeData.summary && (
                                <section className="mb-8">
                                   <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Professional Summary</h2>
                                   <p className="text-sm leading-loose text-gray-700">{resumeData.summary}</p>
                                </section>
                             )}

                             {/* Experience */}
                             {resumeData.experience?.length > 0 && (
                                <section className="mb-8">
                                   <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Experience</h2>
                                   <div className="space-y-6">
                                      {resumeData.experience.map((exp) => (
                                         <div key={exp.id}>
                                            <div className="flex justify-between items-baseline mb-1">
                                               <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                                               <span className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <div className="text-sm text-blue-600 font-medium mb-2">{exp.employer}</div>
                                            <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed space-y-1 pl-1">
                                               {exp.description?.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}
                                            </ul>
                                         </div>
                                      ))}
                                   </div>
                                </section>
                             )}

                             {/* Skills */}
                             {resumeData.skills?.length > 0 && (
                                <section className="mb-8">
                                   <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Core Competencies</h2>
                                   <div className="flex flex-wrap gap-2">
                                      {resumeData.skills.map(skill => (
                                         <span key={skill} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md border border-gray-200">{skill}</span>
                                      ))}
                                   </div>
                                </section>
                             )}
                             
                             {/* Custom Sections (Extracted Data) */}
                             {resumeData.customSections?.length > 0 && (
                               <section className="mb-8">
                                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Additional Information</h2>
                                  <div className="space-y-6">
                                     {resumeData.customSections.map(section => (
                                       <div key={section.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                          <h3 className="text-sm font-bold text-navy-900 mb-2">{section.title}</h3>
                                          {section.type === 'list' ? (
                                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                               {section.content.split('\n').map((line, i) => line.trim() && <li key={i}>{line}</li>)}
                                            </ul>
                                          ) : (
                                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</p>
                                          )}
                                       </div>
                                     ))}
                                  </div>
                               </section>
                             )}

                          </div>
                       ) : (
                          <div className="bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-xs overflow-x-auto shadow-inner">
                             <pre>{JSON.stringify({ resumeData, analysis: localAnalysis }, null, 2)}</pre>
                          </div>
                       )}

                    </div>
                 </div>

              </div>
           </main>
           <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleSignUpSuccess} />
      <PricingModal isOpen={isPricingOpen} onClose={() => { setIsPricingOpen(false); setPendingJd(null); }} onContinue={handlePricingContinue} />
           <ATSJobDescriptionModal 
        isOpen={isJdOpen} 
        onClose={() => setIsJdOpen(false)} 
        onOptimize={handleOptimizeRequest} 
        onSkip={() => navigate('/preview')} 
      />
      
           {/* <ATSSignUpModal 
             isOpen={isAtsSignUpOpen} 
             onClose={() => setIsAtsSignUpOpen(false)} 
             onSuccess={handleSignUpSuccess} 
           />
           
           <ATSPricingModal 
             isOpen={isAtsPricingOpen} 
             onClose={() => setIsAtsPricingOpen(false)} 
             onContinue={handlePricingContinue} 
           /> */}

           {/* <ATSJobDescriptionModal 
             isOpen={isAtsJdOpen} 
             onClose={() => setIsAtsJdOpen(false)} 
             onOptimize={handleJdOptimize}
             onSkip={handleJdSkip}
           /> */}

                    
        </div></>
     );
  }

  return (
    <><SEO
  title="Upload Resume for ATS Check"
  description="Upload your resume to analyze ATS compatibility instantly."
  canonical="/upload-resume"
  ogImage="/og/upload.png"
/>
   <div className="min-h-screen bg-white flex flex-col font-sans text-navy-900">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 py-12">
        <div className="w-full max-w-4xl">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">Upload your resume</h1>
            <p className="text-gray-500">We support PDF and Image formats. Max file size 10MB.</p>
          </div>

          <div className="mb-6">
            <Link to="/" className="text-gray-500 hover:text-navy-900 flex items-center gap-2 text-sm font-medium transition-colors">
              <Icons.ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>

          <div 
            className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 bg-white
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.json,.png,.jpg,.jpeg"
              className="hidden"
            />

            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
              <Icons.CloudUpload size={40} strokeWidth={1.5} />
            </div>

            <h3 className="text-xl font-bold text-navy-900 mb-2">Upload your Resume</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Drag and drop your PDF or Image here, or click to browse files.
            </p>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#5850EC] hover:bg-[#4338ca] text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
            >
              Select File
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col items-center text-center">
               <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                  <Icons.FileText size={24} />
               </div>
               <h3 className="font-bold text-navy-900 mb-1">Smart Analysis</h3>
               <p className="text-xs text-gray-500">Instant scoring & feedback</p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col items-center text-center">
               <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Icons.Zap size={24} fill="currentColor" />
               </div>
               <h3 className="font-bold text-navy-900 mb-1">AI Optimization</h3>
               <p className="text-xs text-gray-500">Rewrite bullet points</p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col items-center text-center">
               <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Icons.MessageCircle size={24} />
               </div>
               <h3 className="font-bold text-navy-900 mb-1">Chat Assistant</h3>
               <p className="text-xs text-gray-500">Ask questions about your CV</p>
            </div>
          </div>

        </div>
      </main>
    </div></>
  );
};

export default UploadResume;