
import React from 'react';
import { useResume } from '../../../App';
import { useNavigate } from 'react-router-dom';

const HeaderStep: React.FC = () => {
  const { resumeData, updateField } = useResume();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-navy-900 mb-2">Personal Information</h2>
        <p className="text-gray-500">Add your info so recruiters can easily reach you</p>
      </div>

      {/* Best Practice Banner */}
      <div className="flex items-center gap-3 mb-8">
         <span className="bg-navy-900 text-white text-xs font-bold px-2 py-1 rounded-sm">Best practice</span>
         <span className="text-sm text-gray-500">Ensure your contact details are up to date and professional.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* First Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">First name</label>
          <input 
            type="text" 
            value={resumeData.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all font-medium text-gray-900"
            placeholder="e.g. John"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Last name</label>
          <input 
            type="text" 
            value={resumeData.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all font-medium text-gray-900"
            placeholder="e.g. Doe"
          />
        </div>

        {/* Job Title */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Job Title</label>
          <input 
            type="text" 
            value={resumeData.jobTitle}
            onChange={(e) => updateField('jobTitle', e.target.value)}
            className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all font-medium text-gray-900"
            placeholder="e.g. Software Engineer"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Phone number</label>
          <input 
            type="tel" 
            value={resumeData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all font-medium text-gray-900"
            placeholder="Enter your number"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            value={resumeData.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all font-medium text-gray-900"
            placeholder="Enter your email"
          />
        </div>
        
        {/* Address */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Full Address</label>
          <input 
            type="text" 
            value={resumeData.address}
            onChange={(e) => updateField('address', e.target.value)}
            className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all font-medium text-gray-900"
            placeholder="123 Main St, Apt 4B"
          />
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">City</label>
          <input 
            type="text" 
            value={resumeData.city}
            onChange={(e) => updateField('city', e.target.value)}
            className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all font-medium text-gray-900"
            placeholder="e.g. New York"
          />
        </div>

        {/* Country */}
         <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Country/Pincode</label>
          <input 
            type="text" 
            value={resumeData.country}
            onChange={(e) => updateField('country', e.target.value)}
            className="w-full px-4 py-3.5 rounded-lg bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all font-medium text-gray-900"
            placeholder="India"
          />
        </div>
      </div>

      <div className="mt-8 flex gap-6">
         <button className="text-navy-900 font-semibold text-sm border-b border-navy-900 pb-0.5 hover:opacity-80">+Add linkedin profile</button>
         <button className="text-navy-900 font-semibold text-sm border-b border-navy-900 pb-0.5 hover:opacity-80">+Add portfolio</button>
      </div>

    </div>
  );
};

export default HeaderStep;
