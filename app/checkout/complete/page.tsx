"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type BundleKey =
  | "starter_single"
  | "starter_couple"
  | "full_single"
  | "full_couple"
  | "translation";

const PRICES = {
  addons: {
    bank_onboarding: 150,
    gov_e1_single: 89,
    gov_e1_couple: 149,
  },
};

function formatEUR(n: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);
}

export default function PostPurchasePage() {
  const params = useSearchParams();
  const router = useRouter();
  const bundle = (params.get("bundle") || "starter_single") as BundleKey;
  const withGov = params.get("gov") === "1";
  const withBank = params.get("bank") === "1";
  const isStarter = bundle === "starter_single" || bundle === "starter_couple";
  const isCouple = bundle.endsWith("couple");

  // Step flow: 1) Cross-sell Gov/E1 if not bought. 2) Upsell Bank if Starter and not bought.
  const [step, setStep] = useState(1);

  const govPrice = useMemo(() => (isCouple ? PRICES.addons.gov_e1_couple : PRICES.addons.gov_e1_single), [isCouple]);

  useEffect(() => {
    if (!withGov) {
      setStep(1);
    } else if (isStarter && !withBank) {
      setStep(2);
    } else {
      setStep(3);
    }
  }, [withGov, withBank, isStarter]);

  return (
    <main className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Thank you for your purchase!</h1>

        {step === 1 && (
          <section className="bg-white border rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold">Add Gov.gr & E1 Concierge Package</h2>
            <p className="mt-2 text-gray-600">Fast-track your public services and tax setup with our concierge support.</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-medium">One-time</span>
              <span>{formatEUR(govPrice)}</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={() => setStep(isStarter && !withBank ? 2 : 3)}>Add to order</button>
              <button className="px-4 py-2 rounded-md border" onClick={() => setStep(isStarter && !withBank ? 2 : 3)}>No, thanks</button>
            </div>
          </section>
        )}

        {step === 2 && isStarter && (
          <section className="bg-white border rounded-2xl shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold">Upgrade: Bank Account Onboarding</h2>
            <p className="mt-2 text-gray-600">We prepare all documents and guide you to open a bank account in Greece.</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-medium">One-time</span>
              <span>{formatEUR(PRICES.addons.bank_onboarding)}</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={() => setStep(3)}>Add to order</button>
              <button className="px-4 py-2 rounded-md border" onClick={() => setStep(3)}>No, thanks</button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="bg-gray-50 border rounded-2xl p-6 mt-6">
            <h2 className="text-xl font-semibold">All set!</h2>
            <p className="mt-2 text-gray-600">You will receive an email with next steps. You can also manage your order in the dashboard.</p>
            <div className="mt-6 flex gap-3">
              <button className="bg-gray-900 text-white px-4 py-2 rounded-md" onClick={() => router.push("/dashboard")}>Go to Dashboard</button>
              <button className="px-4 py-2 rounded-md border" onClick={() => router.push("/")}>Back to Home</button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

