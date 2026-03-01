
import React, { useState } from 'react';
import { Icons } from './ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../App';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase'; // Make sure to export 'app' from firebaseConfig

const MotionDiv = motion.div as any;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const auth = getAuth(app);

  if (!isOpen) return null;

  const handleContinue = async () => {
    setError(null);
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

     //temporary 

     const user = auth.currentUser;
  if (!user) return;

  const token = await user.getIdToken();
  await fetch("https://atsfreeresume.in/api/bootstrap-user.php", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

  const res = await fetch("https://atsfreeresume.in/api/me.php", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("Backend response:", await res.json());
      

  //
      login();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      onClose();
    } catch (error: any) {
      console.error("Authentication error:", error);
      switch (error.code) {
        case 'auth/user-not-found':
          setError("No user found with this email.");
          break;
        case 'auth/wrong-password':
          setError("Incorrect password. Please try again.");
          break;
        case 'auth/email-already-in-use':
          setError("An account with this email already exists.");
          break;
        case 'auth/invalid-email':
            setError("Please enter a valid email address.");
            break;
        case 'auth/weak-password':
            setError("Password should be at least 6 characters.");
            break;
        default:
          setError("An unexpected error occurred. Please try again.");
          break;
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);

      const user = auth.currentUser;
  if (!user) return;

  const token = await user.getIdToken();
  await fetch("https://atsfreeresume.in/api/bootstrap-user.php", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

  const res = await fetch("https://atsfreeresume.in/api/me.php", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("Backend response:", await res.json());
      

      login();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      onClose();
    } catch (error: any) {
      console.error("Authentication error:", error);
      switch (error.code) {
        case 'auth/user-not-found':
          setError("No user found with this email.");
          break;
        case 'auth/wrong-password':
          setError("Incorrect password. Please try again.");
          break;
        case 'auth/email-already-in-use':
          setError("An account with this email already exists.");
          break;
        case 'auth/invalid-email':
            setError("Please enter a valid email address.");
            break;
        case 'auth/weak-password':
            setError("Password should be at least 6 characters.");
            break;
        default:
          setError("An unexpected error occurred. Please try again.");
          break;
      }
    }
  };

  const handleModeChange = () => {
    setMode(mode === 'signup' ? 'signin' : 'signup');
    setError(null); // Clear error on mode change
    setEmail('');
    setPassword('');
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10 transition-colors"
            >
              <Icons.X size={20} />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-2">
                  {mode === 'signup' ? 'Sign up' : 'Welcome back'}
                </h2>
                <p className="text-sm text-gray-500">
                  {mode === 'signup' ? 'create account & save resume' : 'Login to access your saved resumes'}
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm"
                  role="alert"
                >
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Email ID</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email id"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <button 
                  onClick={handleContinue}
                  className="w-full bg-[#0047ab] hover:bg-[#003580] text-white font-semibold py-3 rounded-lg shadow-md shadow-blue-900/10 transition-all mt-2"
                >
                  Continue
                </button>

                <div className="relative flex items-center justify-center my-4">
                   <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                   </div>
                   <span className="relative bg-white px-4 text-xs text-gray-500 uppercase">or</span>
                </div>

                <button 
                  onClick={handleGoogleSignIn}
                  className="w-full border border-gray-300 bg-white text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign up with google
                </button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                <button 
                  onClick={handleModeChange}
                  className="text-[#0047ab] font-semibold hover:underline"
                >
                  {mode === 'signup' ? 'Login' : 'Sign up'}
                </button>
              </div>
            </div>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
