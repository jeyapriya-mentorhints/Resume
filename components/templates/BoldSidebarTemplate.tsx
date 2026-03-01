import React from 'react';
import { TemplateProps } from './index';

const BoldSidebarTemplate: React.FC<TemplateProps> = ({ data, isAdjusting = false, onAdjustGap }) => {
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
    <div className="bg-white w-[21cm] min-h-[29.7cm] flex" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
       <div className="w-[7.5cm] flex flex-col min-h-full" style={{ backgroundColor: accentColor }}>
          <div className="text-white p-8 pb-12">
             <h1 className="text-4xl font-bold uppercase mb-2 leading-tight">{data.firstName}<br/>{data.lastName}</h1>
             <p className="text-sm font-medium uppercase tracking-widest text-white/70">{data.jobTitle}</p>
          </div>
          <div className="p-8 space-y-10 text-white/90">
             <section>
                <h2 className="text-lg font-bold border-b border-white/20 pb-2 mb-4 uppercase">Contact</h2>
                <div className="text-xs space-y-2">
                   <div>{data.phone}</div>
                   <div className="break-all">{data.email}</div>
                   <div>{data.city}, {data.country}</div>
                </div>
             </section>
             {data.skills.length > 0 && (
                <section>
                   <h2 className="text-lg font-bold border-b border-white/20 pb-2 mb-4 uppercase">Skills</h2>
                   <div className="flex flex-wrap gap-2">
                      {data.skills.map(s => <span key={s} className="px-2 py-1 bg-white/10 rounded text-[10px]">{s}</span>)}
                   </div>
                </section>
             )}
             {data.languages.length > 0 && (
               <section>
                 <h2 className="text-lg font-bold border-b border-white/20 pb-2 mb-4 uppercase">Languages</h2>
                 <div className="space-y-2 text-xs">
                   {data.languages.map(l => <div key={l.id} className="flex justify-between"><span>{l.name}</span><span className="opacity-60">{l.level}</span></div>)}
                 </div>
               </section>
             )}
          </div>
       </div>
       <div className="flex-1 p-10 bg-white">
          {data.summary && (
            <section className="mb-10">
               <h2 className="text-xl font-bold uppercase mb-4 section-header" style={{ color: accentColor }}>Profile</h2>
               {/* <p className="text-sm text-gray-600 leading-relaxed text-justify whitespace-pre-line">{data.summary}</p> */}
               {data.summary
  .split('\n')
  .filter(Boolean)
  .map((line, i) => (
    <p
      key={i}
      className="description-line text-sm text-gray-600 leading-relaxed text-justify"
    >
      {line}
    </p>
))}

            </section>
          )}
          {data.experience.length > 0 && (
            <section className="mb-10">
               <h2 className="text-xl font-bold uppercase mb-6 section-header" style={{ color: accentColor }}>Experience</h2>
               <div className="space-y-8">
                  {data.experience.map(exp => (
                    <div key={exp.id}>
                       <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-bold text-gray-800">{exp.jobTitle}</h3>
                          <span className="text-xs text-gray-400">{exp.startDate} - {exp.endDate}</span>
                       </div>
                       <div className="text-sm font-bold text-gray-500 mb-2">{exp.employer}</div>
                       {/* <p className="text-xs text-gray-600 leading-relaxed">{exp.description}</p> */}
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
            <section className="mb-10">
               <h2 className="text-xl font-bold uppercase mb-4 section-header" style={{ color: accentColor }}>Key Projects</h2>
               <div className="space-y-6">
                 {data.projects.map(p => (
                   <div key={p.id}>
                     <div className="font-bold text-gray-800 text-sm">{p.title}</div>
                     {/* <p className="text-xs text-gray-600 mt-1">{p.description}</p> */}
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
          {data.education.length > 0 && (
            <section>
               <h2 className="text-xl font-bold uppercase mb-4 section-header" style={{ color: accentColor }}>Education</h2>
               <div className="space-y-4">
                  {data.education.map(edu => (
                    <div key={edu.id}>
                       <div className="font-bold text-gray-800 text-sm">{edu.school}</div>
                       <div className="text-xs text-gray-500">{edu.degree} | {edu.startDate} - {edu.endDate}</div>
                    </div>
                  ))}
               </div>
            </section>
          )}
       </div>
    </div>
  );
};

export default BoldSidebarTemplate;