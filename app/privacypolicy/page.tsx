export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            EGR: Data Safety & Privacy
          </h1>
          <p className="text-lg text-gray-600">
            Your Data is Safe with Us. At Global Classrooms, we understand that
            the privacy and security of your data—and your students’ data—is of
            the utmost importance.
          </p>
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Minimal Data Collection
            </h2>
            <p className="text-gray-700">
              We only collect the information necessary for students and
              teachers to participate in projects, collaborate, and receive
              rewards. No unnecessary data is ever requested.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Strong Encryption
            </h2>
            <p className="text-gray-700">
              All sensitive data (like passwords and wallet addresses) is
              encrypted using industry-standard methods. Even if someone
              accessed our database, they could not read your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Password Security
            </h2>
            <p className="text-gray-700">
              Passwords are never stored in plain text. We use secure password
              hashing, so even our team cannot see your password.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Secure Connections
            </h2>
            <p className="text-gray-700">
              All communication between your device and our servers is protected
              by HTTPS encryption, preventing eavesdropping or interception.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Student Privacy
            </h2>
            <p className="text-gray-700">
              Student profiles are private by default. Only first names or
              pseudonyms are shown in public areas. No sensitive student
              information is ever shared or made public.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Legal Compliance
            </h2>
            <p className="text-gray-700">
              We comply with all relevant privacy laws, including GDPR (for data
              protection) and COPPA (for children’s privacy), to ensure the
              highest standards of safety for minors and all users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. User Control
            </h2>
            <p className="text-gray-700">
              You (or your students’ guardians) can request to export or delete
              your data at any time. You are always in control of your
              information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. No Data Selling or Sharing
            </h2>
            <p className="text-gray-700">
              We never sell or share your data with third parties for marketing
              or advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Questions?
            </h2>
            <p className="text-gray-700">
              If you have any questions or concerns about data safety, please
              contact us at{" "}
              <a
                href="mailto:yair@homebiogas.com"
                className="text-green-600 hover:underline"
              >
                yair@homebiogas.com
              </a>
              . Global Classrooms is committed to providing a safe, secure, and
              empowering environment for all users. Your trust is our top
              priority.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
