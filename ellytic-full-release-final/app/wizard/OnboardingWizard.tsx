
"use client";
import { useState } from "react";

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  return (
    <main className="p-10 text-center">
      <h1 className="text-3xl font-bold">Wizard – Step {step}</h1>
      <button onClick={() => setStep(step + 1)} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">Next</button>
    </main>
  );
}
