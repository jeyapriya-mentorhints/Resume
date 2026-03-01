import React from 'react';
import { TemplateProps } from './index';

const TechDesignTemplate: React.FC<TemplateProps> = ({ data, isAdjusting = false, onAdjustGap }) => {
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
    <div className="bg-white w-[21cm] min-h-[29.7cm] p-10 text-gray-800" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <header className="mb-10">
        <h1 className="text-5xl font-black text-[#111] uppercase mb-1 tracking-tighter">
          {data.firstName} {data.lastName}
        </h1>
        <p className="text-xl font-bold text-blue-600 uppercase mb-6 tracking-widest italic">{data.jobTitle}</p>
        <div className="text-[10px] text-gray-400 flex gap-6 font-mono uppercase tracking-widest border-t border-gray-100 pt-4">
           {data.phone && <span>{data.phone}</span>}
           {data.email && <span className="break-all">{data.email}</span>}
           {data.city && <span>{data.city}, {data.country}</span>}
        </div>
      </header>

      <div className="space-y-10">
        {data.summary && (
          <section>
            <div className="bg-black text-white px-4 py-1.5 inline-block mb-4 section-header transform -skew-x-12">
               <h2 className="text-xs font-bold uppercase tracking-widest transform skew-x-12">Mission</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-700 text-justify whitespace-pre-line">{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <div className="bg-black text-white px-4 py-1.5 inline-block mb-6 section-header transform -skew-x-12">
               <h2 className="text-xs font-bold uppercase tracking-widest transform skew-x-12">Operating History</h2>
            </div>
            <div className="space-y-8">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900 text-md">{exp.jobTitle}</h3>
                      <span className="text-[10px] font-bold text-blue-600">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase mb-2">{exp.employer}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-10">
           <section>
              <div className="bg-black text-white px-4 py-1.5 inline-block mb-4 section-header transform -skew-x-12">
                 <h2 className="text-xs font-bold uppercase tracking-widest transform skew-x-12">Stack</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                 {data.skills.map(s => <span key={s} className="px-2 py-1 bg-gray-100 text-[10px] font-bold rounded skill-item">{s}</span>)}
              </div>
           </section>
           <section>
              <div className="bg-black text-white px-4 py-1.5 inline-block mb-4 section-header transform -skew-x-12">
                 <h2 className="text-xs font-bold uppercase tracking-widest transform skew-x-12">Education</h2>
              </div>
              <div className="space-y-4">
                 {data.education.map(edu => (
                    <div key={edu.id}>
                       <div className="font-bold text-xs">{edu.school}</div>
                       <div className="text-[10px] text-gray-500">{edu.degree}</div>
                    </div>
                 ))}
              </div>
           </section>
        </div>

        {(data.projects.length > 0 || data.certifications.length > 0) && (
          <div className="grid grid-cols-2 gap-10">
             {data.projects.length > 0 && (
               <section>
                  <div className="bg-black text-white px-4 py-1.5 inline-block mb-4 section-header transform -skew-x-12">
                    <h2 className="text-xs font-bold uppercase tracking-widest transform skew-x-12">Builds</h2>
                  </div>
                  <div className="space-y-2">
                    {data.projects.map(p => <div key={p.id} className="text-xs"><span className="font-bold">{p.title}:</span> {p.description}</div>)}
                  </div>
               </section>
             )}
             {data.certifications.length > 0 && (
               <section>
                  <div className="bg-black text-white px-4 py-1.5 inline-block mb-4 section-header transform -skew-x-12">
                    <h2 className="text-xs font-bold uppercase tracking-widest transform skew-x-12">Certs</h2>
                  </div>
                  <div className="space-y-2 text-xs text-gray-600">
                    {data.certifications.map(c => <div key={c.id}>• {c.name}</div>)}
                  </div>
               </section>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechDesignTemplate;