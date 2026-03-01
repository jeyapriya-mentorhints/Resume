
import React from 'react';
import { useResume } from '../../../App';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../ui/Icons';
import { Project } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

const ProjectsStep: React.FC = () => {
  const { resumeData, updateField } = useResume();
  const navigate = useNavigate();

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      link: '',
      description: '',
      technologies: [],
      descriptionType: 'list'
    };
    updateField('projects', [...resumeData.projects, newProject]);
  };

  const removeProject = (id: string) => {
    updateField('projects', resumeData.projects.filter(p => p.id !== id));
  };

  const updateProjectItem = (id: string, field: keyof Project, value: any) => {
    const updated = resumeData.projects.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    );
    updateField('projects', updated);
  };

  const handleTechChange = (id: string, value: string) => {
      const techs = value.split(',').map(s => s.trim()).filter(s => s !== '');
      updateProjectItem(id, 'technologies', techs);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-navy-900 mb-2">Projects</h2>
        <p className="text-gray-500">Add relevant academic or personal projects.</p>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {resumeData.projects.map((project, index) => (
            <MotionDiv 
              key={project.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="relative group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              <button 
                onClick={() => removeProject(project.id)}
                className="absolute right-4 top-4 text-gray-300 hover:text-red-500 transition-colors p-2"
              >
                <Icons.Trash2 size={18} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                <div className="space-y-1.5">
                   <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Project Title</label>
                   <input 
                     placeholder="e.g. E-commerce Dashboard" 
                     value={project.title}
                     onChange={(e) => updateProjectItem(project.id, 'title', e.target.value)}
                     className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Link</label>
                   <input 
                     placeholder="e.g. github.com/user/repo" 
                     value={project.link}
                     onChange={(e) => updateProjectItem(project.id, 'link', e.target.value)}
                     className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold"
                   />
                </div>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                       <button 
                         onClick={() => updateProjectItem(project.id, 'descriptionType', 'paragraph')}
                         className={`flex items-center gap-2 py-1.5 px-4 rounded-lg text-xs font-bold transition-all relative ${project.descriptionType === 'paragraph' ? 'text-navy-900' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                          {project.descriptionType === 'paragraph' && (
                             <MotionDiv layoutId={`proj-toggle-${project.id}`} className="absolute inset-0 bg-white rounded-lg shadow-sm" />
                          )}
                          <Icons.Type size={14} className="relative z-10" />
                          <span className="relative z-10">Paragraph</span>
                       </button>
                       <button 
                         onClick={() => updateProjectItem(project.id, 'descriptionType', 'list')}
                         className={`flex items-center gap-2 py-1.5 px-4 rounded-lg text-xs font-bold transition-all relative ${(!project.descriptionType || project.descriptionType === 'list') ? 'text-navy-900' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                          {(!project.descriptionType || project.descriptionType === 'list') && (
                             <MotionDiv layoutId={`proj-toggle-${project.id}`} className="absolute inset-0 bg-white rounded-lg shadow-sm" />
                          )}
                          <Icons.Menu size={14} className="relative z-10" />
                          <span className="relative z-10">List</span>
                       </button>
                    </div>
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Description</label>
                 </div>
                 <textarea 
                   placeholder={project.descriptionType === 'list' ? "Enter points, each on a new line..." : "Describe what you built, your role, and the outcome..."} 
                   value={project.description}
                   onChange={(e) => updateProjectItem(project.id, 'description', e.target.value)}
                   className="w-full px-4 py-4 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 outline-none h-32 resize-none transition-all"
                 />
              </div>
            </MotionDiv>
          ))}
        </AnimatePresence>

        <div className="flex justify-center mt-8">
           <button 
             onClick={addProject}
             className="flex items-center gap-2 px-8 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/30 transition-all font-bold group"
           >
             <Icons.Plus size={20} />
             Add Project
           </button>
        </div>
      </div>

    </div>
  );
};

export default ProjectsStep;
