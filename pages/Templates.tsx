import React,{useState} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/ui/Icons';
import { useResume } from '../App';
import { availableTemplates, TemplatesMap } from '../components/templates';
import { ResumeData } from '../types';
import { useSubscription } from '@/components/SubcriptionContent';
import PricingModal from '@/components/PricingModal';
import { auth } from '../firebase';
import AuthModal from '@/components/AuthModal';
import SEO from '@/components/SEO';

const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;

// Dummy data for previewing templates on the selection screen
const dummyData: ResumeData = {
  firstName: "Alex",
  lastName: "Morgan",
  jobTitle: "Product Designer",
  email: "alex@example.com",
  phone: "+1 (234) 567-890",
  address: "456 Design Ave",
  city: "San Francisco",
  country: "CA",
  summary: "Creative Product Designer with 6+ years of experience designing intuitive, user-centered digital products for SaaS, e-commerce, and mobile applications. Skilled in conducting user research, defining design systems, and collaborating with cross-functional teams to deliver pixel-perfect interfaces. Strong believer in data-driven design, accessibility, and seamless product experiences.",
  experience: [
    {
      id: "1",
      jobTitle: "Senior Product Designer",
      employer: "Creative Studio",
      startDate: "2020",
      endDate: "Present",
      location: "New York",
      description: "Led end-to-end product design for web and mobile apps used by 200k+ monthly active users.\nCollaborated with product managers and engineers to define requirements, user journeys, and wireframes.\nCreated a scalable design system that reduced development time by 30%.\nConducted usability tests and implemented improvements that boosted user engagement by 18%."
    },
    {
        id: "2",
        jobTitle: "UX/UI Designer",
        employer: "Tech Corp",
        startDate: "2018",
        endDate: "2020",
        location: "Austin",
        description: "Designed intuitive dashboards and admin interfaces for enterprise clients.\nImproved onboarding flows, reducing drop-off rate by 22%.\nWorked closely with developers to ensure UX consistency across multiple platforms.\nCreated interactive prototypes for stakeholders using Figma and Adobe XD."
    }
  ],
  education: [
    {
      id: "1",
      school: "Design Academy",
      degree: "BFA",
      fieldOfStudy: "Visual Communication",
      startDate: "2014",
      endDate: "2018",
      location: "London"
    }
  ],
  skills: [
    "Figma", "Adobe XD", "Sketch", "Illustrator", "Photoshop",
    "HTML", "CSS", "React basics",
    "Wireframing", "User Research", "Prototyping", "Usability Testing",
    "Design Systems", "Accessibility", "A/B Testing", "Agile Collaboration"
  ],
  certifications: [],
  languages: [],
  achievements: [],
  customSections: [],
  projects: [],
  templateId: 'modern',
  fontFamily: 'Poppins',
  accentColor: '#3b82f6',
  fontSize: 'medium',
  customGaps: {},
};

