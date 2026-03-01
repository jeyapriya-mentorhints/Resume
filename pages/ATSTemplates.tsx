

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { TemplatesMap } from '../components/templates';
import { useResume } from '../App';
import { Icons } from '../components/ui/Icons';
import ATSFlowHeader from '../components/ATSFlowHeader';
import { ResumeData } from '../types';
import SEO from '@/components/SEO';

const MotionDiv = motion.div as any;

// Memoized Wrapper to prevent re-rendering of heavy resume previews when only ID changes
const MemoizedTemplatePreview = React.memo(
  ({ Component, data }: { Component: React.FC<{ data: ResumeData }>, data: ResumeData }) => {
    return (
      <div className="transform scale-[0.38] origin-top shadow-xl pointer-events-none select-none bg-white">
        <Component data={data} />
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison:
    // If component type changed, re-render
    if (prevProps.Component !== nextProps.Component) return false;
    
    // If data reference is same, skip re-render
    if (prevProps.data === nextProps.data) return true;

    // Deep check excluding templateId (which triggers the update)
    // We stringify content to see if ACTUAL resume content changed.
    const { templateId: pid, ...prevRest } = prevProps.data;
    const { templateId: nid, ...nextRest } = nextProps.data;
    
    return JSON.stringify(prevRest) === JSON.stringify(nextRest);
  }
);

const ATSTemplates: React.FC = () => {
  const { resumeData, updateField } = useResume();
  const navigate = useNavigate();

  const handleSelectTemplate = (templateId: string) => {
    updateField('templateId', templateId);
    navigate('/final-review');
  };

  const templatesToShow = [
    {
      id: 'modern',
      label: 'Modern ATS',
      description: "Clean, structured, and parse-friendly. Best for corporate roles.",
      tags: ["Recommended", "Corporate"],
      isRecommended: true,
    },
    {
      id: 'professional',
      label: 'Standard Professional',
      description: "High readability layout preferred by recruiters. Proven track record.",
      tags: ["Standard", "Clean"],
      isRecommended: false,
    },
    {
      id: 'simple-professional',
      label: 'Minimalist Layout',
      description: "Centered headers with strong hierarchy. Excellent for finance and law.",
      tags: ["Minimal", "Finance"],
      isRecommended: false,
    },
    {
      id: 'clean-modern',
      label: 'Structured Sidebar',
      description: "Distinct sections with clear separation. Great for tech roles.",
      tags: ["Sidebar", "Tech"],
      isRecommended: false,
    },
    {
      id: 'classic',
      label: 'Executive Serif',
      description: "Traditional layout with serif fonts. Ideal for senior and academic roles.",
      tags: ["Senior", "Legal"],
      isRecommended: false,
    },
    {
      id: 'minimal',
      label: 'Pure Content',
      description: "No distractions, just content. 100% parse rate guarantee.",
      tags: ["Simple", "Entry-level"],
      isRecommended: false,
    }
  ];

  return (
    <><SEO
  title="ATS Resume Templates"
  description="Download ATS-friendly resume templates designed to pass applicant tracking systems."
  canonical="/ats-templates"
/>
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <ATSFlowHeader onBack={() => navigate('/upload-resume')} />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-3">
              Choose an ATS Template
            </h1>
            <p className="text-gray-500 text-lg">
              Select a layout optimized for parsing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {templatesToShow.map((template, idx) => {
              const TemplateComponent = TemplatesMap[template.id];
              const isSelected = resumeData.templateId === template.id;

              return (
                <MotionDiv
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer ${
                    isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200'
                  }`}
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  {/* Preview Container */}
                  <div className="relative h-[400px] bg-gray-100 overflow-hidden flex justify-center items-start pt-6">
                    
                    {/* Memoized Scale Wrapper */}
                    <MemoizedTemplatePreview Component={TemplateComponent} data={resumeData} />

                    {/* Recommended Badge */}
                    {template.isRecommended && (
                      <div className="absolute top-4 left-4 z-20 bg-[#10b981] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Icons.CheckCircle size={12} /> Recommended
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/10 transition-colors duration-300 flex items-center justify-center">
                      <button className="bg-navy-900 text-white px-6 py-2.5 rounded-full font-bold shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        Use This Template
                      </button>
                    </div>
                  </div>
                  
                  {/* Footer Info */}
                  <div className="p-5 border-t border-gray-100 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold text-lg ${template.isRecommended ? 'text-blue-600' : 'text-navy-900'}`}>
                        {template.label}
                      </h3>
                      {isSelected && <Icons.Check className="text-blue-500" size={20} />}
                    </div>
                    <p className="text-xs text-gray-500 mb-4 flex-1 leading-relaxed">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {template.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </MotionDiv>
              );
            })}
          </div>
        </div>
      </main>
      
      <Footer />
    </div></>
  );
};

export default ATSTemplates;