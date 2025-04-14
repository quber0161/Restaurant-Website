/* eslint-disable no-unused-vars */
import React from "react";
import "./PrivacyPolicy.css"

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        At <strong>Sandvika Kjøttsenter</strong>, we value your privacy and are committed to protecting your personal information.
      </p>
      <h2 className="text-xl font-semibold mt-4 mb-2">Information We Collect</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Your name and contact information when placing an order</li>
        <li>Payment information (handled securely through our payment provider)</li>
        <li>Browsing data when visiting our website</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">How We Use It</h2>
      <p className="mb-4">
        We use your data to fulfill your orders, improve our services, and contact you if needed regarding your purchases.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Your Rights</h2>
      <p>
        You have the right to request, update, or delete your data at any time. For any concerns, contact us at: <a href="mailto:sandvika.kjottsenter@gmail.com" className="text-blue-500 underline">sandvika.kjottsenter@gmail.com</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
