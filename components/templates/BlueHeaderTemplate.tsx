import React from 'react';
import { TemplateProps } from './index';

const BlueHeaderTemplate: React.FC<TemplateProps> = ({ data, isAdjusting = false, onAdjustGap }) => {
  const accentColor = data.accentColor || '#1e3a8a';
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
    <div className="bg-white w-[21cm] min-h-[29.7cm] flex flex-col" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <header className="p-12 text-white flex justify-between items-center" style={{ backgroundColor: accentColor }}>
         <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-1">{data.firstName} {data.lastName}</h1>
            <p className="text-xl font-medium tracking-[0.2em] text-white/70 uppercase">{data.jobTitle}</p>
         </div>
         <div className="text-right text-xs font-bold space-y-1">
            <div>{data.phone}</div>
            <div className="break-all">{data.email}</div>
            <div>{data.city}, {data.country}</div>
         </div>
      </header>
      <div className="flex-1 p-12 grid grid-cols-12 gap-10">
         <div className="col-span-8 space-y-10">
            {data.experience.length > 0 && (
               <section>
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8 section-header">Work History</h2>
                  <div className="space-y-8">
                     {data.experience.map(exp => (
                        <div key={exp.id}>
                           <div className="flex justify-between items-baseline mb-2">
                              <h3 className="font-bold text-gray-800 text-lg">{exp.jobTitle}</h3>
                              <span className="text-[10px] font-bold text-gray-400">{exp.startDate} - {exp.endDate}</span>
                           </div>
                           <div className="text-sm font-bold mb-3" style={{ color: accentColor }}>{exp.employer}</div>
                           {/* <p className="text-sm text-gray-600 leading-relaxed text-justify">{exp.description}</p> */}
                           {exp.description
                        .split('\n')
                        .filter(Boolean)
                        .map((line, i) => (
                          <p
                            key={i}
                            className="description-line text-xs text-gray-600 leading-relaxed"
                          >
                            {line}
                          </p>
                      ))}
                        </div>
                     ))}
                  </div>
               </section>
            )}
            {data.projects && data.projects.length > 0 && (
              <section>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6 section-header">Deliverables</h2>
                <div className="grid grid-cols-2 gap-6">
                  {data.projects.map(p => (
                    <div key={p.id}>
                      <div className="font-bold text-sm text-gray-800">{p.title}</div>
                      {/* <p className="text-xs text-gray-500 mt-1">{p.description}</p> */}
                      {p.description
                      .split('\n')
                      .filter(Boolean)
                      .map((line, i) => (
                        <p
                          key={i}
                          className="description-line text-xs text-gray-600 mt-1 leading-relaxed"
                        >
                          {line}
                        </p>
                    ))}
                    </div>
                  ))}
                </div>
              </section>
            )}
         </div>
         <div className="col-span-4 space-y-10">
            {data.summary && (
              <section>
                 <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Profile</h2>
                 {/* <p className="text-xs leading-loose text-gray-500 italic">{data.summary}</p> */}
                  {data.summary
  .split('\n')
  .filter(Boolean)
  .map((line, i) => (
    <p
      key={i}
      className="description-line text-xs text-gray-600 leading-relaxed"
    >
      {line}
    </p>
))}
              </section>
            )}
            {data.skills.length > 0 && (
              <section>
                 <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Competencies</h2>
                 <ul className="space-y-2">
                   {data.skills.map(s => <li key={s} className="text-xs text-gray-600 font-bold uppercase tracking-wider skill-item">• {s}</li>)}
                 </ul>
              </section>
            )}
            {data.education.length > 0 && (
              <section>
                 <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Education</h2>
                 {data.education.map(edu => (
                   <div key={edu.id} className="mb-4">
                      <div className="font-bold text-xs text-gray-800">{edu.school}</div>
                      <div className="text-[10px] text-gray-400 uppercase">{edu.degree}</div>
                   </div>
                 ))}
              </section>
            )}
            {data.certifications.length > 0 && (
              <section>
                 <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Certs</h2>
                 <div className="space-y-2 text-[10px] text-gray-500 font-bold uppercase">
                   {data.certifications.map(c => <div key={c.id}>{c.name}</div>)}
                 </div>
              </section>
            )}
         </div>
      </div>
    </div>
  );
};

export default BlueHeaderTemplate;