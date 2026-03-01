
import React, { useState, useMemo } from 'react';
import { useResume } from '../../../App';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';

const MotionSpan = motion.span as any;

const SkillsStep: React.FC = () => {
  const { resumeData, updateField } = useResume();
  const navigate = useNavigate();
  const [currentSkill, setCurrentSkill] = useState('');

  // Common professional skills list
  const commonSkills = [
    "React", "JavaScript", "TypeScript", "Node.js", "Python", 
    "SQL", "Project Management", "Agile", "UI/UX Design", 
    "Communication", "Leadership", "Problem Solving", 
    "Data Analysis", "Digital Marketing", "AWS", "Git"
  ];

  // Filter out skills already added
  const suggestedSkills = useMemo(() => {
    return commonSkills.filter(skill => !resumeData.skills.includes(skill));
  }, [resumeData.skills]);

  const addSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (trimmed && !resumeData.skills.includes(trimmed)) {
      updateField('skills', [...resumeData.skills, trimmed]);
      setCurrentSkill('');
    }
  };

  const handleManualAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    addSkill(currentSkill);
  };

  const removeSkill = (skillToRemove: string) => {
    updateField('skills', resumeData.skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleManualAdd();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-navy-900 mb-2">Skills</h2>
        <p className="text-gray-500">List your technical expertise and soft skills</p>
      </div>

      {/* Best Practice Banner */}
      <div className="flex items-center gap-3 mb-8">
         <span className="bg-navy-900 text-white text-xs font-bold px-2 py-1 rounded-sm">Best practice</span>
         <span className="text-sm text-gray-500">Include keywords from the job description to pass ATS filters.</span>
      </div>

      <div className="space-y-2">
         <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Skills</label>
            <button className="flex items-center gap-1 bg-[#8B5CF6] text-white text-xs px-3 py-1.5 rounded-md hover:bg-[#7C3AED] transition-colors">
               <Icons.Sparkles size={12} />
               AI Suggest
            </button>
         </div>
         
         <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 min-h-[120px]">
            <div className="flex flex-wrap gap-3 mb-4">
               <AnimatePresence>
                  {resumeData.skills.map((skill) => (
                  <MotionSpan 
                     key={skill}
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.8 }}
                     className="bg-white border border-navy-900 text-navy-900 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-3 shadow-sm"
                  >
                     {skill}
                     <button 
                        onClick={() => removeSkill(skill)}
                        className="text-gray-400 hover:text-navy-900"
                     >
                        <Icons.X size={16} />
                     </button>
                  </MotionSpan>
                  ))}
               </AnimatePresence>
               {resumeData.skills.length === 0 && (
                  <p className="text-gray-400 text-sm italic">No skills added yet...</p>
               )}
            </div>
            
            <div className="relative">
               <input 
                  type="text" 
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a skill and press Enter..."
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 outline-none"
               />
               <button 
                  onClick={() => handleManualAdd()}
                  className="absolute right-2 top-2 bg-navy-900 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-navy-800"
               >
                  ADD
               </button>
            </div>
         </div>
      </div>

      {/* Suggested Skill Pills */}
      {suggestedSkills.length > 0 && (
        <div className="mt-8">
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Common Skills</p>
           <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((s) => (
                  <button 
                     key={s} 
                     onClick={() => addSkill(s)}
                     className="text-sm border border-gray-200 text-gray-600 bg-white px-4 py-2 rounded-full hover:border-navy-900 hover:text-navy-900 hover:bg-gray-50 transition-all flex items-center gap-2 group shadow-sm"
                  >
                      {s} <Icons.Plus size={14} className="text-gray-300 group-hover:text-navy-900" />
                  </button>
              ))}
           </div>
        </div>
      )}

    </div>
  );
};

export default SkillsStep;
