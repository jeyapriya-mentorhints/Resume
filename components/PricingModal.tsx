import React, { useState } from 'react';
import { Icons } from './ui/Icons';
import { motion, AnimatePresence, warning } from 'framer-motion';
import { auth } from '../firebase'; // adjust path if needed


const MotionDiv = motion.div as any;

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Added optional onContinue callback to support flows where closing the modal triggers the next step
  onContinue?: () => void;
}

const plans = [
  {
    id: 'day',
    title: 'Starter Pack / 1 Day Access',
    price: '₹99',
    warning:null,
    subtitle: 'Perfect for urgent applications',
    isPopular: false
  },
  {
    id: 'month',
    title: 'Monthly Pack',
    price: '₹249',
    warning:null,
    subtitle: 'Unlimited resumes & downloads',
    isPopular: false
  },
  {
    id: 'year',
    title: 'Yearly Pack',
    price: '₹2499',
    warning:null,
    subtitle: 'Best value for job seekers',
    isPopular: false
  },
  {
    id: 'lifetime',
    title: 'Lifetime Pack',
    price: '₹4999',
    warning:null,
    subtitle: 'Full access forever',
    isPopular: true
  }
  
];


const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onContinue }) => {
  const [selectedPlan, setSelectedPlan] = useState<'day' | 'month' | 'year' | 'lifetime'>('lifetime');


  if (!isOpen) return null;
//   const startPayment = async () => {
//   try {
//     const user = auth.currentUser;
//     if (!user) {
//       alert("Please login to continue");
//       return;
//     }

//     const token = await user.getIdToken();

//     const res = await fetch("https://atsfreeresume.in/api/start-billing.php", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ plan: selectedPlan }),
//     });

//     const order = await res.json();

//     const options = {
//       // key: "rzp_test_S3GvowCnVac7bq", // replace with real key
//       key:"rzp_live_S3Fx0xFwj2WQFN" ,
//       amount: order.amount,
//       currency: "INR",
//       order_id: order.id,
//       name: "ATS Free Resume",
//       description: "Resume Subscription",
//       handler: async function (response: any) {
//         await verifyPayment(response, token);
//       },
//       theme: {
//         color: "#2563eb",
//       },
//     };

//     new (window as any).Razorpay(options).open();
//   } catch (err) {
//     console.error("Payment initiation failed", err);
//     alert("Unable to start payment. Please try again.");
//   }
// };

const startPayment = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to continue");
      return;
    }

    const token = await user.getIdToken();

    const res = await fetch("https://atsfreeresume.in/api/start-billing.php", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan: selectedPlan }),
    });

    const data = await res.json();
    console.log("Billing response:", data);

    // 🔵 CASE 1 — SUBSCRIPTION (MONTH/YEAR)
    if (data.type === "subscription") {

      const options = {
        key: "rzp_live_SGMtngUaatQied",// replace with real key
        // key: "rzp_test_SGMsyR4oW70BIX",
        subscription_id: data.id,
        name: "ATS Free Resume",
        description: "Auto Renewal Subscription",
        handler: async function (response: any) {
          await verifySubscription(response, token);
        },
        theme: {
          color: "#2563eb",
        },
      };

      new (window as any).Razorpay(options).open();
      return;
    }

    // 🟢 CASE 2 — ONE TIME (DAY / LIFETIME)
    const options = {
      // key: "rzp_live_S3Fx0xFwj2WQFN", // replace with real key
      key: "rzp_live_SGMtngUaatQied",
      amount: data.amount,
      currency: "INR",
      order_id: data.id,
      name: "ATS Free Resume",
      description: "Resume Subscription",
      handler: async function (response: any) {
        await verifyPayment(response, token);
      },
      theme: {
        color: "#2563eb",
      },
    };

    new (window as any).Razorpay(options).open();

  } catch (err) {
    console.error("Payment initiation failed", err);
    alert("Unable to start payment. Please try again.");
  }
};
const verifySubscription = async (response: any, token: string) => {
  await fetch("https://atsfreeresume.in/api/verify-subscription.php", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      razorpay_subscription_id: response.razorpay_subscription_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      plan: selectedPlan,
    }),
  });
  
  onClose();
};

const verifyPayment = async (response: any, token: string) => {
  await fetch("https://atsfreeresume.in/api/verify-payment.php", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
      plan: selectedPlan, // 🔴 THIS WAS MISSING
    }),
  });

  onClose();
};


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 font-sans">
          {/* Backdrop */}
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10 transition-colors bg-white/50 rounded-full p-1"
            >
              <Icons.X size={20} />
            </button>

            <div className="px-6 py-8 md:px-8 md:py-10">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-[#0f172a] mb-5 tracking-tight">
                  Make It <span className="text-[#3b82f6]">ATS Friendly</span>
                </h2>
                
                <div className="bg-[#ecfdf5] border border-[#d1fae5] rounded-full py-2.5 px-4 inline-flex items-center gap-2.5 text-[#047857] text-[11px] md:text-xs font-bold shadow-sm leading-tight max-w-[95%]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                  <span className="text-left">75% of people get hired faster with an ATS-friendly resume</span>
                </div>
              </div>

              {/* Plans */}
              <div className="space-y-4">
                {plans
                .filter(plan => plan.id !== 'day')
                .map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  
                  return (
                    <div 
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-200 p-4 flex items-start gap-4 group
                        ${isSelected 
                            ? 'bg-[#eff6ff] border-[#3b82f6] shadow-md ring-1 ring-blue-100'
                            : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                        }
                      `}
                    >
                      {plan.id==="year" && (
                        <div className="absolute -top-3 right-0 rounded-tl-lg rounded-bl-lg rounded-tr-lg bg-[#E74C3C] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider shadow-md flex items-center gap-1 transform translate-x-2">
                           <Icons.Sparkles size={10} fill="currentColor" /> 30% Discount
                        </div>
                      )}
                      {/* Most Popular Badge */}
                      {plan.isPopular && (
                        <div className="absolute -top-3 right-0 rounded-tl-lg rounded-bl-lg rounded-tr-lg bg-[#3b82f6] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider shadow-md flex items-center gap-1 transform translate-x-2">
                           <Icons.Sparkles size={10} fill="currentColor" /> MOST POPULAR
                        </div>
                      )}

                      {/* Radio Circle */}
                      <div className={`mt-1 w-6 h-6 rounded-full border-[2.5px] flex items-center justify-center flex-shrink-0 transition-colors
                        ${isSelected ? 'border-[#3b82f6]' : 'border-gray-200 group-hover:border-gray-300'}
                      `}>
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-center mb-0.5">
                             <h3 className="font-bold text-[#0f172a] text-[15px]">{plan.title}</h3>
                             <span className="font-bold text-[#0f172a] text-[15px] ml-2">{plan.price}</span>
                         </div>
                         
                         <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{plan.subtitle}</p>

                         {plan.warning && (
                           <div className="mt-2.5 inline-flex items-center gap-1.5 bg-[#fef2f2] text-[#dc2626] px-2.5 py-1 rounded-md text-[10px] font-bold border border-[#fee2e2]">
                             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                               <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                               <line x1="12" y1="9" x2="12" y2="13"></line>
                               <line x1="12" y1="17" x2="12.01" y2="17"></line>
                             </svg>
                             {plan.warning}
                           </div>
                         )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue Button */}
              <div className="mt-8">
                <button  onClick={startPayment}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] outline-none focus:ring-4 focus:ring-blue-200"
                >
                  Continue
                </button>
              </div>
            </div>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PricingModal;