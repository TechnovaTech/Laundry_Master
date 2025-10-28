import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <header className="px-4 sm:px-6 py-4 flex items-center gap-4 shadow-lg sticky top-0 z-10" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
        <button onClick={() => navigate(-1)} className="text-white">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-white">Privacy Policy</h1>
      </header>

      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="prose prose-sm sm:prose max-w-none text-gray-700 space-y-4">
            <section>
              <p className="text-sm sm:text-base leading-relaxed mb-4">
                Urban Steam ("we," "our," or "us") is committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your information when you use our mobile application and services (collectively, the "Services").
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-black mb-2">1. Information We Collect</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-2">
                We collect information to provide and improve our Services:
              </p>
              <div className="space-y-2 text-sm sm:text-base leading-relaxed">
                <p>a) <strong>Personal Information:</strong> Such as your name, phone number, email address, and physical address when you create an account or place an order.</p>
                <p>b) <strong>Order Information:</strong> Details of the services you request and your service history.</p>
                <p>c) <strong>Location Data:</strong> To facilitate the pickup and delivery of your garments.</p>
                <p>d) <strong>Payment Information:</strong> We use third-party payment processors (like Razorpay). We do not store your full payment card details on our servers.</p>
                <p>e) <strong>Automated Information:</strong> We use cookies and similar tracking technologies to collect data about your device and your interaction with our App.</p>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-black mb-2">2. How We Use Your Information</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-2">
                We use the information we collect for the following purposes:
              </p>
              <div className="space-y-2 text-sm sm:text-base leading-relaxed">
                <p>a) To create, manage, and secure your account.</p>
                <p>b) To process your orders, arrange pickups and deliveries, and process payments.</p>
                <p>c) To communicate with you about your orders, promotions, and updates.</p>
                <p>d) To analyze and improve our App and Services.</p>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-black mb-2">3. Information Sharing and Disclosure</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-2">
                We do not sell your personal data. We may share your information in the following limited circumstances:
              </p>
              <div className="space-y-2 text-sm sm:text-base leading-relaxed">
                <p>a) With our delivery partners to fulfil pickup and delivery.</p>
                <p>b) With our payment processors to complete your transactions.</p>
                <p>c) Where required by law or to protect our rights and the safety of our users.</p>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-black mb-2">4. Cookie Policy</h2>
              <div className="space-y-3 text-sm sm:text-base leading-relaxed">
                <div>
                  <p><strong>a) What are Cookies?</strong> Cookies are small text files stored on your device when you use our App. They help us remember your preferences and understand how you use our Services.</p>
                </div>
                <div>
                  <p><strong>b) Why We Use Cookies:</strong> We use cookies for essential functions like user authentication, session management, and to remember your login details. We also use analytical cookies to understand user behavior and improve our App's performance.</p>
                </div>
                <div>
                  <p><strong>c) Your Control:</strong> Most devices allow you to disable cookies through your settings. However, disabling essential cookies may affect the core functionality of the App.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-black mb-2">5. Data Security</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                We implement reasonable administrative, technical, and physical security measures designed to protect your personal information from unauthorized access, loss, or alteration.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-black mb-2">6. Your Rights</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                You have the right to access, correct, or update the personal information in your account profile at any time. If you wish to delete your account, please contact us at <a href="mailto:support@urbansteam.in" className="text-blue-600 hover:underline">support@urbansteam.in</a>.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-black mb-2">7. Changes to This Policy</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-black mb-2">8. Contact Us</h2>
              <p className="text-sm sm:text-base leading-relaxed">
                For any questions about this Privacy Policy or your data, please contact us at:
              </p>
              <p className="text-sm sm:text-base leading-relaxed font-medium mt-2">
                Email: <a href="mailto:support@urbansteam.in" className="text-blue-600 hover:underline">support@urbansteam.in</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;