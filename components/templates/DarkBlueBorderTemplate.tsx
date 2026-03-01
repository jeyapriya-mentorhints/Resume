import React from 'react';
import { TemplateProps } from './index';

const DarkBlueBorderTemplate: React.FC<TemplateProps> = ({ data, isAdjusting = false, onAdjustGap }) => {
  const accentColor = data.accentColor || '#1e293b';
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
    <div className="bg-white w-[21cm] min-h-[29.7cm] p-8 relative flex" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <div className="absolute inset-4 border-2 pointer-events-none" style={{ borderColor: accentColor }}></div>
      <div className="w-[7cm] p-8 pt-12 flex flex-col h-full bg-[#f8fafc] border-r border-gray-100">
         <section className="mb-10">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Contact</h2>
            <div className="text-[11px] space-y-3 text-gray-600">
               <div>{data.phone}</div>
               <div className="break-all font-bold">{data.email}</div>
               <div>{data.city}, {data.country}</div>
            </div>
         </section>
         {data.skills.length > 0 && (
           <section className="mb-10">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Stack</h2>
              <div className="flex flex-wrap gap-1.5">
                 {data.skills.map(s => <span key={s} className="px-2 py-0.5 bg-white border border-gray-100 text-[9px] font-bold text-gray-700 rounded skill-item">{s}</span>)}
              </div>
           </section>
         )}
         {data.languages.length > 0 && (
           <section className="mb-10">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Speak</h2>
              <div className="space-y-1 text-[10px]">
                 {data.languages.map(l => <div key={l.id} className="flex justify-between"><span>{l.name}</span><span className="font-bold">{l.level}</span></div>)}
              </div>
           </section>
         )}
         {data.education.length > 0 && (
           <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Study</h2>
              {data.education.map(edu => (
                <div key={edu.id} className="mb-4">
                   <div className="font-bold text-[10px] text-gray-800 uppercase">{edu.school}</div>
                   <div className="text-[9px] text-gray-500 italic">{edu.degree}</div>
                </div>
              ))}
           </section>
         )}
      </div>
      <div className="flex-1 p-10 pt-12 flex flex-col">
         <header className="mb-12">
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-1" style={{ color: accentColor }}>{data.firstName}<br/>{data.lastName}</h1>
            <p className="text-lg font-bold tracking-[0.2em] text-gray-300 uppercase">{data.jobTitle}</p>
         </header>
         <div className="space-y-10 flex-1">
            {data.summary && (
               <section>
                  <p className="text-sm leading-relaxed text-gray-600 italic border-l-4 pl-6" style={{ borderColor: accentColor }}>{data.summary}</p>
               </section>
            )}
            {data.experience.length > 0 && (
               <section>
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-8 section-header">Work History</h2>
                  <div className="space-y-8">
                     {data.experience.map(exp => (
                        <div key={exp.id}>
                           <div className="flex justify-between items-baseline mb-1">
                              <h3 className="font-bold text-gray-800 text-sm uppercase">{exp.jobTitle}</h3>
                              <span className="text-[10px] font-bold text-gray-400">{exp.startDate} - {exp.endDate}</span>
                           </div>
                           <div className="text-xs font-bold mb-3" style={{ color: accentColor }}>{exp.employer}</div>
                           <p className="text-xs text-gray-500 leading-relaxed">{exp.description}</p>
                        </div>
                     ))}
                  </div>
               </section>
            )}
            {data.projects.length > 0 && (
              <section>
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-6 section-header">Key Outputs</h2>
                <div className="space-y-4">
                  {data.projects.map(p => (
                    <div key={p.id}>
                      <div className="font-bold text-xs text-gray-800">{p.title}</div>
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

export default DarkBlueBorderTemplate;