import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import React from "react";

const RefundPolicy: React.FC = () => {
  return (
    <>
      <SEO
        title="Refund Policy"
        description="Refund policy for using the Mentorhints AI Resume Maker platform."
        canonical="/refund-policy"
      />

      <Header />

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm px-6 sm:px-10 py-8">
          {/* Page Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Refund Policy
          </h1>

          <p className="text-gray-600 mb-8 text-sm sm:text-base">
            Last updated: 2/2/2026
          </p>

          {/* Content */}
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <p>
                Thank you for choosing our AI Resume Maker. We aim to provide
                high-quality AI-powered tools to help you build ATS-friendly
                resumes quickly and effectively.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                1. Digital Product – No Automatic Refunds
              </h2>
              <p>
                Our product is a digital service that provides instant access to
                AI features, resume generation, and premium tools.
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Once access is granted, refunds are not automatic.</li>
                <li>
                  Usage of AI credits, resume generation, or downloads is
                  considered service delivery.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                2. When Refunds May Be Considered
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Duplicate payment or incorrect charge.</li>
                <li>
                  Technical issues on our side that prevented service usage.
                </li>
                <li>Payment completed but account access not provided.</li>
                <li>
                  Accidental purchase reported within 24 hours with no
                  significant usage.
                </li>
              </ul>
              <p className="mt-2">
                Refund decisions are evaluated on a case-by-case basis.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                3. When Refunds Will Not Be Provided
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>The service has already been used extensively.</li>
                <li>AI resume generations or downloads are completed.</li>
                <li>
                  Dissatisfaction due to personal preferences or expectations.
                </li>
                <li>No interviews or job offers were received.</li>
                <li>Subscription renewal not cancelled in time.</li>
                <li>Free or freemium features were already used.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                4. Subscription Cancellations
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>You may cancel your subscription at any time.</li>
                <li>Cancellation stops future billing only.</li>
                <li>
                  Access remains active until the end of the current billing
                  cycle.
                </li>
                <li>No refunds for unused time.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                5. Chargebacks & Disputes
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Initiating a chargeback without contacting support may result
                  in account suspension.
                </li>
                <li>
                  We reserve the right to dispute chargebacks with supporting
                  evidence.
                </li>
              </ul>
              <p className="mt-2">
                Please contact our support team before raising a dispute.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                6. How to Request a Refund
              </h2>
              <p>
                To request a refund, email us at:
                <br />
                <span className="font-medium">📧 info@mentorhints.com</span>
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Registered email address</li>
                <li>Payment receipt or transaction ID</li>
                <li>Reason for the refund request</li>
              </ul>
              <p className="mt-2">
                We typically respond within 2–3 business days.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                7. Refund Processing Time
              </h2>
              <p>
                Approved refunds are processed to the original payment method.
                Processing time depends on the payment provider and usually
                takes 5–10 business days.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                8. Policy Updates
              </h2>
              <p>
                We reserve the right to update this Refund Policy at any time.
                Changes will be posted on this page with a revised date.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                9. Contact Us
              </h2>
              <p>
                If you have any questions about this policy, please contact us
                at:
                <br />
                <span className="font-medium">📧 abin@mentorhints.com</span>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RefundPolicy;
