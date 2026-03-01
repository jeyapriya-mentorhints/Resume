import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { useResume } from '../App';
import { TemplatesMap } from './templates';
import TemplatePickerModal from './TemplatePickerModal';

const A4_HEIGHT_PX = 1122;
const PAGE_GAP_PX: number = 0;
const A4_WIDTH_PX = 793.7;
const PAGE_TOP_PADDING = 50;

const LivePreview: React.FC = () => {
  const { resumeData, updateField } = useResume();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const SelectedTemplate = TemplatesMap[resumeData.templateId] || TemplatesMap['tech-design'];

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

        if (elementBottom > currentPageEnd - 2) {
           const nextPageStart = (pageIndex + 1) * totalPageHeight;
           const pushAmount = nextPageStart - relativeTop + PAGE_TOP_PADDING;
           element.style.marginTop = `${pushAmount}px`;
           if (pageIndex + 2 > maxPage) maxPage = pageIndex + 2;
        } else {
           if (pageIndex + 1 > maxPage) maxPage = pageIndex + 1;
        }
      });
      const calculatedPages = Math.ceil(container.scrollHeight / totalPageHeight);
      setTotalPages(Math.max(maxPage, calculatedPages));
    };
    const timer = setTimeout(applyPageBreaks, 100);
    return () => clearTimeout(timer);
  }, [resumeData]);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        if (containerWidth > 0) {
           const newScale = containerWidth / A4_WIDTH_PX;
           setScale(newScale);
        }
      }
    };
    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const generateMask = () => {
    if (PAGE_GAP_PX === 0) return 'none';
    const parts = [];
    // Dynamic mask generation to avoid "transparent" text beyond fixed loops
    const numMasks = Math.max(totalPages, 5);
    for(let i=0; i<numMasks; i++) {
        const start = i * (A4_HEIGHT_PX + PAGE_GAP_PX);
        const end = start + A4_HEIGHT_PX;
        const gapEnd = end + PAGE_GAP_PX;
        parts.push(`rgba(255,255,255,1) ${start}px`);
        parts.push(`rgba(255,255,255,1) ${end}px`);
        parts.push(`rgba(255,255,255,0) ${end}px`);
        parts.push(`rgba(255,255,255,0) ${gapEnd}px`);
    }
    return `linear-gradient(to bottom, ${parts.join(', ')})`;
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
         <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider">Live Preview</h3>
            <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200">{totalPages} {totalPages === 1 ? 'Page' : 'Pages'}</span>
         </div>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 transition-colors"
         >
           Change Template
         </button>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto pr-2 bg-gray-100 rounded-lg border border-gray-200">
         <div className="origin-top-left relative" 
            style={{ 
               width: `${A4_WIDTH_PX}px`,
               minHeight: `${totalPages * (A4_HEIGHT_PX + PAGE_GAP_PX)}px`,
               transform: `scale(${scale})`,
               marginBottom: `-${(totalPages * (A4_HEIGHT_PX + PAGE_GAP_PX)) * (1 - scale)}px`,
               marginRight: `-${A4_WIDTH_PX * (1 - scale)}px`
            }}>
            {/* Pages Background */}
            <div className="absolute top-0 left-0 w-full h-full z-0 flex flex-col items-center">
                 {PAGE_GAP_PX === 0 ? (
                    <div className="bg-white shadow-sm w-[210mm] h-full absolute" />
                 ) : (
                    Array.from({ length: totalPages }).map((_, i) => (
                        <div key={i} className="bg-white shadow-sm w-[210mm] absolute" style={{ height: `${A4_HEIGHT_PX}px`, top: `${i * (A4_HEIGHT_PX + PAGE_GAP_PX)}px` }} />
                     ))
                 )}
            </div>
            <div ref={contentRef} className="relative z-10 w-[210mm]" style={{ maskImage: generateMask(), WebkitMaskImage: generateMask() }}>
                <SelectedTemplate data={resumeData} />
            </div>
         </div>
      </div>

      <TemplatePickerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        currentTemplateId={resumeData.templateId}
        onSelect={(id) => updateField('templateId', id)}
        resumeData={resumeData}
        
      />
    </div>
  );
};

export default LivePreview;