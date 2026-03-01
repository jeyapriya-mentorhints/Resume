import React from 'react';
import { Icons } from './ui/Icons';

interface ATSFlowHeaderProps {
  onBack: () => void;
  backLabel?: string;
}

const ATSFlowHeader: React.FC<ATSFlowHeaderProps> = ({ onBack, backLabel = "Back" }) => {
  return (
    <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center">
         <button 
           onClick={onBack}
           className="flex items-center gap-2 text-gray-500 hover:text-navy-900 transition-colors font-medium text-sm"
         >
           <Icons.ArrowLeft size={16} />
           {backLabel}
         </button>
         
         <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-navy-900">ATS Optimization</span>
            <span className="bg-blue-100 text-blue-600 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold tracking-wide">Active</span>
         </div>
      </div>
    </div>
  );
};

export default ATSFlowHeader;