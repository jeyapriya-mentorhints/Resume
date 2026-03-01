import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useResume, useAuth } from '../App';
import { useNavigate, Link } from 'react-router-dom';
import { Icons } from '../components/ui/Icons';
import Header from '../components/Header';
import { TemplatesMap } from '../components/templates';
import ATSFlowHeader from '../components/ATSFlowHeader';
import AuthModal from '../components/AuthModal';
import SEO from '@/components/SEO';

const A4_HEIGHT_PX = 1122;
const PAGE_GAP_PX = 30;
const A4_WIDTH_PX = 793.7;
const PAGE_TOP_PADDING = 40;

const FinalReview: React.FC = () => {
  const { resumeData } = useResume();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const SelectedTemplate = TemplatesMap[resumeData.templateId] || TemplatesMap['professional'];

  useLayoutEffect(() => {
    if (!contentRef.current) return;
    const applyPageBreaks = () => {
      const container = contentRef.current;
      if (!container) return;
      
      const selectors = ['.section-header', '.job-header', '.description-line', '.skill-item', 'li', 'h1', 'h2', 'h3', 'h4', 'p'].join(', ');
      const elements = Array.from(container.querySelectorAll(selectors));
      
      elements.forEach((el) => { (el as HTMLElement).style.marginTop = ''; });
      
      let maxPage = 1;
      const totalPageHeight = A4_HEIGHT_PX + PAGE_GAP_PX;

      elements.forEach((el) => {
        const element = el as HTMLElement;
        if (element.offsetParent === null) return;
        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const relativeTop = rect.top - containerRect.top;
        const height = rect.height;
        const elementBottom = relativeTop + height;

        const pageIndex = Math.floor(relativeTop / totalPageHeight);
        const currentPageEnd = (pageIndex * totalPageHeight) + A4_HEIGHT_PX;

        if (elementBottom > (currentPageEnd - 8)) {
           const nextPageStart = (pageIndex + 1) * totalPageHeight;
           const pushAmount = nextPageStart - relativeTop + PAGE_TOP_PADDING;
           element.style.marginTop = `${pushAmount}px`;
           if (pageIndex + 2 > maxPage) maxPage = pageIndex + 2;
        } else {
           if (pageIndex + 1 > maxPage) maxPage = pageIndex + 1;
        }
      });
      const totalContentHeight = container.scrollHeight;
      const calculatedPages = Math.ceil(totalContentHeight / totalPageHeight);
      setTotalPages(Math.max(maxPage, calculatedPages));
    };
    const timer = setTimeout(applyPageBreaks, 250);
    return () => clearTimeout(timer);
  }, [resumeData]);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        if (containerWidth > 0) {
          const newScale = Math.min(containerWidth / A4_WIDTH_PX, 1.1);
          setScale(newScale);
        }
      }
    };
    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [resumeData]);

  const handleConfirmDownload = () => {
    if (!isLoggedIn) {
      setIsAuthOpen(true);
      return;
    }

    const hasPlan = localStorage.getItem('hasPlan') === 'true';
    if (!hasPlan) {
      navigate('/pricing');
      return;
    }

    navigate('/success');
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    const hasPlan = localStorage.getItem('hasPlan') === 'true';
    if (!hasPlan) {
      navigate('/pricing');
    } else {
      navigate('/success');
    }
  };

  const generateMask = () => {
    const parts = [];
    for(let i=0; i<10; i++) {
        const start = i * (A4_HEIGHT_PX + PAGE_GAP_PX);
        const end = start + A4_HEIGHT_PX;
        const gapEnd = end + PAGE_GAP_PX;
        parts.push(`black ${start}px`);
        parts.push(`black ${end}px`);
        parts.push(`transparent ${end}px`);
        parts.push(`transparent ${gapEnd}px`);
    }
    return `linear-gradient(to bottom, ${parts.join(', ')})`;
  };

  return (
    <><SEO
  title="Resume Preview"
  description="Resume full preview"
  canonical="/final-preview"
  noindex
/>
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <ATSFlowHeader onBack={() => navigate('/ats-templates')} />
      
      <main className="flex-1 py-8 px-4 flex flex-col items-center gap-6">
        <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-200 z-20">
           <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                 <h1 className="text-xl font-bold text-navy-900 flex items-center gap-2"><Icons.CheckCircle className="text-green-500" size={20} /> Final Review</h1>
                 <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-md border border-blue-100">{totalPages} {totalPages === 1 ? 'Page' : 'Pages'}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Review your ATS optimized resume before downloading.</p>
           </div>
           <div className="flex gap-4">
              <Link to="/ats-templates" className="px-5 py-2.5 text-gray-600 font-bold text-sm hover:bg-gray-50 rounded-xl border border-gray-200">Change Template</Link>
              <button 
                onClick={handleConfirmDownload} 
                className="flex items-center gap-2 px-6 py-2.5 bg-navy-900 text-white rounded-xl font-bold text-sm hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20 transform hover:-translate-y-0.5"
              >
                 <Icons.Download size={18} /> Confirm & Download
              </button>
           </div>
        </div>

        <div ref={containerRef} className="w-full max-w-[210mm] relative flex justify-center pb-20">
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
              <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none flex flex-col items-center">
                 {Array.from({ length: totalPages }).map((_, i) => (
                    <div key={i} className="bg-white shadow-2xl w-[210mm] absolute" style={{ height: `${A4_HEIGHT_PX}px`, top: `${i * (A4_HEIGHT_PX + PAGE_GAP_PX)}px` }} />
                 ))}
              </div>
              <div ref={contentRef} className="relative z-10 w-[210mm]" style={{ minHeight: `${totalPages * (A4_HEIGHT_PX + PAGE_GAP_PX)}px`, maskImage: generateMask(), WebkitMaskImage: generateMask() }}>
                 <SelectedTemplate data={resumeData} />
              </div>
           </div>
        </div>
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={handleAuthSuccess} />
    </div>
    </>
  );
};

export default FinalReview;