import React from 'react';
import { TemplateProps } from './index';

const ProfessionalTemplate: React.FC<TemplateProps> = ({ 
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
    small: { base: 'text-[10px]', section: 'text-[12px]', name: 'text-xl' },
    medium: { base: 'text-[12px]', section: 'text-[14px]', name: 'text-2xl' },
    large: { base: 'text-[14px]', section: 'text-[16px]', name: 'text-3xl' },
  };
  const s = sizeMap[data.fontSize || 'medium'];

  const GapHandle = ({ id }: { id: string }) => {
    if (!isAdjusting || !onAdjustGap) return null;
    const currentGap = data.customGaps[id] !== undefined ? data.customGaps[id] : 20;
    return (
      <div className="no-print relative h-0 w-full group/handle z-[60]">
        <div className="absolute inset-x-0 -top-4 flex justify-center items-center opacity-0 group-hover/handle:opacity-100 transition-opacity">
          <div className="bg-white border-2 border-blue-600 rounded-full shadow-lg flex items-center overflow-hidden">
            <button 
              onClick={(e) => { e.stopPropagation(); onAdjustGap(id, -10); }} 
              className="px-3 py-1 hover:bg-red-50 text-red-600 text-[10px] font-bold border-r border-gray-100"
              title="Remove Space"
            >
              -
            </button>
            <div className="px-3 py-1 text-[9px] font-bold bg-blue-50 text-blue-700 min-w-[50px] text-center uppercase tracking-tighter">
              Gap: {currentGap}px
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onAdjustGap(id, 20); }} 
              className="px-3 py-1 hover:bg-blue-50 text-blue-600 text-[10px] font-bold"
              title="Add Line (20px)"
            >
              + Add Line
            </button>
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
      if (id) {
        handler(id, field, value);
      } else {
        handler(field, value);
      }
    }
  });

  return (
    <div className={`w-[21cm] min-h-[29.7cm] p-12 text-gray-800 ${s.base} bg-white shadow-sm`} style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <header className="text-center mb-8 relative">
        <h1 
          {...editableProps('firstName', onUpdateField)}
          className={`${s.name} font-bold text-navy-900 uppercase mb-1 tracking-wide`}
        >
          {data.firstName || 'First Name'} {data.lastName || 'Last Name'}
        </h1>
        <p 
          {...editableProps('jobTitle', onUpdateField)}
          className="text-md text-gray-600 mb-4 font-medium"
        >
          {data.jobTitle || 'Job Title'}
        </p>
        <div className="flex justify-center flex-wrap gap-4 text-[10px] text-gray-500 mb-4">
          {data.address && <span>📍 {data.address}</span>}
          {data.phone && <span>📞 {data.phone}</span>}
          {data.email && <span className="font-bold">✉️ {data.email}</span>}
        </div>
        <div className="w-full h-0.5 bg-navy-900 rounded-full opacity-10"></div>
      </header>

      <div className="space-y-6">
        {data.summary && (
          <section style={{ marginTop: `${data.customGaps['summary-top'] !== undefined ? data.customGaps['summary-top'] : 20}px` }} className="relative group/section">
            <GapHandle id="summary-top" />
            <h2 className={`section-header ${s.section} font-bold text-navy-900 uppercase mb-2 border-b border-gray-100 pb-1`}>Summary</h2>
            {data.summaryType === 'list' ? (
              <ul className="list-disc list-outside ml-5 text-gray-700 leading-relaxed space-y-1">
                 {data.summary.split('\n').filter(l => l.trim()).map((line, i) => {
                    const cleanLine = line.replace(/^[\u2022\u25CF\u00B7\-\*]\s*/, '').trim();
                    return cleanLine && <li key={i} className="description-line">{cleanLine}</li>;
                 })}
              </ul>
            ) : (
              <div 
                {...editableProps('summary', onUpdateField)}
                className="leading-relaxed text-justify whitespace-pre-line text-sm"
              >
                {data.summary}
              </div>
            )}
          </section>
        )}

        {data.experience.length > 0 && (
          <section style={{ marginTop: `${data.customGaps['experience-top'] !== undefined ? data.customGaps['experience-top'] : 20}px` }} className="relative">
            <GapHandle id="experience-top" />
            <h2 className={`section-header ${s.section} font-bold text-navy-900 uppercase mb-4 border-b border-gray-100 pb-1`}>Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={exp.id} className="relative group/item" style={{ marginTop: idx > 0 ? `${data.customGaps[`exp-${exp.id}-top`] !== undefined ? data.customGaps[`exp-${exp.id}-top`] : 20}px` : 0 }}>
                  {idx > 0 && <GapHandle id={`exp-${exp.id}-top`} />}
                  <div className="job-header">
                    <div className="flex justify-between font-bold text-gray-900 mb-0.5">
                        <span {...editableProps('employer', onUpdateExperience, exp.id)}>{exp.employer}</span>
                        <span className="text-gray-500 italic text-[11px]">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <div 
                        {...editableProps('jobTitle', onUpdateExperience, exp.id)}
                        className="font-medium text-blue-600 italic mb-2"
                    >
                        {exp.jobTitle}
                    </div>
                  </div>
                  
                  {exp.descriptionType === 'paragraph' ? (
                     <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line text-sm">
                        {exp.description}
                     </p>
                  ) : (
                    <ul className="list-disc list-outside ml-5 text-gray-700 leading-relaxed space-y-1">
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
          <section style={{ marginTop: `${data.customGaps['projects-top'] !== undefined ? data.customGaps['projects-top'] : 20}px` }} className="relative">
            <GapHandle id="projects-top" />
            <h2 className={`section-header ${s.section} font-bold text-navy-900 uppercase mb-4 border-b border-gray-100 pb-1`}>Projects</h2>
            <div className="space-y-4">
              {data.projects.map((proj) => (
                <div key={proj.id} className="relative">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900">{proj.title}</h3>
                    {proj.link && <span className="text-[11px] text-blue-500 italic">{proj.link}</span>}
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {proj.descriptionType === 'paragraph' ? proj.description : (
                      <ul className="list-disc list-outside ml-5">
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

        <div className="grid grid-cols-2 gap-12">
           <section style={{ marginTop: `${data.customGaps['skills-top'] !== undefined ? data.customGaps['skills-top'] : 20}px` }} className="relative">
              <GapHandle id="skills-top" />
              <h2 className={`section-header ${s.section} font-bold text-navy-900 uppercase mb-3 border-b border-gray-100 pb-1`}>Skills</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                  <span key={skill} className="bg-gray-50 px-2.5 py-1 rounded text-[11px] border border-gray-100 font-medium text-gray-700 skill-item">
                    {skill}
                  </span>
                ))}
              </div>
           </section>

           <div className="space-y-6">
              {data.certifications && data.certifications.length > 0 && (
                <section className="relative">
                  <h2 className={`section-header ${s.section} font-bold text-navy-900 uppercase mb-3 border-b border-gray-100 pb-1`}>Certifications</h2>
                  <div className="space-y-2">
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
                 <section className="relative" style={{ marginTop: `${data.customGaps['languages-top'] !== undefined ? data.customGaps['languages-top'] : 20}px` }}>
                    <GapHandle id="languages-top" />
                    <h2 className={`section-header ${s.section} font-bold text-navy-900 uppercase mb-3 border-b border-gray-100 pb-1`}>Languages</h2>
                    <div className="space-y-1.5">
                       {data.languages.map(l => (
                         <div key={l.id} className="flex justify-between text-[11px] skill-item">
                           <span className="font-bold">{l.name}</span>
                           <span className="text-gray-500 italic">{l.level}</span>
                         </div>
                       ))}
                    </div>
                 </section>
              )}
           </div>
        </div>

        {data.customSections?.map((section) => (
          <section key={section.id} style={{ marginTop: `${data.customGaps[`custom-${section.id}-top`] !== undefined ? data.customGaps[`custom-${section.id}-top`] : 20}px` }} className="relative group/section">
            <GapHandle id={`custom-${section.id}-top`} />
            <h2 className={`section-header ${s.section} font-bold text-navy-900 uppercase mb-2 border-b border-gray-100 pb-1`}>
              {section.title || 'Untitled Section'}
            </h2>
            
            {section.type === 'list' ? (
              <ul className="list-disc list-outside ml-5 space-y-1.5 text-gray-700 leading-relaxed">
                 {section.content.split('\n').filter(line => line.trim() !== '').map((item, i) => {
                    const cleanItem = item.replace(/^[\u2022\u25CF\u00B7\-\*]\s*/, '').trim();
                    return cleanItem && <li key={i} className="description-line">{cleanItem}</li>;
                 })}
              </ul>
            ) : (
              <div className="leading-relaxed text-justify whitespace-pre-line text-gray-700 text-sm">
                {section.content}
              </div>
            )}
          </section>
        ))}

        {data.education.length > 0 && (
          <section style={{ marginTop: `${data.customGaps['education-top'] !== undefined ? data.customGaps['education-top'] : 20}px` }} className="relative">
            <GapHandle id="education-top" />
            <h2 className={`section-header ${s.section} font-bold text-navy-900 uppercase mb-3 border-b border-gray-100 pb-1`}>Education</h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start job-header">
                  <div>
                    <span {...editableProps('degree', onUpdateEducation, edu.id)} className="font-bold text-gray-900">{edu.degree}</span>
                    <span className="text-gray-600"> — </span>
                    <span {...editableProps('school', onUpdateEducation, edu.id)} className="text-gray-600 font-medium">{edu.school}</span>
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProfessionalTemplate;