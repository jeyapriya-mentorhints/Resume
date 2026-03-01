import React from 'react';
import { TemplateProps } from './index';

const SerifElegantTemplate: React.FC<TemplateProps> = ({ data, isAdjusting = false, onAdjustGap }) => {
  const accentColor = data.accentColor || '#654321';
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
    <div className="bg-white w-[21cm] min-h-[29.7cm] p-[1.5cm] text-gray-900" style={{ fontFamily: `'${fontFamily}', serif` }}>
      <header className="mb-8">
        <h1 className="text-5xl font-bold mb-2 font-serif" style={{ color: accentColor }}>
          {data.firstName} {data.lastName}
        </h1>
        <p className="text-2xl italic text-gray-700 font-serif mb-6">
          {data.jobTitle}
        </p>
        <div className="py-2 flex justify-around text-sm" style={{ borderTop: `1px solid ${accentColor}`, borderBottom: `1px solid ${accentColor}`, color: accentColor }}>
           {data.email && <span>{data.email}</span>}
           {data.phone && <span>{data.phone}</span>}
           {(data.city || data.country) && <span>{data.city}, {data.country}</span>}
        </div>
      </header>

      {data.experience.length > 0 && (
        <section className="mb-8" style={{ marginTop: `${data.customGaps['experience-top'] || 20}px` }}>
          <GapHandle id="experience-top" />
          <h2 className="text-xl font-bold pb-1 mb-4 section-header uppercase tracking-widest" style={{ color: accentColor, borderBottom: `1px solid ${accentColor}` }}>Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, idx) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-gray-800">
                  <h3>{exp.jobTitle}</h3>
                  <span className="italic">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-md italic mb-2" style={{ color: accentColor }}>{exp.employer}</div>
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects && data.projects.length > 0 && (
        <section className="mb-8" style={{ marginTop: `${data.customGaps['projects-top'] || 20}px` }}>
          <GapHandle id="projects-top" />
          <h2 className="text-xl font-bold pb-1 mb-4 section-header uppercase tracking-widest" style={{ color: accentColor, borderBottom: `1px solid ${accentColor}` }}>Projects</h2>
          <div className="space-y-4">
            {data.projects.map(proj => (
              <div key={proj.id}>
                <div className="font-bold">{proj.title}</div>
                <p className="text-sm text-gray-600">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold pb-1 mb-4 uppercase tracking-widest" style={{ color: accentColor, borderBottom: `1px solid ${accentColor}` }}>Education</h2>
          {data.education.map(edu => (
            <div key={edu.id} className="mb-4">
              <div className="font-bold">{edu.school}</div>
              <div className="text-sm italic">{edu.degree}</div>
              <div className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-bold pb-1 mb-4 uppercase tracking-widest" style={{ color: accentColor, borderBottom: `1px solid ${accentColor}` }}>Skills & More</h2>
          <div className="text-sm space-y-4">
            <div>{data.skills.join(' • ')}</div>
            {data.languages.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <span className="font-bold">Languages:</span> {data.languages.map(l => `${l.name} (${l.level})`).join(', ')}
              </div>
            )}
            {data.certifications.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <span className="font-bold">Certs:</span> {data.certifications.map(c => c.name).join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SerifElegantTemplate;