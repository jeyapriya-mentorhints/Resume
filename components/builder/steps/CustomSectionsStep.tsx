
import React from 'react';
import { useResume } from '../../../App';
import { Icons } from '../../ui/Icons';
import { CustomSection } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

const CustomSectionsStep: React.FC = () => {
  const { resumeData, updateField } = useResume();

  const addSection = () => {
    const newSection: CustomSection = { 
      id: Date.now().toString(), 
      title: '', 
      content: '', 
      type: 'paragraph' 
    };
    updateField('customSections', [...(resumeData.customSections || []), newSection]);
  };

  const removeSection = (id: string) => {
    updateField('customSections', (resumeData.customSections || []).filter(s => s.id !== id));
  };

  const updateSection = (id: string, field: keyof CustomSection, value: any) => {
    const updated = (resumeData.customSections || []).map(s => s.id === id ? { ...s, [field]: value } : s);
    updateField('customSections', updated);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-navy-900 mb-2">Custom Sections</h2>
        <p className="text-gray-500">Add unique sections like Hobbies, Volunteer Work, or Publications.</p>
      </div>
      
      <div className="space-y-8">
        <AnimatePresence>
          {(resumeData.customSections || []).map((section) => (
            <MotionDiv 
              key={section.id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              <button 
                onClick={() => removeSection(section.id)} 
                className="absolute right-4 top-4 text-gray-300 hover:text-red-500 transition-colors p-2"
                title="Remove Section"
              >
                <Icons.Trash2 size={18} />
              </button>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Section Title</label>
                    <input 
                      placeholder="e.g. Volunteer Experience" 
                      value={section.title} 
                      onChange={e => updateSection(section.id, 'title', e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none border border-transparent focus:border-blue-500 focus:bg-white transition-all font-semibold text-navy-900" 
                    />
                  </div>

                  {/* Format Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Display Format</label>
                    <div className="flex bg-gray-100 p-1 rounded-xl w-full">
                       <button 
                         onClick={() => updateSection(section.id, 'type', 'paragraph')}
                         className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all relative ${section.type === 'paragraph' ? 'text-navy-900' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                          {section.type === 'paragraph' && (
                             <MotionDiv layoutId={`toggle-${section.id}`} className="absolute inset-0 bg-white rounded-lg shadow-sm" />
                          )}
                          <Icons.Type size={14} className="relative z-10" />
                          <span className="relative z-10">Paragraph</span>
                       </button>
                       <button 
                         onClick={() => updateSection(section.id, 'type', 'list')}
                         className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all relative ${section.type === 'list' ? 'text-navy-900' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                          {section.type === 'list' && (
                             <MotionDiv layoutId={`toggle-${section.id}`} className="absolute inset-0 bg-white rounded-lg shadow-sm" />
                          )}
                          <Icons.Menu size={14} className="relative z-10" />
                          <span className="relative z-10">List</span>
                       </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Content</label>
                   <textarea 
                     placeholder={section.type === 'list' ? "Enter points, each on a new line..." : "Add details for this section..."} 
                     value={section.content} 
                     onChange={e => updateSection(section.id, 'content', e.target.value)} 
                     className="w-full h-40 px-4 py-4 rounded-xl bg-gray-50 outline-none border border-transparent focus:border-blue-500 focus:bg-white transition-all resize-none text-base leading-relaxed text-navy-900" 
                   />
                   {section.type === 'list' && (
                      <p className="text-[10px] text-gray-400 font-medium">Tip: Every new line in the text area will become a bullet point.</p>
                   )}
                </div>
              </div>
            </MotionDiv>
          ))}
        </AnimatePresence>

        <button 
          onClick={addSection} 
          className="w-full py-5 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 font-bold group"
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <Icons.Plus size={20} />
          </div>
          Add Custom Section
        </button>
      </div>
    </div>
  );
};

export default CustomSectionsStep;
