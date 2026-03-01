import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <><SEO
  title="Privacy Policy"
  description="Read the privacy policy of ATS Free Resume and learn how we protect your data."
  canonical="/privacy-policy"
/>
<Header/>
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm px-6 sm:px-10 py-8">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          Privacy Policy
        </h1>

        <p className="text-gray-600 mb-8 text-sm sm:text-base">
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your personal data.
        </p>

        {/* Content */}
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              1. Introduction
            </h2>
            <p>
              We respect your privacy and are committed to protecting your
              personal data in compliance with the Digital Personal Data
              Protection Act, 2023 and the Information Technology Act, 2000.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              2. Data Collected
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Personal details (name, email, phone number, resume content).
              </li>
              <li>
                Usage data (templates selected, optimization preferences).
              </li>
              <li>
                Technical data (IP address, browser type, device information).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              3. Purpose of Data Collection
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and improve resume-building services.</li>
              <li>To personalize the user experience.</li>
              <li>To enhance AI algorithms and ATS optimization.</li>
              <li>To comply with legal and regulatory obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              4. Data Sharing
            </h2>
            <p>
              We do not sell your personal data. Information may be shared with
              trusted third-party service providers for analytics, hosting, or
              compliance purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              5. Data Retention
            </h2>
            <p>
              Personal data is retained only for as long as necessary to fulfill
              the stated purposes or as required under applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              6. User Rights (as per DPDP Act, 2023)
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Right to access your personal data.</li>
              <li>Right to correction and erasure.</li>
              <li>Right to withdraw consent.</li>
              <li>Right to grievance redressal.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              7. Security Measures
            </h2>
            <p>
              We implement reasonable security practices under Rule 8 of the IT
              (Reasonable Security Practices and Procedures) Rules, 2011,
              including encryption, secure storage, and restricted access.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              8. Consent
            </h2>
            <p>
              By using our service, you consent to the collection and processing
              of your personal data as outlined in this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              9. Contact & Grievance Officer
            </h2>
            <p>
              For any questions or concerns regarding this policy, please
              contact our designated Grievance Officer:
              <br />
              <span className="font-medium">Email:</span> info@mentorhints.com
              <br />
              <span className="font-medium">Address:</span>  INNOVB MILLENIA, 2ND FLOOR, EAST WING, RMZ, MILLENIA BUSINESS PARK, CAMPUS 1A, NO.143. DR.M.G.R. ROAD. (NORTH VEERANAM SALAI), PERUNGUDI.SHOLINGANALLUR, CHENNAI-600096
            </p>
          </section>
        </div>
      </div>
     
    </div> <Footer/></>
  );
};

export default PrivacyPolicy;
