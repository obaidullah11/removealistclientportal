import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-600">Effective Date: 31 August 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose max-w-none">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy Policy – RemoveAlist</h2>
              <p className="text-gray-600">Effective Date: 31 August 2025</p>
            </div>
            
            <p className="mb-6 text-gray-700">
              Thank you for choosing to be part of our community at Simply Save Australia Pty Ltd (ACN 147 223 461) 
              ("Company", "we", "us", "our"). We are committed to protecting your personal information and your right 
              to privacy in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
            </p>

            <p className="mb-6 text-gray-700">
              If you have any questions or concerns about this privacy policy, or our practices with regard to your 
              personal information, please contact us at{' '}
              <a href="mailto:contactus@removealist.au" className="text-primary-600 hover:text-primary-700 font-medium">
                contactus@removealist.au
              </a>
            </p>

            <p className="mb-6 text-gray-700">
              This privacy policy applies to all personal information collected through our website{' '}
              <a href="https://www.removealist.com.au" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">
                www.removealist.com.au
              </a>{' '}
              (the "Site") and any related services, sales, marketing, or events (collectively, the "Services").
            </p>

            <p className="mb-8 text-gray-700">
              Please read this privacy policy carefully as it will help you understand how we handle your information.
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. What Information Do We Collect?</h2>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Personal information you provide to us</h3>
              <p className="mb-4 text-gray-700">
                We collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2 mb-6 text-gray-700">
                <li>register an account on our Site,</li>
                <li>contact us for support or inquiries,</li>
                <li>subscribe to our updates or marketing, or</li>
                <li>participate in any interactive features such as surveys, promotions, or competitions.</li>
              </ul>
              
              <p className="mb-4 text-gray-700">The personal information we may collect includes:</p>
              <ul className="list-disc list-inside ml-6 space-y-2 mb-6 text-gray-700">
                <li>your name,</li>
                <li>email address,</li>
                <li>login details (username and password),</li>
                <li>contact details, and</li>
                <li>any other information you choose to provide.</li>
              </ul>
              
              <p className="mb-6 text-gray-700">
                You must ensure that any personal information you provide is accurate and up to date.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mb-3">Information automatically collected</h3>
              <p className="mb-4 text-gray-700">
                When you visit our Site, we automatically collect certain information including:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2 mb-6 text-gray-700">
                <li>your Internet Protocol (IP) address,</li>
                <li>browser type and version,</li>
                <li>operating system,</li>
                <li>referring website,</li>
                <li>date and time of access,</li>
                <li>pages viewed and interactions on the Site.</li>
              </ul>
              
              <p className="text-gray-700">
                This information does not usually identify you personally but helps us improve the performance 
                and security of our Site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How Do We Use Your Information?</h2>
              <p className="mb-4 text-gray-700">
                We use the personal information we collect for purposes including to:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2 mb-6 text-gray-700">
                <li>provide and manage our Services,</li>
                <li>process account registrations,</li>
                <li>communicate with you, including responding to inquiries and sending service updates,</li>
                <li>administer promotions, surveys or competitions,</li>
                <li>send you marketing communications where you have consented or where permitted by law,</li>
                <li>protect our Site and Services from fraud or misuse,</li>
                <li>comply with legal obligations.</li>
              </ul>
              
              <p className="text-gray-700">
                You may opt-out of receiving marketing communications at any time by following the unsubscribe 
                instructions in our emails or contacting us directly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Will Your Information Be Shared With Anyone?</h2>
              <p className="mb-4 text-gray-700">
                We may disclose your personal information:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2 mb-6 text-gray-700">
                <li>to our trusted service providers who assist us in operating our Site and Services,</li>
                <li>if required by law, such as in response to a court order or regulatory authority,</li>
                <li>in connection with a business transfer, merger, or sale,</li>
                <li>where disclosure is necessary to prevent or investigate unlawful activity or protect the rights, property, or safety of any person.</li>
              </ul>
              
              <p className="text-gray-700">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. How Long Do We Keep Your Information?</h2>
              <p className="text-gray-700">
                We will retain your personal information only for as long as necessary to fulfil the purposes 
                for which it was collected, or as required by law. When no longer needed, we will securely 
                destroy or de-identify your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. How Do We Keep Your Information Safe?</h2>
              <p className="text-gray-700">
                We use appropriate technical and organisational measures to protect personal information against 
                unauthorised access, use, alteration, or disclosure. However, no method of transmission over 
                the internet or electronic storage is completely secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Do We Collect Information From Minors?</h2>
              <p className="text-gray-700">
                Our Services are intended for individuals aged 18 and over. We do not knowingly collect 
                personal information from children under 18. If we become aware that we have inadvertently 
                collected information from a minor, we will take reasonable steps to delete it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. What Are Your Privacy Rights?</h2>
              <p className="mb-4 text-gray-700">
                Under the Privacy Act 1988 (Cth), you have the right to:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2 mb-6 text-gray-700">
                <li>request access to the personal information we hold about you,</li>
                <li>request correction of any inaccurate or outdated personal information, and</li>
                <li>make a complaint if you believe we have breached the APPs.</li>
              </ul>
              
              <p className="mb-6 text-gray-700">
                To exercise these rights, please contact us at{' '}
                <a href="mailto:contactus@removealist.au" className="text-primary-600 hover:text-primary-700 font-medium">
                  contactus@removealist.au
                </a>
                .
              </p>
              
              <p className="mb-6 text-gray-700">
                We will respond to access and correction requests within a reasonable timeframe, usually within 30 days.
              </p>
              
              <p className="text-gray-700">
                If you are not satisfied with our response to a privacy complaint, you may contact the Office 
                of the Australian Information Commissioner (OAIC) via{' '}
                <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">
                  www.oaic.gov.au
                </a>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Do-Not-Track Features</h2>
              <p className="text-gray-700">
                Some web browsers offer a "Do Not Track" feature. At present, we do not respond to such 
                signals as there is no industry standard in place.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Updates to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update this privacy policy from time to time to reflect changes to our practices 
                or legal obligations. The updated version will be effective when published on our Site, 
                with the revised date shown at the top of this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. How Can You Contact Us?</h2>
              <p className="mb-4 text-gray-700">
                If you have any questions or concerns about this privacy policy or our handling of your 
                personal information, please contact us at:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-medium text-gray-900 mb-2">Simply Save Australia Pty Ltd</p>
                <p className="text-gray-700 mb-2">
                  Email: <a href="mailto:contactus@removealist.au" className="text-primary-600 hover:text-primary-700 font-medium">
                    contactus@removealist.au
                  </a>
                </p>
                <p className="text-gray-700">
                  Website: <a href="https://www.removealist.com.au" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">
                    www.removealist.com.au
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
