import React from 'react';
import { TemplateProps } from './index';

const TimelineTemplate: React.FC<TemplateProps> = ({ data, isAdjusting = false, onAdjustGap }) => {
  const fontFamily = data.fontFamily || 'Poppins';

  const GapHandle = ({ id }: { id: string }) => {
    if (!isAdjusting || !onAdjustGap) return null;
    const currentGap = data.customGaps[id] !== undefined ? data.customGaps[id] : 20;
    return (
      <div className="no-print relative h-0 w-full group/handle z-50">
        <div className="absolute inset-x-0 -top-2 flex justify-center opacity-0 group-hover/handle:opacity-100 transition-opacity">
          <div className="bg-blue-600 text-white rounded-full shadow-lg flex overflow-hidden border border-white">
            <button onClick={(e) => { e.stopPropagation(); onAdjustGap(id, -5); }} className="px-2 py-1 hover:bg-blue-700 border-r border-blue-500 text-[10px] font-bold">-</button>
            <div className="px-2 py-1 text-[10px] font-bold bg-blue-50 text-blue-600 min-w-[30px] text-center">{currentGap}px</div>
            <button onClick={(e) => { e.stopPropagation(); onAdjustGap(id, 5); }} className="px-2 py-1 hover:bg-blue-700 text-[10px] font-bold">+</button>
          </div>
        </div>
        <div className="absolute inset-x-0 -top-[1px] border-t border-dashed border-blue-400 opacity-20 group-hover/handle:opacity-100 transition-opacity" />
      </div>
    );
  };

  return (
    <div className="bg-white w-[21cm] min-h-[29.7cm] p-12 text-gray-800" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
       <header className="flex justify-between items-start mb-12">
          <div>
             <h1 className="text-4xl font-light uppercase tracking-widest text-gray-800 mb-2">
                {data.firstName} <span className="font-bold">{data.lastName}</span>
             </h1>
             <p className="text-sm tracking-[0.3em] uppercase text-gray-400">{data.jobTitle}</p>
          </div>
          <div className="text-right text-xs text-gray-400 space-y-1">
             <div>{data.phone}</div>
             <div className="break-all">{data.email}</div>
             <div>{data.city}, {data.country}</div>
          </div>
       </header>

       <div className="grid grid-cols-12 gap-10">
          <div className="col-span-7 space-y-10 border-r border-gray-100 pr-10">
             {data.experience.length > 0 && (
                <section>
                   <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-8 section-header">Work History</h2>
                   <div className="space-y-0 relative border-l border-gray-200 ml-1.5">
                      {data.experience.map(exp => (
                         <div key={exp.id} className="pl-8 pb-10 relative last:pb-0">
                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-gray-300"></div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">{exp.startDate} - {exp.endDate}</div>
                            <h3 className="text-sm font-bold text-gray-800">{exp.jobTitle}</h3>
                            <div className="text-xs italic text-gray-500 mb-3">{exp.employer}</div>
                            <p className="text-xs text-gray-600 leading-relaxed">{exp.description}</p>
                         </div>
                      ))}
                   </div>
                </section>
             )}
             {data.projects && data.projects.length > 0 && (
               <section>
                 <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 section-header">Projects</h2>
                 <div className="space-y-6">
                   {data.projects.map(p => (
                     <div key={p.id}>
                       <h3 className="text-sm font-bold text-gray-800">{p.title}</h3>
                       <p className="text-xs text-gray-600">{p.description}</p>
                     </div>
                   ))}
                 </div>
               </section>
             )}
          </div>

          <div className="col-span-5 space-y-10">
             {data.summary && (
                <section>
                   <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 section-header">Professional Profile</h2>
                   <p className="text-xs leading-loose text-gray-600 text-justify whitespace-pre-line">{data.summary}</p>
                </section>
             )}
             {data.skills.length > 0 && (
                <section>
                   <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 section-header">Expertise</h2>
                   <div className="flex flex-wrap gap-2">
                      {data.skills.map(s => <span key={s} className="px-2 py-1 bg-gray-50 text-[10px] font-bold text-gray-600 border border-gray-100 rounded skill-item">{s}</span>)}
                   </div>
                </section>
             )}
             {data.education.length > 0 && (
               <section>
                 <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 section-header">Academic</h2>
                 <div className="space-y-6">
                   {data.education.map(edu => (
                     <div key={edu.id}>
                        <div className="text-[10px] font-bold text-gray-400 mb-1">{edu.startDate} - {edu.endDate}</div>
                        <h3 className="text-xs font-bold text-gray-800 uppercase">{edu.school}</h3>
                        <div className="text-[10px] text-gray-500 italic">{edu.degree}</div>
                     </div>
                   ))}
                 </div>
               </section>
             )}
             {data.certifications.length > 0 && (
               <section>
                 <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Awards</h2>
                 <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside">
                   {data.certifications.map(c => <li key={c.id}>{c.name}</li>)}
                 </ul>
               </section>
             )}
          </div>
       </div>
    </div>
  );
};

export default TimelineTemplate;