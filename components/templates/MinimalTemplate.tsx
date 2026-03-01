import React from 'react';
import { TemplateProps } from './index';

const MinimalTemplate: React.FC<TemplateProps> = ({ data, isAdjusting = false, onAdjustGap }) => {
  const fontFamily = data.fontFamily || 'Poppins';

  // Font Size Logic
  const sizeMap = {
    small: { base: 'text-[10px]', section: 'text-[11px]', name: 'text-4xl' },
    medium: { base: 'text-[12px]', section: 'text-[12px]', name: 'text-5xl' },
    large: { base: 'text-[14px]', section: 'text-[14px]', name: 'text-6xl' },
  };
  const s = sizeMap[data.fontSize || 'medium'];

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
    <div className={`w-[21cm] min-h-[29.7cm] p-[1.5cm] text-gray-800 ${s.base}`} style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <header className="mb-8">
        <h1 className={`${s.name} font-light text-gray-900 mb-3`}>
          {data.firstName || 'First'} <span className="font-bold">{data.lastName || 'Last'}</span>
        </h1>
        <p className="text-xl text-gray-500 mb-4">{data.jobTitle || 'Job Title'}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-gray-600 border-t border-gray-100 pt-4">
           {data.email && <span className="font-mono tracking-wide">{data.email}</span>}
           {data.phone && <span className="font-mono tracking-wide">{data.phone}</span>}
           {data.city && <span className="font-mono tracking-wide">{data.city}</span>}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {data.skills.length > 0 && (
           <section style={{ marginTop: `${data.customGaps['skills-top'] !== undefined ? data.customGaps['skills-top'] : 20}px` }}>
              <GapHandle id="skills-top" />
              <h2 className={`section-header ${s.section} font-bold text-gray-400 uppercase tracking-widest mb-3`}>Expertise</h2>
              <div className="flex flex-wrap gap-3">
                 {data.skills.map(skill => (
                    <span key={skill} className="font-medium text-gray-800 border-b-2 border-transparent hover:border-gray-900 transition-all cursor-default skill-item">
                       {skill}
                    </span>
                 ))}
              </div>
           </section>
        )}

        {data.experience.length > 0 && (
          <section style={{ marginTop: `${data.customGaps['experience-top'] !== undefined ? data.customGaps['experience-top'] : 20}px` }}>
             <GapHandle id="experience-top" />
             <h2 className={`section-header ${s.section} font-bold text-gray-400 uppercase tracking-widest mb-4`}>Experience</h2>
             <div className="space-y-6 border-l-2 border-gray-100 pl-6 ml-1">
                {data.experience.map((exp, idx) => (
                   <div key={exp.id} className="relative" style={{ marginTop: idx > 0 ? `${data.customGaps[`exp-${exp.id}-top`] !== undefined ? data.customGaps[`exp-${exp.id}-top`] : 20}px` : 0 }}>
                      {idx > 0 && <GapHandle id={`exp-${exp.id}-top`} />}
                      <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-gray-200 rounded-full border-2 border-white"></div>
                      <div className="job-header">
                        <h3 className="text-lg font-bold text-gray-900">{exp.jobTitle}</h3>
                        <div className="text-gray-500 mb-1">{exp.employer}</div>
                      </div>
                      <div className="text-gray-600 leading-relaxed mb-1">
                         {exp.description.split('\n').map((line, i) => {
                            const cleanLine = line.replace(/^[\u2022\u25CF\u00B7\-\*]\s*/, '').trim();
                            return cleanLine && <div key={i} className="description-line mb-1">{cleanLine}</div>;
                         })}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mb-2">{exp.startDate} — {exp.endDate}</div>
                   </div>
                ))}
             </div>
          </section>
        )}

        {data.projects && data.projects.length > 0 && (
          <section style={{ marginTop: `${data.customGaps['projects-top'] !== undefined ? data.customGaps['projects-top'] : 20}px` }}>
             <GapHandle id="projects-top" />
             <h2 className={`section-header ${s.section} font-bold text-gray-400 uppercase tracking-widest mb-4`}>Key Projects</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.projects.map(proj => (
                   <div key={proj.id} className="bg-gray-50 p-4 rounded">
                      <h3 className="job-header font-bold text-gray-900 text-sm mb-1">{proj.title}</h3>
                      <div className="text-gray-600 leading-relaxed mb-2">
                         {proj.description.split('\n').map((line, i) => {
                            const cleanLine = line.replace(/^[\u2022\u25CF\u00B7\-\*]\s*/, '').trim();
                            return cleanLine && <div key={i} className="description-line mb-0.5">{cleanLine}</div>;
                         })}
                      </div>
                      {proj.technologies && proj.technologies.length > 0 && (
                         <div className="flex flex-wrap gap-1">
                            {proj.technologies.map((t, i) => (
                               <span key={i} className="skill-item text-[9px] bg-white px-1 py-0.5 rounded text-gray-500 border border-gray-100">{t}</span>
                            ))}
                         </div>
                      )}
                   </div>
                ))}
             </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
           <div className="space-y-8">
              {data.summary && (
                <section style={{ marginTop: `${data.customGaps['summary-top'] !== undefined ? data.customGaps['summary-top'] : 20}px` }}>
                    <GapHandle id="summary-top" />
                    <h2 className={`section-header ${s.section} font-bold text-gray-400 uppercase tracking-widest mb-3`}>About</h2>
                    <div className="text-gray-600 leading-relaxed text-justify">
                        {data.summary.split('\n').map((line, i) => {
                            const cleanLine = line.replace(/^[\u2022\u25CF\u00B7\-\*]\s*/, '').trim();
                            return cleanLine && <div key={i} className="description-line mb-1">{cleanLine}</div>;
                        })}
                    </div>
                </section>
              )}

              {data.languages && data.languages.length > 0 && (
                <section>
                   <h2 className={`section-header ${s.section} font-bold text-gray-400 uppercase tracking-widest mb-3`}>Languages</h2>
                   <div className="space-y-1">
                      {data.languages.map(l => (
                        <div key={l.id} className="text-xs text-gray-600 flex justify-between">
                           <span className="font-bold">{l.name}</span>
                           <span className="italic">{l.level}</span>
                        </div>
                      ))}
                   </div>
                </section>
              )}
           </div>

           <div className="space-y-8">
              {data.education.length > 0 && (
                <section style={{ marginTop: `${data.customGaps['education-top'] !== undefined ? data.customGaps['education-top'] : 20}px` }}>
                    <GapHandle id="education-top" />
                    <h2 className={`section-header ${s.section} font-bold text-gray-400 uppercase tracking-widest mb-3`}>Education</h2>
                    <div className="space-y-3">
                        {data.education.map(edu => (
                          <div key={edu.id} className="job-header">
                              <div className="font-bold text-gray-900">{edu.school}</div>
                              <div className="text-gray-600 text-xs">{edu.degree}</div>
                              <div className="text-[10px] text-gray-400 mt-1">{edu.startDate} - {edu.endDate}</div>
                          </div>
                        ))}
                    </div>
                </section>
              )}

              {data.certifications && data.certifications.length > 0 && (
                <section>
                   <h2 className={`section-header ${s.section} font-bold text-gray-400 uppercase tracking-widest mb-3`}>Awards</h2>
                   <div className="space-y-2">
                     {data.certifications.map(cert => (
                       <div key={cert.id} className="text-[11px] text-gray-600">
                         <div className="font-bold text-gray-800">{cert.name}</div>
                         <div>{cert.issuer} • {cert.date}</div>
                       </div>
                     ))}
                   </div>
                </section>
              )}
           </div>
        </div>

        {data.customSections?.map((section) => (
          <section key={section.id} style={{ marginTop: `${data.customGaps[`custom-${section.id}-top`] !== undefined ? data.customGaps[`custom-${section.id}-top`] : 20}px` }}>
            <GapHandle id={`custom-${section.id}-top`} />
            <h2 className={`section-header ${s.section} font-bold text-gray-400 uppercase tracking-widest mb-3`}>{section.title}</h2>
            {section.type === 'list' ? (
              <ul className="list-disc list-outside ml-6 space-y-1 text-gray-600 leading-relaxed">
                 {section.content.split('\n').filter(l => l.trim()).map((line, i) => {
                    const cleanLine = line.replace(/^[\u2022\u25CF\u00B7\-\*]\s*/, '').trim();
                    return cleanLine && <li key={i} className="description-line">{cleanLine}</li>;
                 })}
              </ul>
            ) : (
              <div className="text-gray-600 leading-relaxed text-justify whitespace-pre-line text-sm">
                 {section.content}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default MinimalTemplate;