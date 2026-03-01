

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './ui/Icons';
import { useAuth } from '../App';

const MotionDiv = motion.div as any;

interface ATSSignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ATSSignUpModal: React.FC<ATSSignUpModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateAccount = () => {
    if (email && password) {
      login(); // Set global auth state
      onSuccess();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-sans">
        <MotionDiv 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-white/80 backdrop-blur-sm"
        />

        <MotionDiv
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden p-8"
        >
           {/* Header Icon */}
           <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                 <Icons.Sparkles size={32} />
              </div>
           </div>

           <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Save your optimized resume</h2>
              <p className="text-gray-500 text-sm">
                 Create an account to preserve your ATS score and edits.
              </p>
           </div>

           <div className="space-y-4">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full px-4 py-3.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm"
              />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm"
              />

              <button 
                onClick={handleCreateAccount}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3.5 rounded-lg shadow-lg shadow-blue-500/30 transition-all mt-4"
              >
                Create Account
              </button>
           </div>

           <p className="text-xs text-gray-400 text-center mt-6">
              By signing up you agree to our Terms & Privacy Policy.
           </p>
        </MotionDiv>
      </div>
    </AnimatePresence>
  );
};

export default ATSSignUpModal;