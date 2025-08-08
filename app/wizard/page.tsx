"use client";
import { useWizardStore } from "@/store/wizardStore";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  { id: 0, label: "target_group", question: "Who are you?", options: ["expat", "pensioner", "buyer", "diaspora", "professional"] },
  { id: 1, label: "service", question: "What do you want to do?", options: ["afm", "bank", "translation", "full_service"] },
];

export default function WizardPage() {
  const { step, nextStep, prevStep, setAnswer } = useWizardStore();
  const router = useRouter();

  const progress = Math.round(((step + 1) / steps.length) * 100);

  const handleOption = (opt: string) => {
    setAnswer(steps[step].label, opt);
    if (step < steps.length - 1) nextStep();
    else router.push(`/checkout?bundle=${opt}`);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Top bar for simple branding and back to home */}
      <header className="px-6 py-4 border-b sticky top-0 bg-white z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg tracking-tight text-black subpixel-antialiased leading-none">ELLYTIC</Link>
          <Link className="text-sm text-gray-600 hover:text-black" href="/">Back to home</Link>
        </div>
      </header>

      <motion.section
        className="px-6 py-10 md:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Title & subtitle */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Get Started</h1>
            <p className="mt-2 text-gray-600">Answer a few questions so we can tailor our services.</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Step {step + 1} of {steps.length}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded">
              <div className="h-2 bg-blue-600 rounded" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="bg-white border rounded-2xl shadow-sm p-6 md:p-8"
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-4">{steps[step].question}</h2>
              <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                {steps[step].options.map((opt) => (
                  <motion.button
                    key={opt}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleOption(opt)}
                    className="text-left rounded-xl border hover:border-blue-600 hover:bg-blue-50/50 transition-colors p-4 md:p-5 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900">
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </div>
                      <span className="text-gray-400 group-hover:text-blue-600 transition-colors">→</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {opt === "expat" && "Living or moving to Greece"}
                      {opt === "pensioner" && "Retired and settling administrative needs"}
                      {opt === "buyer" && "Buying property and related services"}
                      {opt === "diaspora" && "Greek abroad handling matters remotely"}
                      {opt === "professional" && "Business, tax or enterprise services"}
                      {opt === "afm" && "Get your AFM (Tax Number) fast"}
                      {opt === "bank" && "Open a bank account with guidance"}
                      {opt === "translation" && "Certified translations done right"}
                      {opt === "full_service" && "End-to-end concierge across services"}
                    </p>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  {step > 0 && (
                    <Button variant="ghost" className="text-gray-600" onClick={prevStep}>
                      ← Back
                    </Button>
                  )}
                </div>
                <div className="text-sm text-gray-500">We never share your answers.</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>
    </main>
  );
}