import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate, BrowserRouter } from 'react-router-dom';
import { ResumeData, initialResumeState } from './types';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from "./firebase";
import { app } from './firebase';
import Home from './pages/Home';
import Builder from './pages/Builder';
import Preview from './pages/Preview';
import About from './pages/About';
import Templates from './pages/Templates';
import Pricing from './pages/Pricing';
import Resume from './pages/Resume';
import ATS from './pages/ATS';
import JobTarget from './pages/JobTarget';
import Success from './pages/Success';
import UploadResume from './pages/UploadResume';
import ATSTemplates from './pages/ATSTemplates';
import FinalReview from './pages/FinalReview';
import Dashboard from './pages/Dashboard';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from './pages/TermsAndConditions'
import RouteTracker from './components/RouteTracker';
import { SubscriptionProvider } from './components/SubcriptionContent';
import RefundPolicy from './pages/RefundPolicy';



// --- Resume Context Setup ---
interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  updateField: (field: keyof ResumeData, value: any) => void;
  updateGap: (key: string, amount: number) => void;
  resetResume: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

// Helper to sanitize data loaded from storage
const sanitizeData = (data: any): ResumeData => {
  if (!data) return initialResumeState;
  return {
    ...initialResumeState,
    ...data,
    experience: Array.isArray(data.experience) ? data.experience : [],
    education: Array.isArray(data.education) ? data.education : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    customGaps: data.customGaps || {},
    fontSize: data.fontSize || 'medium',
  };
};

const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem('resumeData');
      return saved ? sanitizeData(JSON.parse(saved)) : initialResumeState;
    } catch {
      return initialResumeState;
    }
  });

  // 🔹 LOAD RESUME FROM BACKEND ON LOGIN
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const token = await user.getIdToken();

        const res = await fetch("https://atsfreeresume.in/api/get-resume.php", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data) {
          setResumeData(sanitizeData(data));
        }
      } catch (err) {
        console.error("Failed to load resume from backend", err);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  const updateField = (field: keyof ResumeData, value: any) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const updateGap = (key: string, amount: number) => {
    setResumeData(prev => ({
      ...prev,
      customGaps: {
        ...prev.customGaps,
        [key]: Math.max(0, (prev.customGaps[key] || 0) + amount),
      },
    }));
  };

  const resetResume = () => {
    localStorage.removeItem('resumeData');
    setResumeData(initialResumeState);
  };

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData, updateField, updateGap, resetResume }}>
      {children}
    </ResumeContext.Provider>
  );
};


// --- Auth Context Setup ---
interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe;
  }, [auth]);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('resumeData');
  localStorage.removeItem('lastAnalysisResult');
  localStorage.removeItem('hasPlan');
    signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- App Component ---
const App: React.FC = () => {


  return (
    <AuthProvider>
      <SubscriptionProvider>
      <ResumeProvider>
        <BrowserRouter>
        {/* <HashRouter> */}
          {/* ✅ Route tracking MUST be here */}
          <RouteTracker />
          <div className="min-h-screen bg-white text-navy-900 font-sans selection:bg-blue-100 selection:text-blue-600">
             <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/about" element={<About />} />
               <Route path="/convertats" element={<Resume />} />
               <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/upload-resume" element={<UploadResume />} />
               <Route path="/templates" element={<Templates />} />
               <Route path="/ats-templates" element={<ATSTemplates />} />
               <Route path="/final-review" element={<FinalReview />} />
               <Route path="/pricing" element={<Pricing />} />
               <Route path="/ats" element={<ATS />} />
               <Route path="/job-target" element={<JobTarget />} />
               <Route path="/success" element={<Success />} />
               <Route path="/builder/*" element={<Builder />} />
               <Route path="/preview" element={<Preview />} />
               <Route path="/privacy-policy" element={<PrivacyPolicy />} />
               <Route path="/refund-policy" element={<RefundPolicy />} />
               <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
               <Route path="*" element={<Navigate to="/" replace />} />
             </Routes>
          </div>
          </BrowserRouter>
        {/* </HashRouter> */}
      </ResumeProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
};

export default App;