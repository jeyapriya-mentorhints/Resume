import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/ui/Icons';
import { useResume } from '../App';

const MotionDiv = motion.div as any;

const Resume: React.FC = () => {
  const navigate = useNavigate();
  const { resetResume } = useResume();

  const handleCreateNew = () => {
    resetResume();
    navigate('/builder');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        
        {/* Hero / Selection Section */}
        <section className="py-20 px-4">
           <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                 <h1 className="text-3xl md:text-5xl font-bold text-navy-900 mb-4">How would you like to start?</h1>
                 <p className="text-gray-500 text-lg">Choose an option to begin building your professional resume</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                 {/* Create New Card */}
                 <MotionDiv 
                    whileHover={{ y: -5 }}
                    onClick={handleCreateNew}
                    className="bg-blue-50 p-8 md:p-12 rounded-3xl cursor-pointer hover:shadow-xl transition-all border border-blue-100 group flex flex-col items-start h-full"
                 >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                       <Icons.FileText size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-3">Create a new resume</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                       Make a resume from scratch with our AI optimization
                    </p>
                 </MotionDiv>

                 {/* Upload Card */}
                 <MotionDiv 
                    whileHover={{ y: -5 }}
                    onClick={() => {
                     resetResume();
                     localStorage.removeItem('lastAnalysisResult');
                     navigate('/upload-resume');
                     }}
                    className="bg-[#fff9e6] p-8 md:p-12 rounded-3xl cursor-pointer hover:shadow-xl transition-all border border-yellow-100 group flex flex-col items-start h-full relative overflow-hidden"
                 >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-navy-900 mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                       <Icons.Upload size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-bold text-navy-900 mb-3">Upload a resume</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                       Optimize your resume with our ATS friendly template and optimize content
                    </p>
                 </MotionDiv>
              </div>
           </div>
        </section>

        {/* Educational Content Below */}
        <section className="py-20 bg-white border-t border-gray-100 px-4">
           <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-3xl font-bold text-navy-900 mb-4">Why use our builder?</h2>
                 <p className="text-gray-500">We make the process simple, fast, and effective.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                 {[
                    { title: "ATS Friendly", icon: Icons.Check, desc: "Templates designed to pass Applicant Tracking Systems." },
                    { title: "AI Powered", icon: Icons.Sparkles, desc: "Smart suggestions to help you write professional content." },
                    { title: "Live Preview", icon: Icons.FileText, desc: "See changes instantly as you type and edit your resume." }
                 ].map((item, i) => (
                    <div key={i} className="text-center p-6 rounded-2xl bg-gray-50">
                       <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-navy-900 mx-auto mb-4 shadow-sm">
                          <item.icon size={20} />
                       </div>
                       <h3 className="font-bold text-navy-900 mb-2">{item.title}</h3>
                       <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resume;