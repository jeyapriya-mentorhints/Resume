import React from 'react';
import { TemplateProps } from './index';

const ClassicTemplate: React.FC<TemplateProps> = ({ data, isAdjusting = false, onAdjustGap }) => {
  const fontFamily = data.fontFamily || 'Poppins';

  // Font Size Logic
  const sizeMap = {
    small: { base: 'text-[11px]', section: 'text-xs', name: 'text-3xl' },
    medium: { base: 'text-[13px]', section: 'text-sm', name: 'text-4xl' },
    large: { base: 'text-[15px]', section: 'text-md', name: 'text-5xl' },
  };
  const s = sizeMap[data.fontSize || 'medium'];

  const GapHandle = ({ id }: { id: string }) => {
    if (!isAdjusting || !onAdjustGap) return null;
    const currentGap = data.customGaps[id] !== undefined ? data.customGaps[id] : 20;

    return (
      <div className="no-print relative h-0 w-full group/handle z-50">
        <div className="absolute inset-x-0 -top-2 flex justify-center opacity-0 group-hover/handle:opacity-100 transition-opacity">
          <div className="bg-navy-700 text-white rounded-full shadow-lg flex overflow-hidden border border-white">
            <button 
              onClick={(e) => { e.stopPropagation(); onAdjustGap(id, -5); }} 
              className="px-2 py-1 hover:bg-navy-800 border-r border-navy-500 text-[10px] font-bold"
            >
              -
            </button>
            <div className="px-2 py-1 text-[10px] font-bold bg-navy-50 text-navy-900 min-w-[30px] text-center">
              {currentGap}px
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onAdjustGap(id, 5); }} 
              className="px-2 py-1 hover:bg-navy-800 text-[10px] font-bold"
            >
              +
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 -top-[1px] border-t border-dashed border-navy-300 opacity-20 group-hover/handle:opacity-100 transition-opacity" />
      </div>
    );
  };

  return (
    <div className={`bg-white w-[21cm] min-h-[29.7cm] p-[1.5cm] text-gray-900 ${s.base}`} style={{ fontFamily: `'${fontFamily}', serif` }}>
      <header className="text-center border-b border-gray-900 pb-4 mb-6">
        <h1 className={`${s.name} font-bold text-gray-900 mb-2 uppercase tracking-widest`}>
          {data.firstName || 'First Name'} {data.lastName || 'Last Name'}
        </h1>
        <div className="flex justify-center gap-3 text-xs text-gray-600 italic mb-2">
           <span>{data.city}, {data.country}</span>
           <span>•</span>
           <span>{data.email}</span>
           <span>•</span>
           <span>{data.phone}</span>
        </div>
        <p className="text-lg font-semibold text-gray-800 mt-2">
          {data.jobTitle || 'Job Title'}
        </p>
      </header>

      <div className="space-y-5">
        {data.summary && (
          <section style={{ marginTop: `${data.customGaps['summary-top'] !== undefined ? data.customGaps['summary-top'] : 20}px` }}>
            <GapHandle id="summary-top" />
            <h2 className={`section-header ${s.section} font-bold text-gray-900 uppercase border-b border-gray-300 mb-3`}>
              Professional Profile
            </h2>
            {data.summaryType === 'list' ? (
              <ul className="list-disc list-outside ml-5 space-y-1">
                 {data.summary.split('\n').filter(l => l.trim()).map((line, i) => {
                    const cleanLine = line.replace(/^[\u2022\u25CF\u00B7\-\*]\s*/, '').trim();
                    return cleanLine && <li key={i} className="description-line">{cleanLine}</li>;
                 })}
              </ul>
            ) : (
              <div className="leading-relaxed text-justify whitespace-pre-line text-sm">
                 {data.summary}
              </div>
            )}
          </section>
        )}

        {data.experience.length > 0 && (
          <section style={{ marginTop: `${data.customGaps['experience-top'] !== undefined ? data.customGaps['experience-top'] : 20}px` }}>
            <GapHandle id="experience-top" />
            <h2 className={`section-header ${s.section} font-bold text-gray-900 uppercase border-b border-gray-300 mb-3`}>
              Work Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, idx) => (
                <div key={exp.id} className="relative" style={{ marginTop: idx > 0 ? `${data.customGaps[`exp-${exp.id}-top`] !== undefined ? data.customGaps[`exp-${exp.id}-top`] : 20}px` : 0 }}>
                  {idx > 0 && <GapHandle id={`exp-${exp.id}-top`} />}
                  <div className="job-header">
                    <div className="flex justify-between font-bold text-gray-900 mb-1">
                        <h3>{exp.employer}, {exp.location}</h3>
                        <span className="text-xs italic">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <div className="text-xs font-semibold italic mb-1">{exp.jobTitle}</div>
                  </div>
                  {exp.descriptionType === 'paragraph' ? (
                    <p className="text-gray-800 text-justify whitespace-pre-line text-sm">
                      {exp.description}
                    </p>
                  ) : (
                    <ul className="list-disc list-outside ml-5 text-gray-800 text-justify space-y-1">
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
            <h2 className={`section-header ${s.section} font-bold text-gray-900 uppercase border-b border-gray-300 mb-3`}>
              Projects
            </h2>
            <div className="space-y-4">
               {data.projects.map(proj => (
                  <div key={proj.id}>
                     <div className="job-header">
                        <div className="flex justify-between font-bold text-gray-900 mb-1">
                            <h3>{proj.title}</h3>
                            {proj.link && <span className="text-xs font-normal italic">{proj.link}</span>}
                        </div>
                     </div>
                     <div className="text-gray-800 mb-1">
                        {proj.descriptionType === 'paragraph' ? (
                          <p className="whitespace-pre-line text-sm">{proj.description}</p>
                        ) : (
                          <ul className="list-disc list-outside ml-5 space-y-1">
                             {proj.description.split('\n').map((line, i) => {
                                const cleanLine = line.replace(/^[\u2022\u25CF\u00B7\-\*]\s*/, '').trim();
                                return cleanLine && <li key={i} className="description-line">{cleanLine}</li>;
                             })}
                          </ul>
                        )}
                     </div>
                     {proj.technologies && proj.technologies.length > 0 && (
                       <div className="description-line text-[10px] text-gray-600 italic">Technology: {proj.technologies.join(', ')}</div>
                     )}
                  </div>
               ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
           <div className="space-y-5">
              {data.education.length > 0 && (
                <section style={{ marginTop: `${data.customGaps['education-top'] !== undefined ? data.customGaps['education-top'] : 20}px` }}>
                  <GapHandle id="education-top" />
                  <h2 className={`section-header ${s.section} font-bold text-gray-900 uppercase border-b border-gray-300 mb-3`}>
                    Education
                  </h2>
                  <div className="space-y-3">
                    {data.education.map((edu) => (
                      <div key={edu.id} className="job-header">
                        <div className="font-bold text-gray-900 text-sm">{edu.school}</div>
                        <div className="text-xs italic text-gray-600 mb-0.5">{edu.startDate} – {edu.endDate}</div>
                        <div className="text-xs text-gray-700">
                          {edu.degree} in {edu.fieldOfStudy}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {data.languages && data.languages.length > 0 && (
                 <section>
                    <h2 className={`section-header ${s.section} font-bold text-gray-900 uppercase border-b border-gray-300 mb-3`}>Languages</h2>
                    <div className="space-y-1">
                       {data.languages.map(lang => (
                         <div key={lang.id} className="text-sm">
                           <span className="font-bold">{lang.name}</span> — <span className="text-gray-500 italic">{lang.level}</span>
                         </div>
                       ))}
                    </div>
                 </section>
              )}
           </div>

           <div className="space-y-5">
              {data.skills.length > 0 && (
                <section style={{ marginTop: `${data.customGaps['skills-top'] !== undefined ? data.customGaps['skills-top'] : 20}px` }}>
                  <GapHandle id="skills-top" />
                  <h2 className={`section-header ${s.section} font-bold text-gray-900 uppercase border-b border-gray-300 mb-3`}>
                    Skills
                  </h2>
                  <div className="leading-relaxed description-line text-sm">
                    {data.skills.join(' • ')}
                  </div>
                </section>
              )}

              {data.certifications && data.certifications.length > 0 && (
                <section>
                   <h2 className={`section-header ${s.section} font-bold text-gray-900 uppercase border-b border-gray-300 mb-3`}>Certifications</h2>
                   <div className="space-y-2">
                     {data.certifications.map(cert => (
                       <div key={cert.id} className="text-xs">
                         <div className="font-bold text-gray-800">{cert.name}</div>
                         <div className="text-gray-500">{cert.issuer} | {cert.date}</div>
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
            <h2 className={`section-header ${s.section} font-bold text-gray-900 uppercase border-b border-gray-300 mb-3`}>
              {section.title}
            </h2>
            {section.type === 'list' ? (
              <ul className="list-disc list-outside ml-5 space-y-1">
                 {section.content.split('\n').filter(l => l.trim()).map((line, i) => {
                    const cleanLine = line.replace(/^[\u2022\u25CF\u00B7\-\*]\s*/, '').trim();
                    return cleanLine && <li key={i} className="description-line">{cleanLine}</li>;
                 })}
              </ul>
            ) : (
              <div className="leading-relaxed text-justify whitespace-pre-line text-sm text-gray-800">
                 {section.content}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default ClassicTemplate;