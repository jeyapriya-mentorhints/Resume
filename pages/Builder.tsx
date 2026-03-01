
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HeaderStep from '../components/builder/steps/HeaderStep';
import ExperienceStep from '../components/builder/steps/ExperienceStep';
import EducationStep from '../components/builder/steps/EducationStep';
import SkillsStep from '../components/builder/steps/SkillsStep';
import SummaryStep from '../components/builder/steps/SummaryStep';
import ProjectsStep from '../components/builder/steps/ProjectsStep';
import FinalizeStep from '../components/builder/steps/FinalizeStep';
import TemplateStep from '../components/builder/steps/TemplateStep';
import CertificationsStep from '../components/builder/steps/CertificationsStep';
import LanguagesStep from '../components/builder/steps/LanguagesStep';
import CustomSectionsStep from '../components/builder/steps/CustomSectionsStep';
import ATSOptimizationStep from '../components/builder/steps/ATSOptimizationStep';
import LivePreview from '../components/LivePreview';
import BuilderHeader from '../components/builder/BuilderHeader';
import BuilderFooter from '../components/builder/BuilderFooter';
import SEO from '@/components/SEO';

const Builder: React.FC = () => {
  return (
   <><SEO
  title="Resume Builder"
  description="Build your resume"
  canonical="/builder"
  noindex
/>

    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-navy-900">
      <BuilderHeader />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col relative min-w-0">
           <main className="flex-1 overflow-y-auto pb-32 scroll-smooth">
              <div className="max-w-7xl mx-auto p-4 md:p-8 pt-10">
                 <Routes>
                   <Route path="/" element={<Navigate to="header" replace />} />
                   <Route path="header" element={<HeaderStep />} />
                   <Route path="experience" element={<ExperienceStep />} />
                   <Route path="education" element={<EducationStep />} />
                   <Route path="projects" element={<ProjectsStep />} />
                   <Route path="skills" element={<SkillsStep />} />
                   <Route path="certifications" element={<CertificationsStep />} />
                   <Route path="languages" element={<LanguagesStep />} />
                   <Route path="custom" element={<CustomSectionsStep />} />
                   <Route path="summary" element={<SummaryStep />} />
                   <Route path="finalize" element={<FinalizeStep />} />
                   <Route path="ats" element={<ATSOptimizationStep />} />
                   <Route path="template" element={<TemplateStep />} />
                 </Routes>
                 <div className="mt-12 xl:hidden border-t border-gray-200 pt-10 max-w-3xl mx-auto">
                    <LivePreview />
                 </div>
              </div>
           </main>
           <BuilderFooter />
        </div>
        <aside className="hidden xl:block w-[450px] bg-gray-100 border-l border-gray-200 overflow-hidden relative">
           <div className="absolute inset-0 overflow-y-auto p-8 pb-32">
              <div className="sticky top-8">
                 <LivePreview />
              </div>
           </div>
        </aside>
      </div>
    </div>
    </>
  );
};

export default Builder;
