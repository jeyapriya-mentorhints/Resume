import React from 'react';
import { TemplateProps } from './index';

const ModernTemplate: React.FC<TemplateProps> = ({ 
  data, 
  isAdjusting = false, 
  onAdjustGap,
  onUpdateField,
  onUpdateExperience,
  onUpdateEducation
}) => {
  const accentColor = data.accentColor || '#3b82f6';
  const fontFamily = data.fontFamily || 'Poppins';

  const sizeMap = {
    small: { base: 'text-[10px]', section: 'text-xs', name: 'text-2xl' },
    medium: { base: 'text-[12px]', section: 'text-sm', name: 'text-3xl' },
    large: { base: 'text-[14px]', section: 'text-md', name: 'text-4xl' },
  };
  const s = sizeMap[data.fontSize || 'medium'];

  const GapHandle = ({ id }: { id: string }) => {
    if (!isAdjusting || !onAdjustGap) return null;
    const currentGap = data.customGaps[id] !== undefined ? data.customGaps[id] : 20;
    return (
      <div className="no-print relative h-0 w-full group/handle z-50">
        <div className="absolute inset-x-0 -top-4 flex justify-center items-center opacity-0 group-hover/handle:opacity-100 transition-opacity">
          <div className="bg-white border-2 border-blue-600 rounded-full shadow-lg flex items-center overflow-hidden">
            <button onClick={(e) => { e.stopPropagation(); onAdjustGap(id, -10); }} className="px-3 py-1 hover:bg-red-50 text-red-600 text-[10px] font-bold border-r border-gray-100">-</button>
            <div className="px-3 py-1 text-[9px] font-bold bg-blue-50 text-blue-700 min-w-[50px] text-center uppercase tracking-tighter">Gap: {currentGap}px</div>
            <button onClick={(e) => { e.stopPropagation(); onAdjustGap(id, 20); }} className="px-3 py-1 hover:bg-blue-50 text-blue-600 text-[10px] font-bold">+ Add Line</button>
          </div>
        </div>
        <div className="absolute inset-x-0 -top-[1px] border-t-2 border-dotted border-blue-400 opacity-40 group-hover/handle:opacity-100 transition-opacity" />
      </div>
    );
  };

  const editableProps = (field: any, handler: any, id?: string) => ({
    contentEditable: !isAdjusting,
    suppressContentEditableWarning: true,
    className: `outline-none focus:ring-2 focus:ring-blue-400 rounded transition-all px-1 -mx-1 ${!isAdjusting ? 'hover:bg-blue-50/50' : ''}`,
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      const value = e.currentTarget.innerText;
      if (id) handler(id, field, value); else handler(field, value);
    }
  });

  return (
    <div className={`w-[21cm] min-h-[29.7cm] p-12 text-gray-800 ${s.base} bg-white shadow-sm`} style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <header className="pb-4 mb-6 flex justify-between items-end border-b-4" style={{ borderColor: accentColor }}>
        <div>
          <h1 
            {...editableProps('firstName', onUpdateField)}
            className={`${s.name} font-bold text-navy-900 mb-1 uppercase tracking-tight break-words leading-none`}
          >
            {data.firstName || 'First'} {data.lastName || 'Last'}
          </h1>
          <p 
            {...editableProps('jobTitle', onUpdateField)}
            className="text-xl font-medium mt-2" 
            style={{ color: accentColor }}
          >
            {data.jobTitle || 'Job Title'}
          </p>
        </div>
        <div className="text-right text-[11px] text-gray-600 space-y-1">
          {data.email && <div className="font-bold">{data.email}</div>}
          {data.phone && <div>{data.phone}</div>}
          {(data.city || data.country) && <div>{data.city}, {data.country}</div>}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 space-y-8">
          {data.summary && (
            <section style={{ marginTop: `${data.customGaps['summary-top'] !== undefined ? data.customGaps['summary-top'] : 20}px` }} className="relative group/section">
              <GapHandle id="summary-top" />
              <h2 className={`section-header ${s.section} font-bold text-navy-900 uppercase tracking-widest border-b border-gray-200 pb-1 mb-3 flex items-center gap-3`}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }}></span>
                Summary
              </h2>
              {data.summaryType === 'list' ? (
                <ul className="list-disc list-outside ml-4 text-gray-700 leading-relaxed space-y-1">
                   {data.summary.split('\n').filter(l => l.trim()).map((line, i) => {
                      const cleanLine = line.replace(/^[\u2022\u25CF\u00B7\-\*]\s*/, '').trim();
                      return cleanLine && <li key={i} className="description-line">{cleanLine}</li>;
                   })}
                </ul>
              ) : (
                <div 
                  {...editableProps('summary', onUpdateField)}
                  className="leading-relaxed text-gray-700 text-justify whitespace-pre-line"
                >
                  {data.summary}
                </div>
              )}
            </section>
          )}

          {data.experience.length > 0 && (
            <section style={{ marginTop: `${data.customGaps['experience-top'] !== undefined ? data.customGaps['experience-top'] : 20}px` }} className="relative group/section">
              <GapHandle id="experience-top" />
              <h2 className={`section-header ${s.section} font-bold text-navy-900 uppercase tracking-widest border-b border-gray-200 pb-1 mb-4 flex items-center gap-3`}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }}></span>
                Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, idx) => (
                  <div key={exp.id} className="relative group/item" style={{ marginTop: idx > 0 ? `${data.customGaps[`exp-${exp.id}-top`] !== undefined ? data.customGaps[`exp-${exp.id}-top`] : 20}px` : 0 }}>
                    {idx > 0 && <GapHandle id={`exp-${exp.id}-top`} />}
                    <div className="job-header">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 {...editableProps('jobTitle', onUpdateExperience, exp.id)} className="font-bold text-gray-900 text-md">{exp.jobTitle}</h3>
                          <span className="text-[10px] text-gray-500 font-bold bg-gray-50 px-2 py-1 rounded border border-gray-100 uppercase tracking-wider">
                              {exp.startDate} - {exp.endDate}
                          </span>
                        </div>
                        <div {...editableProps('employer', onUpdateExperience, exp.id)} className="font-bold mb-3" style={{ color: accentColor }}>
                           {exp.employer}
                        </div>
                    </div>
                    {exp.descriptionType === 'paragraph' ? (
                       <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line text-sm">
                          {exp.description}
                       </p>
                    ) : (
                      <ul className="list-disc list-outside ml-4 text-gray-700 leading-relaxed space-y-1">
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
            <section style={{ marginTop: `${data.customGaps['projects-top'] !== undefined ? data.customGaps['projects-top'] : 20}px` }} className="relative group/section">
              <GapHandle id="projects-top" />
              <h2 className={`section-header ${s.section} font-bold text-navy-900 uppercase tracking-widest border-b border-gray-200 pb-1 mb-4 flex items-center gap-3`}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }}></span>
                Projects
              </h2>
              <div className="space-y-4">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="relative group/item">
                    <div className="job-header flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900 text-md">{proj.title}</h3>
                      {proj.link && <span className="text-[10px] text-blue-500 font-medium">{proj.link}</span>}
                    </div>
                    <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                      {proj.descriptionType === 'paragraph' ? proj.description : (
                        <ul className="list-disc list-outside ml-4 space-y-1">
                          {proj.description.split('\n').map((line, i) => (
                            <li key={i} className="description-line">{line.replace(/^[\u2022\u25CF\u00B7\-\*]\s*/, '').trim()}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

           {data.education.length > 0 && (
            <section style={{ marginTop: `${data.customGaps['education-top'] !== undefined ? data.customGaps['education-top'] : 20}px` }} className="relative group/section">
              <GapHandle id="education-top" />
              <h2 className={`section-header ${s.section} font-bold text-navy-900 uppercase tracking-widest border-b border-gray-200 pb-1 mb-4 flex items-center gap-3`}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }}></span>
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id} className="job-header mb-2">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 {...editableProps('school', onUpdateEducation, edu.id)} className="font-bold text-gray-900">{edu.school}</h3>
                      <span className="text-[11px] text-gray-500 font-medium">{edu.startDate} - {edu.endDate}</span>
                    </div>
                    <div {...editableProps('degree', onUpdateEducation, edu.id)} className="text-gray-700 italic">
                      {edu.degree} in {edu.fieldOfStudy}
                    </div>
                  </div>
                ))}
              </div>
            </section>
           )}

           {data.customSections?.map((section) => (
            <section key={section.id} style={{ marginTop: `${data.customGaps[`custom-${section.id}-top`] !== undefined ? data.customGaps[`custom-${section.id}-top`] : 20}px` }} className="relative group/section">
              <GapHandle id={`custom-${section.id}-top`} />
              <h2 className={`section-header ${s.section} font-bold text-navy-900 uppercase tracking-widest border-b border-gray-200 pb-1 mb-3 flex items-center gap-3`}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }}></span>
                {section.title}
              </h2>
              {section.type === 'list' ? (
                <ul className="list-disc list-outside ml-4 text-gray-700 leading-relaxed space-y-1">
                   {section.content.split('\n').filter(l => l.trim()).map((line, i) => {
                      const cleanLine = line.replace(/^[\u2022\u25CF\u00B7\-\*]\s*/, '').trim();
                      return cleanLine && <li key={i} className="description-line">{cleanLine}</li>;
                   })}
                </ul>
              ) : (
                <div className="leading-relaxed text-gray-700 text-justify whitespace-pre-line text-sm">
                  {section.content}
                </div>
              )}
            </section>
          ))}
        </div>

        <div className="col-span-4 space-y-8">
          {data.skills.length > 0 && (
            <section className="bg-gray-50 p-6 rounded-xl border border-gray-100" style={{ marginTop: `${data.customGaps['skills-top'] !== undefined ? data.customGaps['skills-top'] : 20}px` }}>
              <GapHandle id="skills-top" />
              <h2 className={`section-header ${s.section} font-bold text-navy-900 uppercase tracking-widest border-b border-gray-200 pb-1 mb-4`}>
                Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <span
                    key={skill}
                    className="skill-item bg-white border border-gray-200 text-navy-900 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <section className="px-2" style={{ marginTop: `${data.customGaps['certs-top'] !== undefined ? data.customGaps['certs-top'] : 20}px` }}>
              <GapHandle id="certs-top" />
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-widest border-b border-gray-100 pb-1 mb-3">Certifications</h2>
              <div className="space-y-3">
                {data.certifications.map(cert => (
                  <div key={cert.id} className="text-[11px]">
                    <div className="font-bold text-gray-800">{cert.name}</div>
                    <div className="text-gray-500">{cert.issuer} | {cert.date}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.languages?.length > 0 && (
            <section className="px-2" style={{ marginTop: `${data.customGaps['languages-top'] !== undefined ? data.customGaps['languages-top'] : 20}px` }}>
               <GapHandle id="languages-top" />
               <h2 className="text-sm font-bold text-navy-900 uppercase tracking-widest border-b border-gray-100 pb-1 mb-3">Languages</h2>
               <div className="space-y-2">
                  {data.languages.map(l => (
                    <div key={l.id} className="flex justify-between text-[11px]">
                       <span className="font-bold text-gray-700">{l.name}</span>
                       <span className="text-gray-400 italic">{l.level}</span>
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

export default ModernTemplate;