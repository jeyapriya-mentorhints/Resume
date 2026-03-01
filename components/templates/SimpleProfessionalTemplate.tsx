import React from 'react';
import { TemplateProps } from './index';

const SimpleProfessionalTemplate: React.FC<TemplateProps> = ({ data, isAdjusting = false, onAdjustGap }) => {
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
    <div className="bg-white w-[21cm] min-h-[29.7cm] p-8 text-gray-900" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 uppercase mb-1 tracking-wider">
          {data.firstName} {data.lastName}
        </h1>
        <p className="text-lg text-gray-600 mb-3 font-light uppercase tracking-wide">
          {data.jobTitle}
        </p>
        <div className="flex justify-center items-center gap-4 text-xs text-gray-500 border-t border-b border-gray-200 py-2">
           {data.phone && <div className="flex items-center gap-1"><span>📞</span> {data.phone}</div>}
           {data.email && <div className="flex items-center gap-1"><span>✉️</span> {data.email}</div>}
           {(data.city || data.country) && <div className="flex items-center gap-1"><span>📍</span> {data.city}, {data.country}</div>}
        </div>
      </header>

      <div className="space-y-6">
        {data.summary && (
          <section style={{ marginTop: `${data.customGaps['summary-top'] !== undefined ? data.customGaps['summary-top'] : 20}px` }}>
            <GapHandle id="summary-top" />
            <h2 className="section-header text-sm font-bold text-gray-800 uppercase tracking-widest mb-2">About Me</h2>
            {data.summaryType === 'list' ? (
              <ul className="list-disc list-inside text-xs text-gray-600 leading-relaxed text-justify space-y-1">
                 {data.summary.split('\n').filter(l => l.trim()).map((line, i) => {
                    const cleanLine = line.replace(/^[\u2022\u25CF\u00B7\-\*]\s*/, '').trim();
                    return cleanLine && <li key={i} className="description-line">{cleanLine}</li>;
                 })}
              </ul>
            ) : (
              <div className="text-xs leading-loose text-gray-600 text-justify whitespace-pre-line">
                 {data.summary}
              </div>
            )}
          </section>
        )}

        {data.experience.length > 0 && (
          <section style={{ marginTop: `${data.customGaps['experience-top'] !== undefined ? data.customGaps['experience-top'] : 20}px` }}>
            <GapHandle id="experience-top" />
            <h2 className="section-header text-sm font-bold text-gray-800 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">Work Experience</h2>
            <div className="space-y-4">
              {data.experience.map((exp, idx) => (
                <div key={exp.id} style={{ marginTop: idx > 0 ? `${data.customGaps[`exp-${exp.id}-top`] !== undefined ? data.customGaps[`exp-${exp.id}-top`] : 20}px` : 0 }}>
                  {idx > 0 && <GapHandle id={`exp-${exp.id}-top`} />}
                  <div className="job-header">
                    <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className="text-sm text-gray-500 font-bold uppercase">
                        {exp.employer} <span className="font-normal normal-case text-gray-400">| {exp.location}</span>
                        </h3>
                        <span className="text-xs text-gray-400">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-md font-bold text-gray-900 mb-1">{exp.jobTitle}</div>
                  </div>
                  {exp.descriptionType === 'paragraph' ? (
                    <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  ) : (
                    <ul className="list-disc list-inside text-xs text-gray-600 leading-relaxed text-justify space-y-1">
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
           <section style={{ marginTop: `${data.customGaps['projects-top'] !== undefined ? data.customGaps['projects-top'] : 20}px` }}>
            <GapHandle id="projects-top" />
            <h2 className="section-header text-sm font-bold text-gray-800 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">Projects</h2>
            <div className="grid grid-cols-1 gap-4">
               {data.projects.map((proj) => (
                  <div key={proj.id}>
                     <div className="job-header flex justify-between items-baseline">
                        <h3 className="font-bold text-gray-900 text-sm">{proj.title}</h3>
                        {proj.link && <span className="text-[10px] text-blue-600">{proj.link}</span>}
                     </div>
                     {proj.descriptionType === 'paragraph' ? (
                       <div className="text-xs text-gray-600 mt-1 whitespace-pre-line">
                         {proj.description}
                       </div>
                     ) : (
                       <ul className="list-disc list-inside text-xs text-gray-600 mt-1 space-y-0.5">
                         {proj.description.split('\n').map((line, i) => {
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

        <div className="grid grid-cols-2 gap-10">
           <div className="space-y-6">
              {data.education.length > 0 && (
                <section style={{ marginTop: `${data.customGaps['education-top'] !== undefined ? data.customGaps['education-top'] : 20}px` }}>
                    <GapHandle id="education-top" />
                    <h2 className="section-header text-sm font-bold text-gray-800 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">Education</h2>
                    <div className="space-y-3">
                    {data.education.map((edu) => (
                        <div key={edu.id} className="job-header">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-gray-900 font-bold text-sm">{edu.degree}</h3>
                            <span className="text-gray-500 text-xs">{edu.startDate} - {edu.endDate}</span>
                        </div>
                        <div className="text-xs text-gray-600">{edu.school}</div>
                        </div>
                    ))}
                    </div>
                </section>
              )}

              {data.languages && data.languages.length > 0 && (
                <section>
                   <h2 className="section-header text-sm font-bold text-gray-800 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">Languages</h2>
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

           <div className="space-y-6">
              {data.skills.length > 0 && (
                <section style={{ marginTop: `${data.customGaps['skills-top'] !== undefined ? data.customGaps['skills-top'] : 20}px` }}>
                    <GapHandle id="skills-top" />
                    <h2 className="section-header text-sm font-bold text-gray-800 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">Skills</h2>
                    <ul className="space-y-1 list-disc list-inside text-xs text-gray-700">
                    {data.skills.map((skill) => (
                        <li key={skill} className="skill-item">{skill}</li>
                    ))}
                    </ul>
                </section>
              )}

              {data.certifications && data.certifications.length > 0 && (
                 <section>
                    <h2 className="section-header text-sm font-bold text-gray-800 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">Certifications</h2>
                    <div className="space-y-2">
                       {data.certifications.map(cert => (
                         <div key={cert.id} className="text-xs text-gray-600">
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
            <h2 className="section-header text-sm font-bold text-gray-800 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">{section.title}</h2>
            {section.type === 'list' ? (
              <ul className="list-disc list-inside text-xs text-gray-600 leading-relaxed text-justify space-y-1">
                 {section.content.split('\n').filter(l => l.trim()).map((line, i) => {
                    const cleanLine = line.replace(/^[\u2022\u25CF\u00B7\-\*]\s*/, '').trim();
                    return cleanLine && <li key={i} className="description-line">{cleanLine}</li>;
                 })}
              </ul>
            ) : (
              <div className="text-xs leading-loose text-gray-600 text-justify whitespace-pre-line">
                 {section.content}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default SimpleProfessionalTemplate;