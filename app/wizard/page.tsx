"use client";
import { useWizardStore } from "@/store/wizardStore";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

const steps = [
  { id: 0, label: "target_group", question: "Who are you?", options: ["expat", "pensioner", "buyer", "diaspora", "professional"] },
  { id: 1, label: "service", question: "What do you want to do?", options: ["afm", "bank", "translation", "full_service"] }
];

export default function WizardPage() {
  const { step, nextStep, prevStep, setAnswer } = useWizardStore();
  const router = useRouter();

  const handleOption = (opt: string) => {
    setAnswer(steps[step].label, opt);
    if (step < steps.length - 1) nextStep();
    else router.push(`/checkout?bundle=${opt}`);
  };

  return (
    <main className="p-8">
      <AnimatePresence>
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-4">{steps[step].question}</h2>
          <div className="flex flex-col gap-2">
            {steps[step].options.map(opt => (
              <button
                key={opt}
                className="bg-blue-100 hover:bg-blue-300 rounded p-3 text-left"
                onClick={() => handleOption(opt)}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button onClick={prevStep} className="mt-6 underline text-sm text-gray-500">Back</button>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
} 