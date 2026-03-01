
import React, { useRef, useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icons } from '../components/ui/Icons';
import Header from '../components/Header';
import { useResume } from '../App';
import { TemplatesMap } from '../components/templates';
import {auth} from '../firebase';

const MotionDiv = motion.div as any;
const A4_HEIGHT_PX = 1122;
const A4_WIDTH_PX = 794; // Fixed A4 width in pixels
const PAGE_TOP_PADDING = 50; 

const Success: React.FC = () => {
  const navigate = useNavigate();
  const { resumeData } = useResume();
  const [isDownloading, setIsDownloading] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('Copy Resume Text');
  
  const resumeRef = useRef<HTMLDivElement>(null);

  // Pagination logic ensures elements are moved to new pages correctly
  useLayoutEffect(() => {
    if (!resumeRef.current) return;
    
    // Small delay to ensure browser has rendered fonts/styles
    const timer = setTimeout(() => {
        const container = resumeRef.current;
        if (!container) return;

        const allElements = container.querySelectorAll('*');
        allElements.forEach((el) => { (el as HTMLElement).style.marginTop = ''; });

        const selectors = ['.section-header', '.job-header', '.description-line', '.skill-item', 'li', 'h1', 'h2', 'h3', 'h4', 'p'].join(', ');
        const elements = Array.from(container.querySelectorAll(selectors));

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i] as HTMLElement;
            if (element.scrollHeight === 0) continue;

            const rect = element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const relativeTop = rect.top - containerRect.top;
            const elementHeight = rect.height;
            const elementBottom = relativeTop + elementHeight;

            const pageIndex = Math.floor(relativeTop / A4_HEIGHT_PX);
            const pageEnd = (pageIndex + 1) * A4_HEIGHT_PX;

            // If an element crosses a page boundary, push it to the next page
            if (elementBottom > pageEnd - 4) {
                const nextPageStart = (pageIndex + 1) * A4_HEIGHT_PX;
                const pushAmount = nextPageStart - relativeTop + PAGE_TOP_PADDING;
                element.style.marginTop = `${pushAmount}px`;
            }
        }
    }, 100);

    return () => clearTimeout(timer);
  }, [resumeData]);

  const handleDownload = async () => {
    if (!resumeRef.current) return;
    setIsDownloading(true);

    try {
      // 🔐 STEP 1: Tell backend a download is happening
    const user = auth.currentUser;
    if (!user) {
      alert("Please login");
      return;
    }

    const token = await user.getIdToken();

    //     const res = await fetch("https://atsfreeresume.in/api/usage/can-download.php", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json",
    //   },
    // });

    // if (!res.ok) {
    //   const data = await res.json();
    //   if (data.reason === "subscription_required") {
    //     alert("Upgrade required to download PDF");
    //     return;
    //   }
    //   throw new Error("Permission denied");
    // }     
     // html2pdf can fail if the window is scrolled or if the target element isn't at x:0
      // @ts-ignore
      const html2pdf = window.html2pdf;
      if (!html2pdf) {
         alert("PDF generator not loaded.");
         return;
      }

      const opt = {
        margin: 0,
        filename: `${resumeData.firstName || 'Resume'}_${resumeData.lastName || ''}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            windowWidth: A4_WIDTH_PX,
            x: 0,           // Fix left cut-off
            y: 0,           // Fix top cut-off
            scrollX: 0,     // Ignore horizontal scroll
            scrollY: 0,     // Ignore vertical scroll
            logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      await html2pdf().set(opt).from(resumeRef.current).save();
      
      // Optional: Post to PHP backend for server-side archival or advanced processing
      /*
      await fetch('/api/generate_pdf.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: resumeRef.current.innerHTML,
          filename: opt.filename
        })
      });
      */
     await fetch("https://atsfreeresume.in/api/usage/track-download.php", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    } catch (e) {
      console.error("Download failed", e);
      alert("Failed to generate PDF. Check browser compatibility.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadJson = () => {
    const jsonString = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.firstName}_${resumeData.lastName}_resume_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    let fullText = `${resumeData.firstName} ${resumeData.lastName}\n${resumeData.jobTitle}\n`;
    if (resumeData.email) fullText += `Email: ${resumeData.email}\n`;
    if (resumeData.phone) fullText += `Phone: ${resumeData.phone}\n`;
    if (resumeData.summary) fullText += `\nSUMMARY\n${resumeData.summary}\n`;
    if (resumeData.experience.length > 0) {
        fullText += `\nEXPERIENCE\n`;
        resumeData.experience.forEach(exp => {
            fullText += `${exp.jobTitle} at ${exp.employer} (${exp.startDate} - ${exp.endDate})\n${exp.description}\n\n`;
        });
    }
    navigator.clipboard.writeText(fullText).then(() => {
        setCopyFeedback('Copied!');
        setTimeout(() => setCopyFeedback('Copy Resume Text'), 2000);
    });
  };

  const SelectedTemplate = TemplatesMap[resumeData.templateId] || TemplatesMap['professional'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      {/* 
          FIXED OFF-SCREEN RENDERER
          We use absolute positioning with a large negative left offset 
          to ensure the element is rendered at its full natural width 
          without being constrained by a 0px container.
      */}
      <div style={{ position: 'absolute', left: '-10000px', top: 0, pointerEvents: 'none' }}>
        <div ref={resumeRef} style={{ width: `${A4_WIDTH_PX}px` }} className="bg-white text-left box-border">
           <SelectedTemplate data={resumeData} />
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-4">
        <MotionDiv 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center relative overflow-hidden"
        >
           <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Icons.Check className="text-green-500 w-6 h-6" strokeWidth={3} />
                 </div>
              </div>
           </div>

           <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">Your resume is ready!</h1>
           <p className="text-gray-500 text-sm mb-10 leading-relaxed">
             Optimized for ATS systems and corrected for pixel-perfect alignment.
           </p>

           <div className="space-y-4 mb-8">
               <button 
                 onClick={handleDownload} 
                 disabled={isDownloading} 
                 className="w-full bg-[#061c3d] hover:bg-[#0a2a5c] text-white font-semibold py-3.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
               >
                 {isDownloading ? (
                   <>
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     Fixing alignment...
                   </>
                 ) : (
                   <>
                     <Icons.Download size={20} />
                     Download PDF
                   </>
                 )}
               </button>

               <button 
                 onClick={handleDownloadJson} 
                 className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-navy-900 font-semibold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2"
               >
                 <Icons.FileText size={20} className="text-blue-600" />
                 Save Editable Data
               </button>

               <button 
                 onClick={handleCopyText} 
                 className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 font-medium py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
               >
                 <Icons.FileText size={16} />
                 {copyFeedback}
               </button>
           </div>

           <button 
             onClick={() => navigate('/')} 
             className="text-gray-400 hover:text-navy-900 text-sm font-medium transition-colors"
           >
             Back to Dashboard
           </button>
        </MotionDiv>
      </main>
    </div>
  );
};

export default Success;
