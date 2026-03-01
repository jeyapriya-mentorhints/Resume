import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import React from "react";

const TermsAndConditions: React.FC = () => {
  return (
    <>
      <SEO
        title="Terms and Conditions"
        description="Terms and conditions for using the Mentorhints AI-powered resume builder platform."
        canonical="/terms-and-conditions"
      />

      <Header />

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm px-6 sm:px-10 py-8">
          {/* Page Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>

          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Last updated: 2/2/2026
          </p>

          <p className="text-gray-700 mb-8 leading-relaxed">
            These Terms & Conditions (“Terms”) govern your access to and use of
            the AI-powered resume builder platform operated by Mentorhints
            Software Solutions Pvt Ltd (“Company”, “we”, “our”, or “us”). Please
            read these Terms carefully before using our services.
          </p>

          {/* Content */}
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing, registering, or using our AI-powered resume
                builder, you agree to be bound by these Terms & Conditions and
                our Privacy Policy. If you do not agree with any part of these
                Terms, please discontinue use of the platform immediately.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                2. Eligibility
              </h2>
              <p>
                You must be at least 18 years old to use this service. If you are
                under 18, you may use the platform only with the consent and
                supervision of a parent or legal guardian.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                3. Services Provided
              </h2>
              <p>
                Mentorhints Software Solutions Pvt Ltd provides AI-powered
                resume-building tools, which may include:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>ATS-friendly resume templates</li>
                <li>AI-based resume optimization and suggestions</li>
                <li>Editing, formatting, and export features</li>
              </ul>
              <p className="mt-2">
                Services may be offered under free, freemium, or paid plans. We
                reserve the right to modify, add, or remove features at any
                time.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                4. User Responsibilities
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Use the service only for lawful and personal purposes</li>
                <li>
                  Not misuse, copy, scrape, reverse-engineer, resell, or exploit
                  any part of the platform
                </li>
                <li>
                  Not upload content that is illegal, misleading, offensive, or
                  infringes third-party rights
                </li>
              </ul>
              <p className="mt-2">
                You are solely responsible for the content you create, upload,
                or generate using the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                5. Data Usage & Privacy
              </h2>
              <p>
                We may collect, store, and process personal data to provide,
                operate, and improve our services. All data usage is governed
                by our Privacy Policy, which forms an integral part of these
                Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                6. Intellectual Property Rights
              </h2>
              <p>
                All software, AI models, templates, designs, branding, content,
                and platform functionality are the exclusive intellectual
                property of Mentorhints Software Solutions Pvt Ltd.
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>
                  Users are granted a limited, non-exclusive,
                  non-transferable, revocable license to use the platform
                  solely for personal resume creation
                </li>
                <li>
                  You may not copy, distribute, sublicense, resell, or
                  commercially exploit any part of the service or templates
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                7. Disclaimer of Guarantees
              </h2>
              <p>
                Our AI tools are designed to assist users in resume creation and
                optimization. We do not guarantee:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Job interviews or employment offers</li>
                <li>Recruiter responses or ATS selection</li>
                <li>Career outcomes or salary increases</li>
              </ul>
              <p className="mt-2">
                Results depend on multiple external factors beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                8. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by applicable law, Mentorhints
                Software Solutions Pvt Ltd shall not be liable for any direct,
                indirect, incidental, or consequential damages, including loss
                of employment opportunities, loss of data, or business
                interruption. Use of the service is entirely at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                9. Modifications to Terms or Services
              </h2>
              <p>
                We reserve the right to modify or update these Terms &
                Conditions at any time. Any changes will be effective upon
                posting on this page with an updated revision date. Continued
                use of the platform after changes constitutes acceptance of
                the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                10. Governing Law & Jurisdiction
              </h2>
              <p>
                These Terms & Conditions shall be governed by and construed in
                accordance with the laws of India. Any disputes arising out of
                or relating to these Terms shall be subject to the exclusive
                jurisdiction of the courts in Chennai, Tamil Nadu.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                11. Company Information & Contact
              </h2>
              <p className="space-y-1">
                <span className="block">
                  <strong>Legal Business Name:</strong> Mentorhints Software
                  Solutions Pvt Ltd
                </span>
                <span className="block">
                  <strong>Registered Address:</strong> INNOV8 MILLENIA, 2ND
                  FLOOR, EAST WING, RMZ, MILLENIA BUSINESS PARK, CAMPUS 1A.143,
                  DR.M.G.R. ROAD, N Veeranam Salai, SHOLINGANALLUR, Perungudi,
                  Chennai, Tamil Nadu 600096
                </span>
                <span className="block">
                  <strong>Support Email:</strong> abin@mentorhints.com
                </span>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TermsAndConditions;
