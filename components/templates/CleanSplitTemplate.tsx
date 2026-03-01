import React from 'react';
import { TemplateProps } from './index';

const CleanSplitTemplate: React.FC<TemplateProps> = ({ data, isAdjusting = false, onAdjustGap }) => {
  const accentColor = data.accentColor || '#1f2937';
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
    <div className="bg-[#fafafa] w-[21cm] min-h-[29.7cm] flex flex-col p-12 text-gray-800" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
       <header className="mb-12 border-b border-gray-200 pb-10 flex justify-between items-end">
          <div>
             <h1 className="text-5xl font-black tracking-tight mb-2" style={{ color: accentColor }}>{data.firstName} {data.lastName}</h1>
             <p className="text-xl font-bold text-gray-400 uppercase tracking-widest">{data.jobTitle}</p>
          </div>
          <div className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest space-y-1">
             <div>{data.phone}</div>
             <div className="break-all">{data.email}</div>
             <div>{data.city}, {data.country}</div>
          </div>
       </header>
       <div className="flex-1 grid grid-cols-12 gap-12">
          <div className="col-span-4 space-y-10 border-r border-gray-100 pr-10">
             {data.summary && (
                <section>
                   <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-gray-300">Profile</h2>
                   <p className="text-xs leading-relaxed text-gray-500 italic text-justify">{data.summary}</p>
                </section>
             )}
             {data.skills.length > 0 && (
                <section>
                   <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-gray-300">Skills</h2>
                   <div className="space-y-2">
                      {data.skills.map(s => <div key={s} className="text-xs font-bold text-gray-600 skill-item"># {s}</div>)}
                   </div>
                </section>
             )}
             {data.certifications.length > 0 && (
                <section>
                   <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-gray-300">Awards</h2>
                   <div className="space-y-4">
                      {data.certifications.map(c => (
                         <div key={c.id} className="text-[10px] text-gray-500">
                            <div className="font-black uppercase">{c.name}</div>
                            <div>{c.date}</div>
                         </div>
                      ))}
                   </div>
                </section>
             )}
          </div>
          <div className="col-span-8 space-y-12">
             {data.experience.length > 0 && (
                <section>
                   <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-gray-300 section-header">History</h2>
                   <div className="space-y-10">
                      {data.experience.map(exp => (
                         <div key={exp.id}>
                            <div className="flex justify-between items-baseline mb-2">
                               <h3 className="font-bold text-lg text-gray-800">{exp.jobTitle}</h3>
                               <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: accentColor }}>{exp.employer}</div>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">{exp.description}</p>
                         </div>
                      ))}
                   </div>
                </section>
             )}
             {data.projects && data.projects.length > 0 && (
               <section>
                 <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-gray-300 section-header">Deliverables</h2>
                 <div className="space-y-6">
                   {data.projects.map(p => (
                     <div key={p.id}>
                       <h3 className="text-sm font-bold text-gray-800">{p.title}</h3>
                       <p className="text-xs text-gray-500 mt-1">{p.description}</p>
                     </div>
                   ))}
                 </div>
               </section>
             )}
             {data.education.length > 0 && (
               <section>
                 <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-gray-300 section-header">Education</h2>
                 <div className="grid grid-cols-2 gap-8">
                   {data.education.map(edu => (
                     <div key={edu.id}>
                        <div className="font-bold text-sm text-gray-800">{edu.school}</div>
                        <div className="text-xs text-gray-400 italic">{edu.degree}</div>
                     </div>
                   ))}
                 </div>
               </section>
             )}
          </div>
       </div>
    </div>
  );
};

export default CleanSplitTemplate;