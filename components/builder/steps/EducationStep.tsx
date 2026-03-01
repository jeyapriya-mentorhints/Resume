

import React from 'react';
import { useResume } from '../../../App';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../ui/Icons';
import { Education } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

const EducationStep: React.FC = () => {
  const { resumeData, updateField } = useResume();
  const navigate = useNavigate();

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      location: ''
    };
    updateField('education', [...resumeData.education, newEdu]);
  };

  const removeEducation = (id: string) => {
    updateField('education', resumeData.education.filter(edu => edu.id !== id));
  };

  const updateEducationItem = (id: string, field: keyof Education, value: string) => {
    const updated = resumeData.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    updateField('education', updated);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-navy-900 mb-2">Education</h2>
        <p className="text-gray-500">List your school, college & other educational details</p>
      </div>

      <div className="space-y-8">
        <AnimatePresence>
          {resumeData.education.map((edu, index) => (
            <MotionDiv 
              key={edu.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="relative group"
            >
              {index > 0 && <hr className="border-gray-100 mb-8" />}
              <button 
                onClick={() => removeEducation(edu.id)}
                className="absolute -right-2 -top-2 text-gray-300 hover:text-red-500 transition-colors"
              >
                <Icons.Trash2 size={18} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1.5">
                   <label className="text-sm font-medium text-gray-700">College name</label>
                   <input 
                     value={edu.school}
                     onChange={(e) => updateEducationItem(edu.id, 'school', e.target.value)}
                     className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 outline-none"
                     placeholder="Anna university"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-sm font-medium text-gray-700">City</label>
                   <input 
                     value={edu.location}
                     onChange={(e) => updateEducationItem(edu.id, 'location', e.target.value)}
                     className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 outline-none"
                     placeholder="Chennai"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-sm font-medium text-gray-700">Degree</label>
                   <input 
                     value={edu.degree}
                     onChange={(e) => updateEducationItem(edu.id, 'degree', e.target.value)}
                     className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 outline-none"
                     placeholder="Enter your degree"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-sm font-medium text-gray-700">Field of study</label>
                   <input 
                     value={edu.fieldOfStudy}
                     onChange={(e) => updateEducationItem(edu.id, 'fieldOfStudy', e.target.value)}
                     className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 outline-none"
                     placeholder="Enter your field of study"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-sm font-medium text-gray-700">Start date</label>
                   <div className="relative">
                      <input 
                         type="text" 
                         onFocus={(e) => e.target.type = 'date'}
                         value={edu.startDate}
                         onChange={(e) => updateEducationItem(edu.id, 'startDate', e.target.value)}
                         className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 outline-none"
                         placeholder="Starting date"
                      />
                   </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-sm font-medium text-gray-700">End date</label>
                   <div className="relative">
                      <input 
                         type="text" 
                         onFocus={(e) => e.target.type = 'date'}
                         value={edu.endDate}
                         onChange={(e) => updateEducationItem(edu.id, 'endDate', e.target.value)}
                         className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 outline-none"
                         placeholder="Ended date"
                      />
                   </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">
                 <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                    <div className="w-2 h-2 bg-transparent rounded-full"></div>
                 </div>
                 Currently working here
              </div>
            </MotionDiv>
          ))}
        </AnimatePresence>

        <div className="flex justify-center mt-8">
           <button 
             onClick={addEducation}
             className="flex items-center gap-2 px-6 py-3 border border-navy-900 rounded-lg text-navy-900 font-semibold hover:bg-gray-50 transition-colors"
           >
             <Icons.Plus size={18} />
             Add education
           </button>
        </div>
      </div>

    </div>
  );
};

export default EducationStep;