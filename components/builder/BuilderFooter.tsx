import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { steps } from './stepsConfig';
import { Icons } from '../ui/Icons';
import { useResume } from '../../App';
import { auth } from "../../firebase";


const BuilderFooter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resumeData } = useResume();

  const currentStepIndex = steps.findIndex(step => location.pathname.includes(step.path));
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;
  const isLastStep = activeIndex === steps.length - 1;
  const currentStepId = steps[activeIndex]?.id;


  // Hide the entire footer bar on step 11 (ATS Boost)
  if (isLastStep) {
    return null;
  }

  const saveToDatabase = async () => {
  try {
    if (!resumeData.email && !resumeData.firstName) return;

    const user = auth.currentUser;
    if (!user) {
      console.warn("User not authenticated, skipping save");
      return;
    }

    const token = await user.getIdToken();

    const response = await fetch(
      "https://atsfreeresume.in/api/save-resume.php",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeData),
      }
    );

    if (!response.ok) {
      console.warn("Backend sync failed, state preserved locally.");
    }
  } catch (error) {
    console.error("Error updating database:", error);
  }
};

  const handleBack = () => {
    if (activeIndex > 0) {
      navigate(steps[activeIndex - 1].path);
    }
  };

  const handleNext = async () => {
    if (!isLastStep) {
      // Trigger background save to PHP/MySQL whenever "Next" is clicked
      saveToDatabase();
      window.scrollTo({ top: 0, behavior: "smooth" });
      navigate(steps[activeIndex + 1].path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 xl:right-[450px] bg-white border-t border-gray-200 z-30 transition-all duration-300">
      <div className="flex justify-between items-center p-4 md:px-8 max-w-7xl mx-auto">
        
        <button 
          onClick={handleBack}
          disabled={activeIndex === 0}
          className={`text-gray-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors ${activeIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          Back
        </button>

        <button 
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
        >
          Next Step
          <Icons.ChevronRight size={18} />
        </button>

      </div>
    </div>
  );
};

export default BuilderFooter;