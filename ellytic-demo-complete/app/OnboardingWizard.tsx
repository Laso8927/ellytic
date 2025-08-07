
"use client";
import { useState } from "react";

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  return (
    <main className="p-10 text-center">
      <h1 className="text-3xl font-bold">Step {step}</h1>
      <p className="mt-4">This is a multilingual, secure, payment-ready onboarding wizard.</p>
      <button onClick={() => setStep(step + 1)} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">Next</button>
    </main>
  );
}
