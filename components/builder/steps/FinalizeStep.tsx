
import React from 'react';
import { useResume } from '../../../App';
import { Icons } from '../../ui/Icons';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

const fonts = [
  { id: 'Poppins', name: 'Poppins', className: 'font-sans' },
  { id: 'Roboto', name: 'Roboto', className: 'font-roboto' },
  { id: 'Lato', name: 'Lato', className: 'font-lato' },
  { id: 'Open Sans', name: 'Open Sans', className: "font-['Open_Sans']" },
  { id: 'Montserrat', name: 'Montserrat', className: 'font-montserrat' },
  { id: 'Raleway', name: 'Raleway', className: 'font-raleway' },
  { id: 'Merriweather', name: 'Merriweather', className: 'font-merriweather' },
  { id: 'Playfair Display', name: 'Playfair Display', className: "font-['Playfair_Display']" },
];

const colors = [
  { id: 'slate', value: '#475569' },
  { id: 'gray', value: '#6b7280' },
  { id: 'blue', value: '#3b82f6' },
  { id: 'navy', value: '#061c3d' },
  { id: 'red', value: '#ef4444' },
  { id: 'rose', value: '#e11d48' },
  { id: 'orange', value: '#f97316' },
  { id: 'amber', value: '#f59e0b' },
  { id: 'green', value: '#10b981' },
  { id: 'teal', value: '#14b8a6' },
  { id: 'purple', value: '#8b5cf6' },
  { id: 'burgundy', value: '#881337' },
];

const fontSizes: { id: 'small' | 'medium' | 'large'; label: string }[] = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
];

const FinalizeStep: React.FC = () => {
  const { resumeData, updateField } = useResume();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-navy-900 mb-2">Final Touches</h2>
        <p className="text-gray-500">Customize the appearance of your resume.</p>
      </div>

      {/* Font Family Selection */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
           <Icons.Palette size={18} className="text-blue-500" /> Font Family
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {fonts.map((font) => (
            <button
              key={font.id}
              onClick={() => updateField('fontFamily', font.id)}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                resumeData.fontFamily === font.id
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <span className={`text-2xl ${font.className}`}>{font.name}</span>
              <p className={`text-sm text-gray-500 mt-2 ${font.className}`}>
                The quick brown fox jumps over the lazy dog.
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size Selection */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
           <Icons.Type size={18} className="text-blue-500" /> Font Size
        </h3>
        <div className="bg-gray-100 p-1.5 rounded-xl flex items-center gap-1 w-fit">
          {fontSizes.map((size) => (
            <button
              key={size.id}
              onClick={() => updateField('fontSize', size.id)}
              className={`relative px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${
                resumeData.fontSize === size.id 
                  ? 'text-white' 
                  : 'text-gray-500 hover:text-navy-900'
              }`}
            >
              {resumeData.fontSize === size.id && (
                <MotionDiv
                  layoutId="finalizeFontSizeBg"
                  className="absolute inset-0 bg-navy-900 rounded-lg shadow-md"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{size.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color Selection */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
           <Icons.Sparkles size={18} className="text-blue-500" /> Accent Color
        </h3>
        <div className="flex flex-wrap gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => updateField('accentColor', color.value)}
              className={`w-12 h-12 rounded-full transition-all transform hover:scale-110 flex items-center justify-center ${
                resumeData.accentColor === color.value ? 'ring-4 ring-offset-2 ring-blue-100' : ''
              }`}
              style={{ backgroundColor: color.value }}
              aria-label={`Select ${color.id} color`}
            >
              {resumeData.accentColor === color.value && (
                <Icons.Check size={24} className="text-white" strokeWidth={3} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinalizeStep;
