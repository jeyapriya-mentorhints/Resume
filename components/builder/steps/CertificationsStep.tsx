
import React from 'react';
import { useResume } from '../../../App';
import { Icons } from '../../ui/Icons';
import { Certification } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

const CertificationsStep: React.FC = () => {
  const { resumeData, updateField } = useResume();

  const addCertification = () => {
    const newCert: Certification = { id: Date.now().toString(), name: '', issuer: '', date: '' };
    updateField('certifications', [...(resumeData.certifications || []), newCert]);
  };

  const removeCertification = (id: string) => {
    updateField('certifications', resumeData.certifications.filter(c => c.id !== id));
  };

  const updateCert = (id: string, field: keyof Certification, value: string) => {
    const updated = resumeData.certifications.map(c => c.id === id ? { ...c, [field]: value } : c);
    updateField('certifications', updated);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-navy-900 mb-2">Certifications & Awards</h2>
      <p className="text-gray-500 mb-8">Showcase your professional credentials and achievements.</p>
      <div className="space-y-6">
        <AnimatePresence>
          {(resumeData.certifications || []).map((cert, index) => (
            <MotionDiv key={cert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <button onClick={() => removeCertification(cert.id)} className="absolute right-4 top-4 text-gray-300 hover:text-red-500"><Icons.Trash2 size={18} /></button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Certification Name" value={cert.name} onChange={e => updateCert(cert.id, 'name', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-50 outline-none" />
                <input placeholder="Issuing Organization" value={cert.issuer} onChange={e => updateCert(cert.id, 'issuer', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-50 outline-none" />
                <input placeholder="Date (e.g., 2023)" value={cert.date} onChange={e => updateCert(cert.id, 'date', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-50 outline-none" />
              </div>
            </MotionDiv>
          ))}
        </AnimatePresence>
        <button onClick={addCertification} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2"><Icons.Plus size={18} /> Add Certification</button>
      </div>
    </div>
  );
};

export default CertificationsStep;
