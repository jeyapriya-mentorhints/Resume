import React from 'react';
import { TemplateProps } from './index';

const MinimalistTealTemplate: React.FC<TemplateProps> = ({ data, isAdjusting = false, onAdjustGap }) => {
  const accentColor = data.accentColor || '#0d9488';
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
    <div className="bg-white w-[21cm] min-h-[29.7cm] p-16 flex flex-col" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
       <header className="mb-16">
          <h1 className="text-6xl font-black tracking-tighter mb-2" style={{ color: accentColor }}>{data.firstName} {data.lastName}</h1>
          <p className="text-2xl font-light text-gray-400 tracking-widest uppercase">{data.jobTitle}</p>
          <div className="mt-8 flex gap-8 text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em]">
             <span>{data.email}</span>
             <span>{data.phone}</span>
             <span>{data.city}, {data.country}</span>
          </div>
       </header>
       <div className="flex-1 grid grid-cols-12 gap-16">
          <div className="col-span-8 space-y-12">
             {data.experience.length > 0 && (
                <section>
                   <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8 section-header" style={{ color: accentColor }}>History</h2>
                   <div className="space-y-10">
                      {data.experience.map(exp => (
                         <div key={exp.id}>
                            <div className="flex justify-between items-baseline mb-2">
                               <h3 className="font-bold text-gray-800 text-lg">{exp.jobTitle}</h3>
                               <span className="text-[10px] font-bold text-gray-300">{exp.startDate} – {exp.endDate}</span>
                            </div>
                            <div className="text-sm font-bold mb-3 italic" style={{ color: accentColor }}>{exp.employer}</div>
                            <p className="text-sm text-gray-500 leading-relaxed text-justify">{exp.description}</p>
                         </div>
                      ))}
                   </div>
                </section>
             )}
             {data.projects && data.projects.length > 0 && (
               <section>
                 <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-6 section-header" style={{ color: accentColor }}>Projects</h2>
                 <div className="grid grid-cols-2 gap-8">
                   {data.projects.map(p => (
                     <div key={p.id}>
                       <h3 className="text-sm font-bold text-gray-800 mb-1">{p.title}</h3>
                       <p className="text-xs text-gray-500">{p.description}</p>
                     </div>
                   ))}
                 </div>
               </section>
             )}
          </div>
          <div className="col-span-4 space-y-12">
             {data.summary && (
                <section>
                   <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: accentColor }}>Intro</h2>
                   <p className="text-xs leading-loose text-gray-400">{data.summary}</p>
                </section>
             )}
             {data.skills.length > 0 && (
                <section>
                   <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: accentColor }}>Stack</h2>
                   <ul className="space-y-2">
                      {data.skills.map(s => <li key={s} className="text-[11px] font-bold text-gray-500 skill-item">/ {s}</li>)}
                   </ul>
                </section>
             )}
             {data.education.length > 0 && (
               <section>
                 <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: accentColor }}>Study</h2>
                 {data.education.map(edu => (
                   <div key={edu.id} className="mb-4">
                      <div className="font-bold text-[11px] text-gray-700">{edu.school}</div>
                      <div className="text-[10px] text-gray-400 italic">{edu.degree}</div>
                   </div>
                 ))}
               </section>
             )}
             {data.languages.length > 0 && (
               <section>
                 <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: accentColor }}>Speak</h2>
                 <div className="space-y-1 text-[10px] text-gray-500 font-bold uppercase">
                   {data.languages.map(l => <div key={l.id}>{l.name} / {l.level}</div>)}
                 </div>
               </section>
             )}
          </div>
       </div>
    </div>
  );
};

export default MinimalistTealTemplate;