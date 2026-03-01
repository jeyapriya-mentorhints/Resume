import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useResume, useAuth } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import { Icons } from '../components/ui/Icons';
import Header from '../components/Header';
import { TemplatesMap } from '../components/templates';
import AuthModal from '../components/AuthModal';
import { Experience, Education } from '../types';
import SEO from '@/components/SEO';

const A4_HEIGHT_PX = 1122.5;
const PAGE_GAP_PX: number = 30; 
const A4_WIDTH_PX = 793.7;
const PAGE_TOP_PADDING = 40;

const Preview: React.FC = () => {
  const { resumeData, updateGap, updateField, setResumeData } = useResume();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  
  const handleDownload = () => {
    if (isLoggedIn) {
      navigate('/success');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    navigate('/success');
  };

  const handleUpdateExperience = (id: string, field: keyof Experience, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const handleUpdateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const applyPageBreaks = () => {
      const container = contentRef.current;
      if (!container) return;

      // const elements = Array.from(container.querySelectorAll('.section-header, .job-header, .description-line, .skill-item, li, h1, h2, h3, h4, h5, p'));
      const elements = Array.from(
  container.querySelectorAll(
    '.section-header, .job-header'
  )
);

      let maxPage = 1;
      const pageHeight = A4_HEIGHT_PX;
      const totalPageHeight = A4_HEIGHT_PX + PAGE_GAP_PX;

      elements.forEach(el => {
          (el as HTMLElement).style.marginTop = '';
      });

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLElement;
        if (element.offsetParent === null) continue;

        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const relativeTop = rect.top - containerRect.top;
        const height = rect.height;
        const elementBottom = relativeTop + height;

        const pageIndex = Math.floor(relativeTop / totalPageHeight);
        const currentPageEnd = (pageIndex * totalPageHeight) + pageHeight;

      //   if (elementBottom > (currentPageEnd - 8)) {
      //        const nextPageStart = (pageIndex + 1) * totalPageHeight;
      //        const pushAmount = nextPageStart - relativeTop + PAGE_TOP_PADDING;
             
      //        element.style.marginTop = `${pushAmount}px`;
      //        if (pageIndex + 2 > maxPage) maxPage = pageIndex + 2;
      //   } else {
      //        if (pageIndex + 1 > maxPage) maxPage = pageIndex + 1;
      //   }
      // }
      const isHeader =
  element.classList.contains('section-header') ||
  element.classList.contains('job-header');

if (!isHeader) {
  // text lines flow naturally; just track page count
  if (pageIndex + 1 > maxPage) maxPage = pageIndex + 1;
  continue;
}

const next = elements[i + 1] as HTMLElement | undefined;
const nextHeight = next?.getBoundingClientRect().height || 0;
const remainingSpace = currentPageEnd - relativeTop;

// Push header ONLY if it and its next content cannot fit together
if (nextHeight > remainingSpace) {
  const nextPageStart = (pageIndex + 1) * totalPageHeight;
  const pushAmount = nextPageStart - relativeTop + PAGE_TOP_PADDING;

  element.style.marginTop = `${pushAmount}px`;
  if (pageIndex + 2 > maxPage) maxPage = pageIndex + 2;
} else {
  if (pageIndex + 1 > maxPage) maxPage = pageIndex + 1;
}
}
      
      const calculatedPages = Math.ceil(container.scrollHeight / totalPageHeight);
      setTotalPages(Math.max(maxPage, calculatedPages));
    };

    const timer = setTimeout(applyPageBreaks, 250);
    return () => clearTimeout(timer);
  }, [resumeData, isAdjusting]);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        if (containerWidth > 0) {
          const newScale = Math.min(containerWidth / A4_WIDTH_PX, 1.2); 
          setScale(newScale);
        }
      }
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const SelectedTemplate = TemplatesMap[resumeData.templateId] || TemplatesMap['tech-design'];

  const generateMask = () => {
      if (PAGE_GAP_PX === 0) return 'none';
      const parts = [];
      // Generate mask dynamically based on page count to prevent clipping
      const numMasks = Math.max(totalPages, 5); 
      for(let i=0; i<numMasks; i++) {
          const totalHeight = A4_HEIGHT_PX + PAGE_GAP_PX;
          const start = i * totalHeight;
          const end = start + A4_HEIGHT_PX;
          const gapEnd = end + PAGE_GAP_PX;
          // Using white instead of black for alpha mask (safer in Chrome)
          parts.push(`rgba(255,255,255,1) ${start}px`);
          parts.push(`rgba(255,255,255,1) ${end}px`);
          parts.push(`rgba(255,255,255,0) ${end}px`);
          parts.push(`rgba(255,255,255,0) ${gapEnd}px`);
      }
      return `linear-gradient(to bottom, ${parts.join(', ')})`;
  };

  return (
    <><SEO
      title="Resume Preview"
      description="Resume preview"
      canonical="/preview"
      noindex
    />
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <div className="no-print">
        <Header />
      </div>

      <main className="flex-1 py-8 px-4 flex flex-col items-center gap-8">
        <div className="no-print w-full max-w-6xl flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-200 z-20 relative">
           <div className="flex flex-wrap items-center gap-4">
              <Link to="/builder/summary" className="flex items-center gap-2 text-gray-600 hover:text-navy-900 font-bold text-sm">
                 <Icons.ArrowLeft size={18} />
                 Back to Steps
              </Link>
              <div className="h-6 w-px bg-gray-200"></div>
              
              <div className="flex items-center gap-3">
                 <div 
                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${isAdjusting ? 'bg-blue-600' : 'bg-gray-200'}`} 
                   onClick={() => setIsAdjusting(!isAdjusting)}
                 >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAdjusting ? 'translate-x-6' : 'translate-x-1'}`} />
                 </div>
                 <div className="flex flex-col">
                    <span className={`text-sm font-bold leading-tight ${isAdjusting ? 'text-blue-600' : 'text-gray-500'}`}>Fine-tune Layout</span>
                    <span className="text-[10px] text-gray-400 font-medium">Add/Remove blank lines</span>
                 </div>
              </div>
           </div>

           <div className="flex flex-wrap items-center gap-6">
              {!isAdjusting && (
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                   <Icons.Sparkles size={16} />
                   <span className="text-xs font-bold uppercase tracking-wider">Direct Editing Active</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
                 <Icons.FileText size={16} />
                 {totalPages} {totalPages === 1 ? 'Page' : 'Pages'}
              </div>
              <div className="flex gap-3">
                 <Link to="/builder/template" className="px-4 py-2 text-gray-600 font-bold text-sm hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors">Templates</Link>
                 <button onClick={handleDownload} className="flex items-center gap-2 px-6 py-2.5 bg-navy-900 text-white rounded-xl font-bold text-sm hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20 transform hover:-translate-y-0.5">
                    <Icons.Download size={18} />
                    Download PDF
                 </button>
              </div>
           </div>

           {isAdjusting && (
             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-navy-900 text-white text-[10px] font-bold px-6 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
                <Icons.Sparkles size={12} className="text-blue-400" />
                HOVER BETWEEN SECTIONS TO INSERT BLANK SPACE
             </div>
           )}
        </div>

        <div ref={containerRef} className="w-full max-w-[210mm] relative flex justify-center pb-20">
           {/* <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}> */}
           <div
  style={{
    zoom: scale,
    width: `${A4_WIDTH_PX}px`
  }}
>
              <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none flex flex-col items-center">
                 {Array.from({ length: totalPages }).map((_, i) => (
                    <div key={i} className="bg-white shadow-xl w-[210mm] absolute border border-gray-100"
                       style={{ height: `${A4_HEIGHT_PX}px`, top: `${i * (A4_HEIGHT_PX + PAGE_GAP_PX)}px` }}>
                       <div className="absolute -right-12 top-0 text-xs font-bold text-gray-300">PAGE {i + 1}</div>
                    </div>
                 ))}
              </div>

              <div ref={contentRef} className="relative z-10 w-[210mm]"
                style={{
                  minHeight: `${totalPages * (A4_HEIGHT_PX + PAGE_GAP_PX)}px`,
                  // maskImage: generateMask(),
                  // WebkitMaskImage: generateMask()
                }}>
                 <SelectedTemplate 
                    data={resumeData} 
                    isAdjusting={isAdjusting} 
                    onAdjustGap={updateGap} 
                    onUpdateField={updateField}
                    onUpdateExperience={handleUpdateExperience}
                    onUpdateEducation={handleUpdateEducation}
                 />
              </div>
           </div>
        </div>
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleAuthSuccess} />
    </div>
    </>
  );
};

export default Preview;