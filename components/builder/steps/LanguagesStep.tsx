
import React from 'react';
import { useResume } from '../../../App';
import { Icons } from '../../ui/Icons';
import { Language } from '../../../types';

const LanguagesStep: React.FC = () => {
  const { resumeData, updateField } = useResume();

  const addLanguage = () => {
    const newLang: Language = { id: Date.now().toString(), name: '', level: 'Fluent' };
    updateField('languages', [...(resumeData.languages || []), newLang]);
  };

  const removeLanguage = (id: string) => {
    updateField('languages', resumeData.languages.filter(l => l.id !== id));
  };

  const updateLang = (id: string, field: keyof Language, value: string) => {
    const updated = resumeData.languages.map(l => l.id === id ? { ...l, [field]: value } : l);
    updateField('languages', updated);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-navy-900 mb-2">Languages</h2>
      <p className="text-gray-500 mb-8">List the languages you speak and your proficiency levels.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(resumeData.languages || []).map(lang => (
          <div key={lang.id} className="flex gap-2 items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <input placeholder="Language" value={lang.name} onChange={e => updateLang(lang.id, 'name', e.target.value)} className="flex-1 px-3 py-2 bg-gray-50 rounded" />
            <select value={lang.level} onChange={e => updateLang(lang.id, 'level', e.target.value)} className="bg-gray-50 px-3 py-2 rounded text-sm">
              <option>Native</option>
              <option>Fluent</option>
              <option>Intermediate</option>
              <option>Basic</option>
            </select>
            <button onClick={() => removeLanguage(lang.id)} className="text-gray-300 hover:text-red-500"><Icons.Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      <button onClick={addLanguage} className="mt-6 flex items-center gap-2 text-blue-600 font-bold hover:underline"><Icons.Plus size={18} /> Add Language</button>
    </div>
  );
};

export default LanguagesStep;
