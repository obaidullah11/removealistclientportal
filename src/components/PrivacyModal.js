import React from 'react';
import { Modal } from './ui/modal';
import { Button } from './ui/button';

export function PrivacyModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy Policy"
      footer={
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      }
    >
      <div className="space-y-4 text-sm text-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Privacy Policy – RemoveAlist</h2>
          <p className="text-gray-600">Effective Date: 31 August 2025</p>
        </div>
        
        <p className="mb-4">
          Thank you for choosing to be part of our community at Simply Save Australia Pty Ltd (ACN 147 223 461) 
          ("Company", "we", "us", "our"). We are committed to protecting your personal information and your right 
          to privacy in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
        </p>

        <p className="mb-4">
          If you have any questions or concerns about this privacy policy, or our practices with regard to your 
          personal information, please contact us at{' '}
          <a href="mailto:contactus@removealist.au" className="text-primary-600 hover:text-primary-700 font-medium">
            contactus@removealist.au
          </a>
        </p>

        <p className="mb-4">
          This privacy policy applies to all personal information collected through our website{' '}
          <a href="https://www.removealist.com.au" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">
            www.removealist.com.au
          </a>{' '}
          (the "Site") and any related services, sales, marketing, or events (collectively, the "Services").
        </p>

        <p className="mb-6">
          Please read this privacy policy carefully as it will help you understand how we handle your information.
        </p>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">1. What Information Do We Collect?</h4>
          <h5 className="font-medium text-gray-800 mb-2">Personal information you provide to us</h5>
          <p className="mb-3">
            We collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 mb-4">
            <li>register an account on our Site,</li>
            <li>contact us for support or inquiries,</li>
            <li>subscribe to our updates or marketing, or</li>
            <li>participate in any interactive features such as surveys, promotions, or competitions.</li>
          </ul>
          
          <p className="mb-3">The personal information we may collect includes:</p>
          <ul className="list-disc list-inside ml-4 space-y-1 mb-4">
            <li>your name,</li>
            <li>email address,</li>
            <li>login details (username and password),</li>
            <li>contact details, and</li>
            <li>any other information you choose to provide.</li>
          </ul>
          
          <p className="mb-4">
            You must ensure that any personal information you provide is accurate and up to date.
          </p>

          <h5 className="font-medium text-gray-800 mb-2">Information automatically collected</h5>
          <p className="mb-3">
            When you visit our Site, we automatically collect certain information including:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 mb-4">
            <li>your Internet Protocol (IP) address,</li>
            <li>browser type and version,</li>
            <li>operating system,</li>
            <li>referring website,</li>
            <li>date and time of access,</li>
            <li>pages viewed and interactions on the Site.</li>
          </ul>
          
          <p>
            This information does not usually identify you personally but helps us improve the performance 
            and security of our Site.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">2. How Do We Use Your Information?</h4>
          <p className="mb-3">
            We use the personal information we collect for purposes including to:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 mb-4">
            <li>provide and manage our Services,</li>
            <li>process account registrations,</li>
            <li>communicate with you, including responding to inquiries and sending service updates,</li>
            <li>administer promotions, surveys or competitions,</li>
            <li>send you marketing communications where you have consented or where permitted by law,</li>
            <li>protect our Site and Services from fraud or misuse,</li>
            <li>comply with legal obligations.</li>
          </ul>
          
          <p>
            You may opt-out of receiving marketing communications at any time by following the unsubscribe 
            instructions in our emails or contacting us directly.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">3. Will Your Information Be Shared With Anyone?</h4>
          <p className="mb-3">
            We may disclose your personal information:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 mb-4">
            <li>to our trusted service providers who assist us in operating our Site and Services,</li>
            <li>if required by law, such as in response to a court order or regulatory authority,</li>
            <li>in connection with a business transfer, merger, or sale,</li>
            <li>where disclosure is necessary to prevent or investigate unlawful activity or protect the rights, property, or safety of any person.</li>
          </ul>
          
          <p>
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">4. How Long Do We Keep Your Information?</h4>
          <p>
            We will retain your personal information only for as long as necessary to fulfil the purposes 
            for which it was collected, or as required by law. When no longer needed, we will securely 
            destroy or de-identify your information.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">5. How Do We Keep Your Information Safe?</h4>
          <p>
            We use appropriate technical and organisational measures to protect personal information against 
            unauthorised access, use, alteration, or disclosure. However, no method of transmission over 
            the internet or electronic storage is completely secure.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">6. Do We Collect Information From Minors?</h4>
          <p>
            Our Services are intended for individuals aged 18 and over. We do not knowingly collect 
            personal information from children under 18. If we become aware that we have inadvertently 
            collected information from a minor, we will take reasonable steps to delete it.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">7. What Are Your Privacy Rights?</h4>
          <p className="mb-3">
            Under the Privacy Act 1988 (Cth), you have the right to:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 mb-4">
            <li>request access to the personal information we hold about you,</li>
            <li>request correction of any inaccurate or outdated personal information, and</li>
            <li>make a complaint if you believe we have breached the APPs.</li>
          </ul>
          
          <p className="mb-4">
            To exercise these rights, please contact us at{' '}
            <a href="mailto:contactus@removealist.au" className="text-primary-600 hover:text-primary-700 font-medium">
              contactus@removealist.au
            </a>
            .
          </p>
          
          <p className="mb-4">
            We will respond to access and correction requests within a reasonable timeframe, usually within 30 days.
          </p>
          
          <p>
            If you are not satisfied with our response to a privacy complaint, you may contact the Office 
            of the Australian Information Commissioner (OAIC) via{' '}
            <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">
              www.oaic.gov.au
            </a>
            .
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">8. Do-Not-Track Features</h4>
          <p>
            Some web browsers offer a "Do Not Track" feature. At present, we do not respond to such 
            signals as there is no industry standard in place.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">9. Updates to This Privacy Policy</h4>
          <p>
            We may update this privacy policy from time to time to reflect changes to our practices 
            or legal obligations. The updated version will be effective when published on our Site, 
            with the revised date shown at the top of this page.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">10. How Can You Contact Us?</h4>
          <p className="mb-3">
            If you have any questions or concerns about this privacy policy or our handling of your 
            personal information, please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-900">Simply Save Australia Pty Ltd</p>
            <p className="text-gray-700">
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
    </Modal>
  );
}
