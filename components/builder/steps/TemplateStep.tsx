
import React,{useState} from 'react';
import { useResume } from '../../../App';
import { availableTemplates, TemplatesMap } from '../../templates';
import { Icons } from '../../ui/Icons';
import { motion } from 'framer-motion';
import { useSubscription } from '@/components/SubcriptionContent';
import { auth } from '../../../firebase';
import PricingModal from '@/components/PricingModal';
import AuthModal from '@/components/AuthModal';
import { useNavigate } from 'react-router-dom';

const MotionDiv = motion.div as any;

const TemplateStep: React.FC = () => {
  const { resumeData, updateField } = useResume();
  const navigate = useNavigate();

  const { isSubscribed, loading } = useSubscription();
    const premiumTemplates = availableTemplates.filter(t => t.isPremium);
  const freeTemplates = availableTemplates.filter(t => !t.isPremium);
    const [isPricingOpen, setIsPricingOpen] = useState(false);
       const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSelectTemplate = (id: string) => {
   const template = availableTemplates.find(t => t.id === id);
   if (template.isPremium && !isSubscribed) {
                         if (!auth.currentUser) {
                             setIsAuthModalOpen(true);   // <-- ONLY open auth modal
                             return;            // <-- STOP execution
                           }
                         setIsPricingOpen(true)
                         return;
                       }
     updateField('templateId', id);
    navigate('/preview')
    // updateField('templateId', id);
  };

  return (
    <div className="w-full pb-20">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={() => setIsAuthModalOpen(false)} 
      />
       <PricingModal isOpen={isPricingOpen} onClose={() => { setIsPricingOpen(false); }}  />
      <div className="text-center mb-10 max-w-2xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-bold text-navy-900 mb-3">Job-winning resume templates</h2>
        <p className="text-gray-500 leading-relaxed">
          Each resume template is designed to follow the exact rules you need to get hired faster.
        </p>
      </div>

      {/* Templates Grid */}
      <h3 className="text-lg font-bold text-navy-900 mb-4">
              Premium Templates
            </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
         {premiumTemplates.map((template, idx) => {
            const TemplateComponent = TemplatesMap[template.id];
            const isSelected = resumeData.templateId === template.id;
            
            return (
                <MotionDiv
                   key={template.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: idx * 0.05 }}
                   className={`group relative bg-white rounded-xl overflow-hidden border-2 transition-all duration-300 flex flex-col ${
                     isSelected 
                       ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-xl scale-[1.02] z-10' 
                       : 'border-gray-100 hover:border-blue-300 hover:shadow-lg hover:scale-[1.01] z-0'
                   }`}
                   onClick={() => handleSelectTemplate(template.id)}
                >
                   {/* Selection Indicator */}
                   <div className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                     isSelected ? 'bg-blue-500 text-white shadow-lg scale-100' : 'bg-gray-100 text-gray-300 scale-90 opacity-0 group-hover:opacity-100'
                   }`}>
                      <Icons.Check size={16} strokeWidth={3} />
                   </div>

                   {/* Preview Container */}
                   <div className="relative h-[420px] bg-gray-50 overflow-hidden cursor-pointer border-b border-gray-100">
                      
                      {/* Scale Wrapper */}
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 scale-[0.33] origin-top shadow-xl pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-[0.34]">
                         <TemplateComponent data={resumeData} />
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className={`absolute inset-0 bg-navy-900/5 transition-opacity duration-300 ${isSelected ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`} />
                      
                      {/* Button Overlay on Hover */}
                      <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <button className="bg-white text-navy-900 px-6 py-2 rounded-full font-bold shadow-lg text-sm border border-gray-100">
                             Use This Template
                          </button>
                      </div>
                   </div>
                   {template.isPremium && (
                          <div className="absolute top-3 left-3 z-20">
                            <span className="px-2 py-1 text-[10px] font-bold 
                                            text-yellow-800 bg-yellow-100 
                                            rounded-full shadow">
                              ⭐ Premium
                            </span>
                          </div>
                        )}
                   <div className="p-5 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold text-lg transition-colors ${isSelected ? 'text-blue-600' : 'text-navy-900'}`}>
                          {template.name}
                        </h3>
                        {isSelected && <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wide">Selected</span>}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4 min-h-[40px]">{template.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                         {template.tags.slice(0, 3).map(tag => (
                           <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold tracking-wider rounded-md">
                             {tag}
                           </span>
                         ))}
                      </div>
                   </div>
                </MotionDiv>
            );
         })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
         {freeTemplates.map((template, idx) => {
            const TemplateComponent = TemplatesMap[template.id];
            const isSelected = resumeData.templateId === template.id;
            
            return (
                <MotionDiv
                   key={template.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: idx * 0.05 }}
                   className={`group relative bg-white rounded-xl overflow-hidden border-2 transition-all duration-300 flex flex-col ${
                     isSelected 
                       ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-xl scale-[1.02] z-10' 
                       : 'border-gray-100 hover:border-blue-300 hover:shadow-lg hover:scale-[1.01] z-0'
                   }`}
                   onClick={() => handleSelectTemplate(template.id)}
                >
                   {/* Selection Indicator */}
                   <div className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                     isSelected ? 'bg-blue-500 text-white shadow-lg scale-100' : 'bg-gray-100 text-gray-300 scale-90 opacity-0 group-hover:opacity-100'
                   }`}>
                      <Icons.Check size={16} strokeWidth={3} />
                   </div>

                   {/* Preview Container */}
                   <div className="relative h-[420px] bg-gray-50 overflow-hidden cursor-pointer border-b border-gray-100">
                      
                      {/* Scale Wrapper */}
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 scale-[0.33] origin-top shadow-xl pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-[0.34]">
                         <TemplateComponent data={resumeData} />
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className={`absolute inset-0 bg-navy-900/5 transition-opacity duration-300 ${isSelected ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`} />
                      
                      {/* Button Overlay on Hover */}
                      <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <button className="bg-white text-navy-900 px-6 py-2 rounded-full font-bold shadow-lg text-sm border border-gray-100">
                             Use This Template
                          </button>
                      </div>
                   </div>
                   
                   <div className="p-5 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold text-lg transition-colors ${isSelected ? 'text-blue-600' : 'text-navy-900'}`}>
                          {template.name}
                        </h3>
                        {isSelected && <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wide">Selected</span>}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4 min-h-[40px]">{template.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                         {template.tags.slice(0, 3).map(tag => (
                           <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold tracking-wider rounded-md">
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
  );
};

export default TemplateStep;
