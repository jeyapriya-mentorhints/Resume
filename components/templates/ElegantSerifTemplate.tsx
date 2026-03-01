import React from 'react';
import { TemplateProps } from './index';
import { Icons } from '../ui/Icons';

const ElegantSerifTemplate: React.FC<TemplateProps> = ({ data, isAdjusting = false, onAdjustGap }) => {
  const fullName = `${data.firstName} ${data.lastName}`;
  const nameSizeClass = fullName.length > 18 ? 'text-5xl leading-tight' : 'text-6xl';
  const accentColor = data.accentColor || '#8a9a8b';
  const headerColor = data.accentColor || '#4a5d4b';
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
    <div className="bg-white w-[21cm] min-h-[29.7cm] flex flex-col" style={{ fontFamily: `'${fontFamily}', serif` }}>
      <div className="flex h-[8cm] shrink-0">
         <div className="w-[8cm] h-full relative overflow-hidden flex items-center justify-center text-white/30 text-6xl" style={{ backgroundColor: accentColor }}>
             {data.firstName?.[0]}
         </div>
         <div className="flex-1 bg-[#e8e8e3] flex flex-col justify-center px-12">
             <h1 className={`${nameSizeClass} font-bold mb-2 leading-tight break-words`} style={{ color: headerColor }}>
                {data.firstName}<br/>{data.lastName}
             </h1>
             <p className="text-xl tracking-[0.2em] uppercase text-gray-500">
                {data.jobTitle}
             </p>
         </div>
      </div>

      <div className="flex flex-1">
         <div className="w-[8cm] text-white p-8 space-y-10" style={{ backgroundColor: accentColor }}>
            {data.summary && (
              <section style={{ marginTop: `${data.customGaps['summary-top'] !== undefined ? data.customGaps['summary-top'] : 20}px` }}>
                 <GapHandle id="summary-top" />
                 <h2 className="section-header text-2xl font-bold uppercase tracking-widest mb-4 border-b border-white/30 pb-2">Profile</h2>
                 {data.summaryType === 'list' ? (
                   <ul className="list-disc list-outside ml-4 text-sm text-white/90 space-y-1">
                      {data.summary.split('\n').filter(l => l.trim()).map((line, i) => {
                         const cleanLine = line.replace(/^[\u2022\u25CF\u00B7\-\*]\s*/, '').trim();
                         return cleanLine && <li key={i} className="description-line">{cleanLine}</li>;
                      })}
                   </ul>
                 ) : (
                   <div className="text-sm leading-relaxed text-white/90 text-justify whitespace-pre-line">
                      {data.summary}
                   </div>
                 )}
              </section>
            )}

            {data.skills.length > 0 && (
               <section style={{ marginTop: `${data.customGaps['skills-top'] !== undefined ? data.customGaps['skills-top'] : 20}px` }}>
                  <GapHandle id="skills-top" />
                  <h2 className="section-header text-2xl font-bold uppercase tracking-widest mb-4 border-b border-white/30 pb-2 text-white">Skills</h2>
                  <ul className="space-y-2 text-sm text-white/90">
                     {data.skills.map((skill, i) => (
                        <li key={i} className="skill-item flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-white rounded-full"></span> {skill}
                        </li>
                     ))}
                  </ul>
               </section>
            )}

            {data.certifications && data.certifications.length > 0 && (
              <section>
                 <h2 className="section-header text-2xl font-bold uppercase tracking-widest mb-4 border-b border-white/30 pb-2">Awards</h2>
                 <div className="space-y-4 text-sm text-white/90">
                    {data.certifications.map(cert => (
                      <div key={cert.id}>
                        <div className="font-bold">{cert.name}</div>
                        <div className="text-xs opacity-75">{cert.issuer} | {cert.date}</div>
                      </div>
                    ))}
                 </div>
              </section>
            )}

            <div className="pt-10 space-y-3 text-sm font-sans text-white/90">
               {data.phone && <div className="flex items-center gap-2"><Icons.Phone size={14}/> {data.phone}</div>}
               {data.email && <div className="flex items-center gap-2 break-all"><Icons.Mail size={14}/> {data.email}</div>}
            </div>
         </div>

         <div className="flex-1 bg-[#fcfcfc] p-10 space-y-10">
            {data.experience.length > 0 && (
               <section style={{ marginTop: `${data.customGaps['experience-top'] !== undefined ? data.customGaps['experience-top'] : 20}px` }}>
                  <GapHandle id="experience-top" />
                  <h2 className="section-header text-2xl font-bold text-[#6b706b] uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">
                     Work Experience
                  </h2>
                  <div className="space-y-8">
                     {data.experience.map((exp, idx) => (
                        <div key={exp.id} className="group/item" style={{ marginTop: idx > 0 ? `${data.customGaps[`exp-${exp.id}-top`] !== undefined ? data.customGaps[`exp-${exp.id}-top`] : 20}px` : 0 }}>
                           {idx > 0 && <GapHandle id={`exp-${exp.id}-top`} />}
                           <div className="job-header">
                              <h3 className="text-xl font-bold" style={{ color: headerColor }}>{exp.jobTitle}</h3>
                              <div className="text-sm text-gray-500 italic mb-2">
                                 {exp.employer} | {exp.startDate} - {exp.endDate}
                              </div>
                           </div>
                           {exp.descriptionType === 'paragraph' ? (
                             <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                               {exp.description}
                             </p>
                           ) : (
                             <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed space-y-1">
                                {exp.description.split('\n').map((line, i) => {
                                   const cleanLine = line.replace(/^[\u2022\u25CF\u00B7\-\*]\s*/, '').trim();
                                   return cleanLine && <li key={i} className="description-line">{cleanLine}</li>;
                                })}
                             </ul>
                           )}
                        </div>
                     ))}
                  </div>
               </section>
            )}

            {data.projects && data.projects.length > 0 && (
               <section style={{ marginTop: `${data.customGaps['projects-top'] || 20}px` }}>
                  <GapHandle id="projects-top" />
                  <h2 className="section-header text-2xl font-bold text-[#6b706b] uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">
                     Projects
                  </h2>
                  <div className="space-y-6">
                    {data.projects.map(proj => (
                      <div key={proj.id}>
                        <h3 className="text-lg font-bold text-gray-800">{proj.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
               </section>
            )}

            {data.education.length > 0 && (
               <section style={{ marginTop: `${data.customGaps['education-top'] !== undefined ? data.customGaps['education-top'] : 20}px` }}>
                  <GapHandle id="education-top" />
                  <h2 className="section-header text-2xl font-bold text-[#6b706b] uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">
                     Education
                  </h2>
                  <div className="space-y-6">
                     {data.education.map(edu => (
                        <div key={edu.id}>
                           <div className="job-header">
                              <h3 className="text-lg font-bold text-gray-700">{edu.school}</h3>
                              <div className="text-sm text-gray-500 italic mb-1">{edu.degree} | {edu.startDate} - {edu.endDate}</div>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>
            )}

            {data.customSections?.map(section => (
               <section key={section.id} style={{ marginTop: `${data.customGaps[`custom-${section.id}`] || 20}px` }}>
                  <h2 className="section-header text-2xl font-bold text-[#6b706b] uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">
                     {section.title}
                  </h2>
                  <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
               </section>
            ))}
         </div>
      </div>
    </div>
  );
};

export default ElegantSerifTemplate;