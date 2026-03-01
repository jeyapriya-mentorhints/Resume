import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useResume } from '../App';
import { Icons } from '../components/ui/Icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import CircularProgress from '../components/ui/CircularProgress';
import { TemplatesMap } from '../components/templates';
import SEO from '@/components/SEO';

const MotionDiv = motion.div as any;

const Dashboard: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { resumeData } = useResume();
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'profile' | 'settings'>('overview');

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // Calculate completion percentage based on filled resume fields
  const completionStats = useMemo(() => {
    const fields = [
      { key: 'firstName', weight: 10 },
      { key: 'lastName', weight: 10 },
      { key: 'jobTitle', weight: 15 },
      { key: 'summary', weight: 20 },
      { key: 'experience', weight: 25 },
      { key: 'education', weight: 20 },
    ];

    let score = 0;
    fields.forEach(f => {
      const val = (resumeData as any)[f.key];
      if (Array.isArray(val)) {
        if (val.length > 0) score += f.weight;
      } else if (val && typeof val === 'string' && val.trim().length > 0) {
        score += f.weight;
      }
    });
    return Math.min(100, score);
  }, [resumeData]);

  const SelectedTemplate = TemplatesMap[resumeData.templateId] || TemplatesMap['professional'];

  if (!isLoggedIn) return null;

  return (
   <><SEO
  title="Dashboard"
  description="User dashboard"
  canonical="/dashboard"
  noindex
/>

    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-navy-900">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
           <div>
              <h1 className="text-3xl font-bold text-navy-900">Welcome back, {resumeData.firstName || 'User'}!</h1>
              <p className="text-gray-500 mt-1">Manage your resumes and career optimizations.</p>
           </div>
           <Link 
             to="/builder"
             className="bg-navy-900 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-navy-900/10 transition-all flex items-center gap-2"
           >
             <Icons.Plus size={20} />
             Create New Resume
           </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Sidebar Stats */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                 <h3 className="font-bold text-navy-900 mb-6 uppercase tracking-widest text-xs">Profile Completion</h3>
                 <div className="mb-6">
                    <CircularProgress percentage={completionStats} size={150} strokeWidth={12} color="#3b82f6" />
                 </div>
                 <p className="text-xs text-gray-400 font-medium px-4 leading-relaxed">
                    {completionStats < 100 
                      ? "Complete your profile to boost your ATS matching accuracy." 
                      : "Your profile is fully optimized and ready for job applications."}
                 </p>
              </div>

              <div className="bg-navy-900 p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                 <div className="relative z-10">
                    <Icons.Sparkles className="text-blue-400 mb-4" size={32} />
                    <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
                    <p className="text-blue-100/60 text-sm mb-6 leading-relaxed">
                       Get unlimited ATS scans, premium templates, and advanced AI rewriting power.
                    </p>
                    <Link 
                      to="/pricing"
                      className="block w-full bg-white text-navy-900 font-bold py-3.5 rounded-xl hover:bg-blue-50 transition-all text-center text-sm shadow-xl"
                    >
                       View Plans
                    </Link>
                 </div>
              </div>
           </div>

           {/* Main Content Resumes */}
           <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <h3 className="font-bold text-navy-900">Your Recent Resume</h3>
                    <div className="flex gap-2">
                       <Link to="/preview" className="p-2 text-gray-400 hover:text-navy-900 transition-colors" title="Quick Preview">
                          <Icons.Search size={18} />
                       </Link>
                       <Link to="/builder/template" className="p-2 text-gray-400 hover:text-navy-900 transition-colors" title="Change Layout">
                          <Icons.Layout size={18} />
                       </Link>
                    </div>  
                 </div>
                 
                 <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
                    {/* Resume Snapshot */}
                    <div className="w-full md:w-48 h-64 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative group cursor-pointer shadow-inner" onClick={() => navigate('/preview')}>
                       <div className="absolute inset-0 transform scale-[0.23] origin-top-left p-4 pointer-events-none">
                          <SelectedTemplate data={resumeData} />
                       </div>
                       <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/10 transition-all flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100">
                          <div className="bg-white text-navy-900 p-3 rounded-full shadow-2xl">
                             <Icons.Play fill="currentColor" size={24} />
                          </div>
                       </div>
                    </div>

                    <div className="flex-1 space-y-6">
                       <div>
                          <h4 className="text-2xl font-bold text-navy-900 mb-1">{resumeData.jobTitle || 'Untitled Resume'}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                             <Icons.FileText size={14} />
                             Last updated today
                          </div>
                       </div>

                       <div className="flex flex-wrap gap-3">
                          <Link 
                            to="/builder"
                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-navy-900 font-bold rounded-xl text-sm transition-all"
                          >
                            Edit Resume
                          </Link>
                          <Link 
                            to="/preview"
                            className="px-6 py-3 bg-navy-900 hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-navy-900/10"
                          >
                            Download PDF
                          </Link>
                       </div>

                       <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-50 flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                <Icons.Target size={20} strokeWidth={2.5} />
                             </div>
                             <div>
                                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">ATS Match</div>
                                <div className="text-lg font-black text-navy-900">85%</div>
                             </div>
                          </div>
                          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-50 flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <Icons.TrendingUp size={20} strokeWidth={2.5} />
                             </div>
                             <div>
                                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Visibility</div>
                                <div className="text-lg font-black text-navy-900">High</div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Extra tools */}
              <div className="grid md:grid-cols-2 gap-6">
                 <Link to="/upload-resume" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                       <Icons.Upload size={28} />
                    </div>
                    <div>
                       <h4 className="font-bold text-navy-900">Import & Analyze</h4>
                       <p className="text-xs text-gray-500">Fix an existing resume for ATS.</p>
                    </div>
                 </Link>
                 <Link to="/templates" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                       <Icons.Palette size={28} />
                    </div>
                    <div>
                       <h4 className="font-bold text-navy-900">New Design</h4>
                       <p className="text-xs text-gray-500">Recruiter-approved styles.</p>
                    </div>
                 </Link>
              </div>
           </div>
        </div>
      </main>

      <Footer />
    </div></>
  );
};

export default Dashboard;