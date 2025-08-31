import React from 'react';
import { Modal } from './ui/modal';
import { Button } from './ui/button';

export function TermsModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms of Service"
      footer={
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      }
    >
      <div className="space-y-4 text-sm text-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Terms and Conditions</h2>
          <p className="text-gray-600">Effective Date: 31 August 2025</p>
        </div>
        
        <p className="mb-4">
          These Terms and Conditions ("Terms") govern your use of the website{' '}
          <a href="https://www.removealist.com.au" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">
            www.removealist.com.au
          </a>{' '}
          (the "Site") operated by Simply Save Australia Pty Ltd (ACN 147 223 461) ("Company", "we", "us", or "our"). 
          By accessing or using this Site, you agree to comply with and be bound by these Terms. If you do not agree, 
          you must immediately discontinue use of the Site.
        </p>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">1. Eligibility</h4>
          <p>
            You must be at least 18 years old to use this Site. By using the Site, you warrant that you are legally 
            capable of entering into a binding contract.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">2. Use of the Site</h4>
          <p className="mb-3">
            You agree to use the Site only for lawful purposes and in accordance with these Terms. You must not:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 mb-4">
            <li>misuse, interfere with, or disrupt the Site,</li>
            <li>attempt to gain unauthorised access to our systems or data,</li>
            <li>submit false, misleading, or fraudulent information,</li>
            <li>use the Site in any way that breaches any applicable law or regulation.</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate your access to the Site at any time if you breach these Terms.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">3. Accounts and Security</h4>
          <p className="mb-3">
            If you create an account, you are responsible for:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 mb-4">
            <li>maintaining the confidentiality of your login details, and</li>
            <li>all activity that occurs under your account.</li>
          </ul>
          <p>
            You must notify us immediately if you suspect any unauthorised use of your account. We are not liable 
            for any loss or damage arising from your failure to protect your account.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">4. Intellectual Property</h4>
          <p className="mb-3">
            All content on the Site, including but not limited to text, graphics, logos, trademarks, software, 
            and data, is the property of Simply Save Australia Pty Ltd or its licensors and is protected under 
            Australian copyright and intellectual property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, display, or use any content from the Site without our 
            prior written consent, except as permitted under Australian law for personal and non-commercial use.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">5. Third-Party Links</h4>
          <p>
            The Site may contain links to third-party websites. We do not endorse, control, or assume any 
            responsibility for these websites. Accessing third-party websites is at your own risk.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">6. Disclaimers</h4>
          <p className="mb-3">
            To the maximum extent permitted by law:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 mb-4">
            <li>The Site and its content are provided on an "as is" and "as available" basis without warranties of any kind.</li>
            <li>We make no representations or guarantees about the accuracy, completeness, reliability, or suitability of the Site or its content.</li>
            <li>We do not guarantee that the Site will be error-free, secure, or uninterrupted.</li>
          </ul>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">7. Limitation of Liability</h4>
          <p className="mb-3">
            To the maximum extent permitted by law, Simply Save Australia Pty Ltd and its directors, officers, 
            employees, and agents will not be liable for any direct, indirect, incidental, special, consequential, 
            or punitive damages arising from your use of the Site, even if we have been advised of the possibility 
            of such damages.
          </p>
          <p>
            Nothing in these Terms excludes or limits liability under the Australian Consumer Law (ACL) where 
            such exclusion or limitation would be unlawful.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">8. Indemnity</h4>
          <p>
            You agree to indemnify and hold harmless Simply Save Australia Pty Ltd and its affiliates from and 
            against all claims, damages, liabilities, costs, or expenses (including legal fees) arising out of 
            your use of the Site, your breach of these Terms, or your violation of any law or the rights of a third party.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">9. Privacy</h4>
          <p>
            Your use of the Site is also governed by our Privacy Policy, which is available at{' '}
            <a href="https://www.removealist.com.au/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">
              www.removealist.com.au/privacy
            </a>
            .
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">10. Termination</h4>
          <p>
            We may suspend or terminate your access to the Site at any time without notice if you breach these Terms. 
            Upon termination, your right to use the Site ceases immediately.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">11. Governing Law</h4>
          <p>
            These Terms are governed by the laws of New South Wales, Australia, and you submit to the exclusive 
            jurisdiction of the courts of New South Wales.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">12. Changes to Terms</h4>
          <p>
            We may update or modify these Terms at any time without prior notice. The updated version will be 
            effective immediately upon posting on the Site. Your continued use of the Site constitutes acceptance 
            of the updated Terms.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 mb-2">13. Contact Us</h4>
          <p className="mb-3">
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-900">Simply Save Australia Pty Ltd (ACN 147 223 461)</p>
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
