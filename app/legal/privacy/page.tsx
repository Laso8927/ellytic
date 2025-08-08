export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-4xl mx-auto prose prose-gray">
        <h1>Privacy & Data Protection (GDPR)</h1>
        <p>
          We operate exclusively within Germany (BRD) and comply with EU law and the General Data Protection Regulation (GDPR).
          Your data is processed and stored securely in the EU. After fulfilment of the purchase and completion of the service,
          we delete personal data after 30 days. We retain only metadata that is legally required for accounting and compliance,
          including name, contact details and payment records of the service performed.
        </p>
        <h2>Key Principles</h2>
        <ul>
          <li>GDPR-compliant processing within the EU (Germany).</li>
          <li>Data minimisation: we collect only what is necessary for the service.</li>
          <li>Retention: deletion of personal data 30 days after completion.</li>
          <li>Security: encryption in transit and at rest, strict access controls.</li>
          <li>Transparency: you can request access, rectification and erasure.</li>
        </ul>
        <h2>Contact</h2>
        <p>For privacy requests, please use the contact form on our website or contact our data protection officer at: privacy@ellytic.com.</p>
      </div>
    </main>
  );
}

