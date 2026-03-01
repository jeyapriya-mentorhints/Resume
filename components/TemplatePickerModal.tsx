
import React,{useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './ui/Icons';
import { availableTemplates, TemplatesMap } from './templates';
import { ResumeData } from '../types';
import { useSubscription } from './SubcriptionContent';
import PricingModal from './PricingModal';
import AuthModal from './AuthModal';
import { auth } from '../firebase';



const MotionDiv = motion.div as any;

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplateId: string;
  onSelect: (id: string) => void;
  resumeData: ResumeData;
  isSubscribed: boolean;
  onRequireSubscription: () => void;
}

const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({ 
  isOpen, 
  onClose, 
  currentTemplateId, 
  onSelect,
  resumeData,
  onRequireSubscription
}) => {

const { isSubscribed, loading } = useSubscription();
  const premiumTemplates = availableTemplates.filter(t => t.isPremium);
const freeTemplates = availableTemplates.filter(t => !t.isPremium);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
     const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={() => setIsAuthModalOpen(false)} 
      />
       <PricingModal isOpen={isPricingOpen} onClose={() => { setIsPricingOpen(false); }}  />
  
      
      <div className="fixed inset-0 z-65] flex items-center justify-center p-4 md:p-8 font-sans">
        {/* Backdrop */}
        <MotionDiv 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-navy-900/60 backdrop-blur-md"
        />

        {/* Modal Content */}
        <MotionDiv
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-gray-50 w-full max-w-6xl h-[85vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-white px-8 py-6 border-b border-gray-200 flex justify-between items-center shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-navy-900">Choose a Template</h2>
              <p className="text-sm text-gray-500">Pick a layout that best fits your professional story.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-navy-900 transition-colors"
            >
              <Icons.X size={24} />
            </button>
          </div>

          {/* Grid Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> */}
              <h3 className="text-lg font-bold text-navy-900 mb-4">
              Premium Templates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {premiumTemplates.map((template) => {
                const TemplateComponent = TemplatesMap[template.id];
                const isSelected = currentTemplateId === template.id;

                return (
                  <MotionDiv
                    key={template.id}
                    whileHover={{ y: -5 }}
                    className={`group relative bg-white rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-xl' 
                        : 'border-transparent hover:border-gray-300 shadow-sm'
                    }`}
                    onClick={() => {
                    if (template.isPremium && !isSubscribed) {
                      if (!auth.currentUser) {
                          setIsAuthModalOpen(true);   // <-- ONLY open auth modal
                          return;            // <-- STOP execution
                        }
                      setIsPricingOpen(true)
                      return;
                    }

                    onSelect(template.id);
                    onClose();
                    }}
                  >
                    {/* Tiny Scale Preview */}
                    <div className="relative h-[320px] bg-gray-100 overflow-hidden border-b border-gray-100 flex justify-center">
                       <div className="transform scale-[0.28] origin-top pt-4 pointer-events-none select-none">
                          <TemplateComponent data={resumeData} />
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

                       {/* Selection Checkmark */}
                       {isSelected && (
                         <div className="absolute top-4 right-4 bg-blue-500 text-white p-1.5 rounded-full shadow-lg">
                           <Icons.Check size={16} strokeWidth={3} />
                         </div>
                       )}

                       {/* Hover Overlay */}
                       <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/5 transition-colors duration-300 flex items-center justify-center">
                          <div className="px-6 py-2.5 bg-white text-navy-900 rounded-full font-bold text-sm shadow-xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                             Select This
                          </div>
                       </div>
                    </div>

                   {/* Meta Info  */}
                   <div className="p-4">
                       <h3 className={`font-bold text-sm mb-1 ${isSelected ? 'text-blue-600' : 'text-navy-900'}`}>
                         {template.name}
                       </h3>
                       <div className="flex flex-wrap gap-1.5 mt-2">
                          {template.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
                               {tag}
                            </span>
                          ))}
                       </div>
                    </div>
                  </MotionDiv>
                );
              })}</div>
              <div className="flex items-center gap-4 my-10">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-xs font-bold text-gray-400 uppercase">
                Free Templates
              </span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              
                {freeTemplates.map((template) => {
                const TemplateComponent = TemplatesMap[template.id];
                const isSelected = currentTemplateId === template.id;

                return (
                  <MotionDiv
                    key={template.id}
                    whileHover={{ y: -5 }}
                    className={`group relative bg-white rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-xl' 
                        : 'border-transparent hover:border-gray-300 shadow-sm'
                    }`}
                    onClick={() => {
                    onSelect(template.id);
                    onClose();
                    }}
                  >
                    {/* Tiny Scale Preview */}
                    <div className="relative h-[320px] bg-gray-100 overflow-hidden border-b border-gray-100 flex justify-center">
                       <div className="transform scale-[0.28] origin-top pt-4 pointer-events-none select-none">
                          <TemplateComponent data={resumeData} />
                       </div>


                       {/* Selection Checkmark */}
                       {isSelected && (
                         <div className="absolute top-4 right-4 bg-blue-500 text-white p-1.5 rounded-full shadow-lg">
                           <Icons.Check size={16} strokeWidth={3} />
                         </div>
                       )}

                       {/* Hover Overlay */}
                       <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/5 transition-colors duration-300 flex items-center justify-center">
                          <div className="px-6 py-2.5 bg-white text-navy-900 rounded-full font-bold text-sm shadow-xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                             Select This
                          </div>
                       </div>
                    </div>

                   {/* Meta Info  */}
                   <div className="p-4">
                       <h3 className={`font-bold text-sm mb-1 ${isSelected ? 'text-blue-600' : 'text-navy-900'}`}>
                         {template.name}
                       </h3>
                       <div className="flex flex-wrap gap-1.5 mt-2">
                          {template.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
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
          
          {/* Footer Actions */}
          <div className="bg-white px-8 py-4 border-t border-gray-200 flex justify-end shrink-0">
             <button 
               onClick={onClose}
               className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-navy-900 transition-colors"
             >
               Close Gallery
             </button>
          </div>
        </MotionDiv>
      </div>
    </AnimatePresence>
  );
};

export default TemplatePickerModal;
