import React from 'react';
import { TemplateProps } from './index';

const CleanModernTemplate: React.FC<TemplateProps> = ({ data, isAdjusting = false, onAdjustGap }) => {
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
    <div className="bg-white w-[21cm] min-h-[29.7cm] p-[1.2cm] text-gray-800 flex flex-col" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <header className="text-center mb-10 border-b border-gray-300 pb-6">
        <h1 className="text-4xl font-light tracking-widest text-gray-800 uppercase mb-2">
          {data.firstName} <span className="font-semibold">{data.lastName}</span>
        </h1>
        <p className="text-sm font-bold tracking-[0.2em] text-gray-600 uppercase">
          {data.jobTitle}
        </p>
      </header>

      <div className="flex gap-10 flex-1">
        <div className="w-7/12 space-y-8 border-r border-gray-200 pr-8">
          {data.experience.length > 0 && (
            <section style={{ marginTop: `${data.customGaps['experience-top'] !== undefined ? data.customGaps['experience-top'] : 20}px` }}>
              <GapHandle id="experience-top" />
              <h2 className="section-header text-sm font-bold tracking-[0.2em] text-gray-500 bg-gray-100 py-1 px-2 mb-6 uppercase">
                Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, idx) => (
                  <div key={exp.id} style={{ marginTop: idx > 0 ? `${data.customGaps[`exp-${exp.id}-top`] !== undefined ? data.customGaps[`exp-${exp.id}-top`] : 20}px` : 0 }}>
                    {idx > 0 && <GapHandle id={`exp-${exp.id}-top`} />}
                    <div className="job-header">
                        <h3 className="text-sm font-bold text-gray-800 uppercase mb-1">{exp.jobTitle}</h3>
                        <div className="text-xs font-semibold text-gray-600 mb-1">
                        {exp.employer} | {exp.startDate} - {exp.endDate}
                        </div>
                    </div>
                    {exp.descriptionType === 'paragraph' ? (
                      <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed text-justify">
                        {exp.description}
                      </p>
                    ) : (
                      <ul className="list-disc list-outside ml-4 text-xs text-gray-600 leading-relaxed text-justify space-y-1">
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
              <h2 className="section-header text-sm font-bold tracking-[0.2em] text-gray-500 bg-gray-100 py-1 px-2 mb-6 uppercase">Projects</h2>
              <div className="space-y-4">
                {data.projects.map(proj => (
                  <div key={proj.id}>
                    <h3 className="text-xs font-bold text-gray-800 uppercase">{proj.title}</h3>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section style={{ marginTop: `${data.customGaps['education-top'] !== undefined ? data.customGaps['education-top'] : 20}px` }}>
              <GapHandle id="education-top" />
              <h2 className="section-header text-sm font-bold tracking-[0.2em] text-gray-500 bg-gray-100 py-1 px-2 mb-6 uppercase">
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id} className="job-header">
                    <div className="text-xs font-bold text-gray-800 uppercase">{edu.startDate} - {edu.endDate}</div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase mt-1">{edu.school}</h3>
                    <div className="text-xs text-gray-600 italic">{edu.degree} in {edu.fieldOfStudy}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.customSections?.map((section) => (
            <section key={section.id} style={{ marginTop: `${data.customGaps[`custom-${section.id}-top`] || 20}px` }}>
              <GapHandle id={`custom-${section.id}-top`} />
              <h2 className="section-header text-sm font-bold tracking-[0.2em] text-gray-500 bg-gray-100 py-1 px-2 mb-6 uppercase">
                {section.title}
              </h2>
              <div className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">{section.content}</div>
            </section>
          ))}
        </div>

        <div className="w-5/12 space-y-8">
          <section>
             <h2 className="section-header text-sm font-bold tracking-[0.2em] text-gray-500 bg-gray-100 py-1 px-2 mb-6 uppercase">Contact</h2>
              <div className="text-xs text-gray-600 space-y-2">
                 {data.phone && <div className="font-medium">{data.phone}</div>}
                 {(data.city || data.country) && <div className="font-medium">{data.city}, {data.country}</div>}
                 {data.email && <div className="font-medium break-all">{data.email}</div>}
              </div>
          </section>

          {data.skills.length > 0 && (
            <section style={{ marginTop: `${data.customGaps['skills-top'] || 20}px` }}>
              <GapHandle id="skills-top" />
              <h2 className="section-header text-sm font-bold tracking-[0.2em] text-gray-500 bg-gray-100 py-1 px-2 mb-6 uppercase">Skills</h2>
              <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside">
                {data.skills.map(skill => <li key={skill} className="skill-item">{skill}</li>)}
              </ul>
            </section>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <section>
              <h2 className="section-header text-sm font-bold tracking-[0.2em] text-gray-500 bg-gray-100 py-1 px-2 mb-4 uppercase">Awards</h2>
              <div className="space-y-3">
                {data.certifications.map(cert => (
                  <div key={cert.id} className="text-xs">
                    <div className="font-bold text-gray-700">{cert.name}</div>
                    <div className="text-[10px] text-gray-400">{cert.date}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.languages?.length > 0 && (
            <section>
              <h2 className="section-header text-sm font-bold tracking-[0.2em] text-gray-500 bg-gray-100 py-1 px-2 mb-4 uppercase">Languages</h2>
              <div className="space-y-2 text-xs">
                {data.languages.map(l => (
                  <div key={l.id} className="flex justify-between">
                    <span className="font-medium">{l.name}</span>
                    <span className="text-gray-400">{l.level}</span>
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

export default CleanModernTemplate;