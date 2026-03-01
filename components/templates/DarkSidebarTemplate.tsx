import React from 'react';
import { TemplateProps } from './index';

const DarkSidebarTemplate: React.FC<TemplateProps> = ({ data, isAdjusting = false, onAdjustGap }) => {
  const accentColor = data.accentColor || '#2c3e50';
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
       <div className="w-[7.5cm] text-white p-8 flex flex-col min-h-full" style={{ backgroundColor: accentColor }}>
          <div className="w-32 h-32 bg-gray-400 rounded-full mx-auto mb-10 overflow-hidden border-4 border-white/20 flex items-center justify-center text-4xl font-bold text-white/50">
            {data.firstName?.[0]}{data.lastName?.[0]}
          </div>
          <div className="space-y-10 flex-1">
             <section>
                <h2 className="text-xl font-bold border-b border-white/20 pb-2 mb-4">Contact</h2>
                <div className="space-y-3 text-sm text-gray-300">
                   <div><div className="font-bold text-white">Phone</div>{data.phone}</div>
                   <div><div className="font-bold text-white">Email</div><div className="break-all">{data.email}</div></div>
                </div>
             </section>
             {data.skills.length > 0 && (
                <section>
                   <h2 className="text-xl font-bold border-b border-white/20 pb-2 mb-4">Skills</h2>
                   <ul className="space-y-2 text-sm text-gray-300">
                      {data.skills.map(s => <li key={s} className="skill-item">• {s}</li>)}
                   </ul>
                </section>
             )}
             {data.languages.length > 0 && (
               <section>
                 <h2 className="text-xl font-bold border-b border-white/20 pb-2 mb-4">Languages</h2>
                 <div className="space-y-2 text-sm">
                   {data.languages.map(l => <div key={l.id} className="flex justify-between"><span>{l.name}</span><span className="opacity-50 italic">{l.level}</span></div>)}
                 </div>
               </section>
             )}
          </div>
       </div>
       <div className="flex-1 p-10 bg-white text-gray-800">
          <header className="mb-12">
             <h1 className="text-5xl font-bold mb-2" style={{ color: accentColor }}>{data.firstName} {data.lastName}</h1>
             <p className="text-2xl font-medium tracking-wide text-gray-400 uppercase">{data.jobTitle}</p>
          </header>
          {data.summary && (
             <section className="mb-10">
                <h2 className="text-2xl font-bold pb-2 mb-4 section-header" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>Profile</h2>
                <p className="text-sm leading-relaxed text-gray-600 text-justify whitespace-pre-line">{data.summary}</p>
             </section>
          )}
          {data.experience.length > 0 && (
             <section className="mb-10">
                <h2 className="text-2xl font-bold pb-2 mb-6 section-header" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>Experience</h2>
                <div className="space-y-8">
                   {data.experience.map(exp => (
                      <div key={exp.id} className="relative pl-6 border-l-2 border-gray-100">
                         <h3 className="text-lg font-bold text-gray-800">{exp.jobTitle}</h3>
                         <div className="text-md font-bold text-gray-500 mb-1">{exp.employer} | {exp.startDate} - {exp.endDate}</div>
                         <p className="text-sm text-gray-600">{exp.description}</p>
                      </div>
                   ))}
                </div>
             </section>
          )}
          {data.projects && data.projects.length > 0 && (
             <section className="mb-10">
                <h2 className="text-2xl font-bold pb-2 mb-6 section-header" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>Projects</h2>
                <div className="space-y-6">
                  {data.projects.map(p => (
                    <div key={p.id}>
                      <h3 className="font-bold text-gray-800">{p.title}</h3>
                      <p className="text-sm text-gray-600">{p.description}</p>
                    </div>
                  ))}
                </div>
             </section>
          )}
          {data.education.length > 0 && (
             <section>
                <h2 className="text-2xl font-bold pb-2 mb-6 section-header" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>Education</h2>
                <div className="space-y-4">
                   {data.education.map(edu => (
                      <div key={edu.id}>
                         <div className="font-bold text-gray-800">{edu.school}</div>
                         <div className="text-sm text-gray-500">{edu.degree} | {edu.startDate} - {edu.endDate}</div>
                      </div>
                   ))}
                </div>
             </section>
          )}
       </div>
    </div>
  );
};

export default DarkSidebarTemplate;