import React from 'react';
import { TemplateProps } from './index';

const PhotoSidebarTemplate: React.FC<TemplateProps> = ({ data, isAdjusting = false, onAdjustGap }) => {
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
    <div className="bg-white w-[21cm] min-h-[29.7cm] flex" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <div className="w-[7.5cm] bg-[#f1f5f9] flex flex-col p-8 pt-12 shrink-0">
         <div className="w-40 h-40 bg-gray-200 rounded-full mx-auto mb-10 overflow-hidden border-4 border-white shadow-inner flex items-center justify-center text-4xl text-gray-400">
           {data.firstName?.[0]}
         </div>
         <div className="space-y-10 flex-1">
            <section>
               <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">Contact</h2>
               <div className="text-xs space-y-3 text-gray-600">
                  <div>{data.phone}</div>
                  <div className="break-all">{data.email}</div>
                  <div>{data.city}, {data.country}</div>
               </div>
            </section>
            {data.skills.length > 0 && (
              <section>
                 <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">Skills</h2>
                 <div className="flex flex-wrap gap-2">
                   {data.skills.map(s => <span key={s} className="px-2 py-1 bg-white text-[10px] rounded border border-gray-100 skill-item">{s}</span>)}
                 </div>
              </section>
            )}
            {data.languages.length > 0 && (
              <section>
                 <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">Languages</h2>
                 <div className="space-y-2 text-xs">
                   {data.languages.map(l => <div key={l.id} className="flex justify-between"><span>{l.name}</span><span className="opacity-50 italic">{l.level}</span></div>)}
                 </div>
              </section>
            )}
         </div>
      </div>
      <div className="flex-1 p-12 flex flex-col">
         <header className="mb-12">
            <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-800">{data.firstName} {data.lastName}</h1>
            <p className="text-2xl font-light text-slate-400 uppercase tracking-widest mt-1">{data.jobTitle}</p>
         </header>
         <div className="space-y-12">
            {data.summary && (
              <section>
                 <h2 className="text-xl font-bold text-slate-800 mb-4 section-header">About Me</h2>
                 <p className="text-sm leading-relaxed text-gray-600 text-justify">{data.summary}</p>
              </section>
            )}
            {data.experience.length > 0 && (
              <section>
                 <h2 className="text-xl font-bold text-slate-800 mb-6 section-header">Work Experience</h2>
                 <div className="space-y-8">
                   {data.experience.map(exp => (
                     <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-1">
                           <h3 className="font-bold text-slate-700">{exp.jobTitle}</h3>
                           <span className="text-xs text-slate-400 font-bold uppercase">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <div className="text-sm font-medium text-blue-600 mb-3">{exp.employer}</div>
                        <p className="text-xs text-gray-500 leading-relaxed">{exp.description}</p>
                     </div>
                   ))}
                 </div>
              </section>
            )}
            {data.projects && data.projects.length > 0 && (
              <section>
                 <h2 className="text-xl font-bold text-slate-800 mb-4 section-header">Project Spotlight</h2>
                 <div className="space-y-4">
                   {data.projects.map(p => (
                     <div key={p.id}>
                       <div className="font-bold text-sm">{p.title}</div>
                       <p className="text-xs text-gray-500">{p.description}</p>
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

export default PhotoSidebarTemplate;