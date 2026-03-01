
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Icons } from '../components/ui/Icons';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;

const MissionIllustration = () => {
  return (
    <div className="w-full h-[400px] relative flex items-center justify-center select-none">
       {/* Background Blob */}
       <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-3xl -z-10 transform rotate-2 border border-blue-100/50"></div>

       <div className="relative w-full max-w-[320px] aspect-[3/4]">
          {/* Central Resume */}
          <MotionDiv 
             className="absolute inset-0 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col z-10"
             initial={{ y: 20, opacity: 0 }}
             whileInView={{ y: 0, opacity: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
          >
             {/* Header */}
             <div className="h-24 bg-navy-900 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500 rounded-full opacity-20"></div>
                <div className="absolute left-6 top-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-navy-900 font-bold text-xl shadow-lg">
                   RB
                </div>
             </div>
             
             {/* Content lines */}
             <div className="p-6 space-y-4">
                <div className="h-4 w-3/4 bg-slate-100 rounded-full"></div>
                <div className="space-y-2">
                   <div className="h-2 w-full bg-slate-50 rounded-full"></div>
                   <div className="h-2 w-5/6 bg-slate-50 rounded-full"></div>
                   <div className="h-2 w-4/6 bg-slate-50 rounded-full"></div>
                </div>
                
                <div className="pt-4 flex gap-3">
                   <div className="h-20 flex-1 bg-blue-50 rounded-xl border border-blue-100"></div>
                   <div className="h-20 flex-1 bg-indigo-50 rounded-xl border border-indigo-100"></div>
                </div>
             </div>
          </MotionDiv>

          {/* Floating Connectors/Nodes */}
          
          {/* Top Right - Job Offer */}
          <MotionDiv 
             className="absolute -right-12 top-10 bg-white p-4 rounded-2xl shadow-xl border border-green-100 z-20 flex items-center gap-3"
             initial={{ x: 20, opacity: 0 }}
             whileInView={{ x: 0, opacity: 1 }}
             animate={{ y: [0, -5, 0] }}
             // @ts-ignore
             transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } ,delay: 0.3}}
          >
             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Icons.Check size={20} strokeWidth={3} />
             </div>
             <div>
                <div className="text-xs font-bold text-navy-900">Hired!</div>
                <div className="text-[10px] text-gray-500">Tech Corp</div>
             </div>
          </MotionDiv>

          {/* Bottom Left - AI Boost */}
          <MotionDiv 
             className="absolute -left-8 bottom-20 bg-white p-4 rounded-2xl shadow-xl border border-purple-100 z-20 flex items-center gap-3"
             initial={{ x: -20, opacity: 0 }}
             whileInView={{ x: 0, opacity: 1 }}
            //  transition={{ delay: 0.5 }}
             animate={{ y: [0, 5, 0] }}
             // @ts-ignore
             transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut",delay: 0.5  } }}
          >
             <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <Icons.Sparkles size={20} />
             </div>
             <div>
                <div className="text-xs font-bold text-navy-900">AI Optimized</div>
                <div className="text-[10px] text-gray-500">Score: 98/100</div>
             </div>
          </MotionDiv>

          {/* Decorative Elements */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-dashed border-gray-200 rounded-full animate-[spin_60s_linear_infinite]"></div>
       </div>
    </div>
  );
};

const About: React.FC = () => {
  return (
    <><SEO
  title="About ATS Free Resume"
  description="Learn about ATS Free Resume – a platform built to help job seekers create ATS-optimized resumes easily."
  canonical="/about"
/>
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-white">
        
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <MotionH1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-navy-900 mb-6"
            >
              Bridging Talent with <span className="text-blue-500">Opportunity</span>
            </MotionH1>
            <MotionP 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed"
            >
              We believe that every professional story deserves to be told with clarity and confidence. Our AI-powered tools help you craft the perfect resume to land your dream job.
            </MotionP>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block p-3 bg-blue-100 rounded-xl text-blue-600 mb-6">
                  <Icons.Sparkles size={32} />
                </div>
                <h2 className="text-3xl font-bold text-navy-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  The job market is competitive, and Applicant Tracking Systems (ATS) often filter out great candidates before a human ever sees their resume.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Our mission is to democratize career success by providing top-tier resume building technology to everyone. Whether you are a fresh graduate or a seasoned executive, Resume Builder AI ensures your qualifications shine through.
                </p>
                <Link to="/builder" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
                  Start Building Now <Icons.ChevronRight size={16} />
                </Link>
              </div>
              <div className="relative pl-8">
                <MissionIllustration />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-navy-900 mb-4">Why Choose Us?</h2>
              <p className="text-gray-500">Built with modern technology for modern job seekers.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Icons.Wrench,
                  title: 'ATS Optimized',
                  desc: 'Our templates are rigorously tested against popular ATS software to ensure high parse rates.'
                },
                {
                  icon: Icons.Sparkles,
                  title: 'AI Assistance',
                  desc: 'Stuck on what to write? Our Gemini-powered AI suggests professional summaries and bullet points.'
                },
                {
                  icon: Icons.User,
                  title: 'Privacy First',
                  desc: 'We store your data locally in your browser. No hidden servers, no data selling. Your resume is yours.'
                }
              ].map((feature, idx) => (
                <MotionDiv 
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-navy-900 mb-6">Ready to take the next step?</h2>
            <p className="text-gray-500 mb-8 text-lg">Join thousands of professionals who have advanced their careers with our tools.</p>
            <Link 
              to="/builder"
              className="inline-flex items-center justify-center px-8 py-4 bg-navy-900 text-white rounded-lg font-bold text-lg hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20"
            >
              Create Your Resume
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div></>
  );
};

export default About;
