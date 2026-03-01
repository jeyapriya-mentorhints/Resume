import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PricingModal from '../components/PricingModal';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';

const Pricing: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    // Set plan as active in local state for this session
    localStorage.setItem('hasPlan', 'true');
    setIsModalOpen(false);
    // Navigate directly to success page instead of intermediate ATS pages
    setTimeout(() => navigate('/success'), 300);
  };

  // Re-open modal if user stays on page (just for this visual wrapper page)
  useEffect(() => {
    if (!isModalOpen) {
       // optional: logic to redirect if modal is closed
    }
  }, [isModalOpen]);

  return (
    <><SEO
  title="Resume Builder Pricing"
  description="Affordable pricing for premium ATS resume templates."
  canonical="/pricing"
  ogImage="/og/pricing.png"
/>


    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 relative">
        {/* Background Content (Blurred) */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20 blur-sm"></div>
        
        <div className="relative z-10 h-full flex items-center justify-center p-4">
           {/* We render the modal directly here */}
           <PricingModal isOpen={isModalOpen} onClose={handleClose} onContinue={handleClose} />
        </div>
      </main>
    </div></>
  );
};

export default Pricing;