const Templates: React.FC = () => {
  const { updateField } = useResume();
  const navigate = useNavigate();
  const premiumTemplates = availableTemplates.filter(t => t.isPremium);
const freeTemplates = availableTemplates.filter(t => !t.isPremium);
const [isPricingOpen, setIsPricingOpen] = useState(false);
     const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

const { isSubscribed, loading } = useSubscription();


  // const handleSelectTemplate = (id: string) => {
  //   updateField('templateId', id);
  //   navigate('/builder');
  // };
  const handleSelectTemplate = (id: string) => {
  const template = availableTemplates.find(t => t.id === id);
if (template.isPremium && !isSubscribed) {
                      if (!auth.currentUser) {
                          setIsAuthModalOpen(true);   // <-- ONLY open auth modal
                          return;            // <-- STOP execution
                        }
                      setIsPricingOpen(true)
                      return;
                    }
  updateField('templateId', id);
  navigate('/builder');
};
console.log('Subscription status:', { isSubscribed, loading });

  return (
    <><SEO
  title="Resume Templates"
  description="Choose from professional and modern resume templates designed for recruiters and ATS systems."
  canonical="/templates"
/>

    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-white">
        <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
                onLoginSuccess={() => setIsAuthModalOpen(false)} 
              />
               <PricingModal isOpen={isPricingOpen} onClose={() => { setIsPricingOpen(false); }}  />
        {/* Hero */}
        <section className="bg-navy-900 text-white py-20 relative overflow-hidden">
           {/* Background decoration */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
           <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-600 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>

           <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
              <MotionH1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                Resume <span className="text-blue-400">Templates</span>
              </MotionH1>
              <MotionP 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="text-gray-300 text-lg max-w-4xl mx-auto mb-8 leading-relaxed"
              >
                Choose from 20+ resume template designs with the right format for a resume to highlight your skills. From writing resumes to creating your resume, our intelligent AI cv maker and free resume template builder help you build your resume fast using free resume templates that are ATS‑ready and recruiter‑approved.
              </MotionP>
           </div>
        </section>

        {/* Templates Grid */}
        <section className="py-20 bg-gray-50">
           <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-lg font-bold text-navy-900 mb-4">
              Premium Templates
            </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                 {premiumTemplates.map((template, idx) => {
                    const TemplateComponent = TemplatesMap[template.id];
                    
                    return (
                        <MotionDiv
                           key={template.id}
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ delay: idx * 0.1 }}
                           viewport={{ once: true }}
                           className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                        >
                           {/* Preview Container */}
                           <div className="relative h-[400px] bg-gray-200 overflow-hidden flex justify-center items-start pt-4">
                              {/* Scale Wrapper */}
                              <div className="transform scale-[0.38] origin-top shadow-2xl pointer-events-none select-none">
                                 <TemplateComponent data={dummyData} />
                              </div>
                                    {template.isPremium && (
                          <div className="absolute top-3 left-3 z-50">
                            <span className="px-3 py-1 text-[12px] font-bold 
                                            text-yellow-800 bg-yellow-100 
                                            rounded-full shadow">
                              ⭐ Premium
                            </span>
                          </div>
                        )}
                              {/* Overlay */}
                              <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                 <button 
                                   onClick={() => handleSelectTemplate(template.id)}
                                   className="px-8 py-3 bg-white text-navy-900 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-blue-50 flex items-center gap-2"
                                 >
                                   Use This Template
                                 </button>
                              </div>
                           </div>
                           
                           <div className="p-6 flex-1 flex flex-col border-t border-gray-100">
                              <div className="flex flex-wrap gap-2 mb-3">
                                 {template.tags.map(tag => (
                                   <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                                     {tag}
                                   </span>
                                 ))}
                              </div>
                              <h3 className="text-xl font-bold text-navy-900 mb-2">{template.name}</h3>
                              <p className="text-gray-500 text-sm mb-6 flex-1">{template.description}</p>
                              
                              <button 
                                 onClick={() => handleSelectTemplate(template.id)}
                                 className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-lg text-gray-700 font-medium hover:border-navy-900 hover:text-navy-900 transition-colors group-hover:bg-gray-50"
                              >
                                 Select Template <Icons.ChevronRight size={16} />
                              </button>
                           </div>
                        </MotionDiv>
                    );
                 })}</div><div className="flex items-center gap-4 my-10">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-xs font-bold text-gray-400 uppercase">
                Free Templates
              </span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-4">
              Free Templates
            </h3>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                                   {freeTemplates.map((template, idx) => {
                    const TemplateComponent = TemplatesMap[template.id];
                    
                    return (
                        <MotionDiv
                           key={template.id}
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ delay: idx * 0.1 }}
                           viewport={{ once: true }}
                           className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                        >
                           {/* Preview Container */}
                           <div className="relative h-[400px] bg-gray-200 overflow-hidden flex justify-center items-start pt-4">
                              {/* Scale Wrapper */}
                              <div className="transform scale-[0.38] origin-top shadow-2xl pointer-events-none select-none">
                                 <TemplateComponent data={dummyData} />
                              </div>

                              {/* Overlay */}
                              <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                 <button 
                                   onClick={() => handleSelectTemplate(template.id)}
                                   className="px-8 py-3 bg-white text-navy-900 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-blue-50 flex items-center gap-2"
                                 >
                                   Use This Template
                                 </button>
                              </div>
                           </div>
                           
                           <div className="p-6 flex-1 flex flex-col border-t border-gray-100">
                              <div className="flex flex-wrap gap-2 mb-3">
                                 {template.tags.map(tag => (
                                   <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                                     {tag}
                                   </span>
                                 ))}
                              </div>
                              <h3 className="text-xl font-bold text-navy-900 mb-2">{template.name}</h3>
                              <p className="text-gray-500 text-sm mb-6 flex-1">{template.description}</p>
                              
                              <button 
                                 onClick={() => handleSelectTemplate(template.id)}
                                 className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-lg text-gray-700 font-medium hover:border-navy-900 hover:text-navy-900 transition-colors group-hover:bg-gray-50"
                              >
                                 Select Template <Icons.ChevronRight size={16} />
                              </button>
                           </div>
                        </MotionDiv>
                    );
                 })}
              </div>
           </div>
        </section>
      </main>
      <Footer />
    </div>
    </>
  );
};

export default Templates;