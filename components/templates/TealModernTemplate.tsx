import React from 'react';
import { TemplateProps } from './index';

const TealModernTemplate: React.FC<TemplateProps> = ({ data, isAdjusting = false, onAdjustGap }) => {
  const accentColor = data.accentColor || '#0d9488';
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
    <div className="bg-white w-[21cm] min-h-[29.7cm] p-12 text-gray-800" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <header className="mb-10 pb-6 border-b-2" style={{ borderColor: accentColor }}>
        <h1 className="text-5xl font-black uppercase mb-1 tracking-tight" style={{ color: accentColor }}>
          {data.firstName} {data.lastName}
        </h1>
        <p className="text-xl tracking-[0.2em] uppercase text-gray-500 font-medium mb-6">
          {data.jobTitle}
        </p>
        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
           <span>{data.email}</span>
           <span>{data.phone}</span>
           <span>{data.city}, {data.country}</span>
        </div>
      </header>

      <div className="space-y-10">
        {data.summary && (
          <section>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-4 section-header" style={{ color: accentColor }}>
               Core Profile <span className="flex-1 h-[1px] bg-gray-100"></span>
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-4 section-header" style={{ color: accentColor }}>
                Experience <span className="flex-1 h-[1px] bg-gray-100"></span>
            </h2>
            <div className="space-y-8">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-black text-md">{exp.jobTitle}</h3>
                      <span className="text-xs font-bold" style={{ color: accentColor }}>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase mb-3">{exp.employer}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-12">
           <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-4 section-header" style={{ color: accentColor }}>
                Expertise <span className="flex-1 h-[1px] bg-gray-100"></span>
              </h2>
              <div className="flex flex-wrap gap-2">
                 {data.skills.map(s => <span key={s} className="px-3 py-1 bg-gray-50 text-xs font-medium text-gray-700 border border-gray-100 rounded skill-item">{s}</span>)}
              </div>
           </section>
           <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-4 section-header" style={{ color: accentColor }}>
                Education <span className="flex-1 h-[1px] bg-gray-100"></span>
              </h2>
              <div className="space-y-4">
                 {data.education.map(edu => (
                    <div key={edu.id}>
                       <div className="font-bold text-sm">{edu.school}</div>
                       <div className="text-xs text-gray-500">{edu.degree}</div>
                    </div>
                 ))}
              </div>
           </section>
        </div>

        {(data.projects.length > 0 || data.certifications.length > 0) && (
          <div className="grid grid-cols-2 gap-12">
            {data.projects.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-4 section-header" style={{ color: accentColor }}>Projects</h2>
                <div className="space-y-3">
                  {data.projects.map(p => <div key={p.id} className="text-sm"><span className="font-bold">{p.title}:</span> {p.description}</div>)}
                </div>
              </section>
            )}
            {data.certifications.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-4 section-header" style={{ color: accentColor }}>Awards</h2>
                <div className="space-y-2 text-sm text-gray-600">
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

export default TealModernTemplate;