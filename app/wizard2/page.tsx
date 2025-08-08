"use client";
import { useWizardStore, type WizardAnswers } from "@/store/wizardStore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
async function uploadToServer(file: File, category: string) {
  const form = new FormData();
  form.append("file", file);
  form.append("category", category);
  await fetch("/api/uploads", { method: "POST", body: form });
}

type StepKey =
  | "audience"
  | "bundle"
  | "afm_requirements"
  | "personal"
  | "marriage"
  | "uploads_afm"
  | "bank_overview"
  | "bank_docs"
  | "bank_mobile"
  | "review";

interface StepDef { id: number; key: StepKey }

const steps: StepDef[] = [
  { id: 0, key: "audience" },
  { id: 1, key: "bundle" },
  { id: 2, key: "afm_requirements" },
  { id: 3, key: "personal" },
  { id: 4, key: "marriage" },
  { id: 5, key: "uploads_afm" },
  { id: 6, key: "bank_overview" },
  { id: 7, key: "bank_docs" },
  { id: 8, key: "bank_mobile" },
  { id: 9, key: "review" },
];

interface Actions {
  update: (partial: Partial<WizardAnswers>) => void;
  setFiles: (key: string, files: FileList | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  gotoCheckout: () => void;
}

export default function WizardAdvancedPage() {
  const { step, nextStep, prevStep, update, setFiles, answers } = useWizardStore();
  const router = useRouter();
  const progress = Math.round(((step + 1) / steps.length) * 100);

  const gotoCheckout = () => {
    const isFull = answers.bundleType === "full";
    const bundle = isFull
      ? (answers.isCouple ? "full_couple" : "full_single")
      : (answers.isCouple ? "starter_couple" : "starter_single");
    router.push(`/checkout?bundle=${bundle}`);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
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
        transition={{ duration: 0.45, ease: [0.4, 0.0, 0.2, 1] }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Get Started</h1>
            <p className="mt-2 text-gray-600">We collect only what’s necessary to start. You can pause and return anytime.</p>
          </div>

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
              transition={{ duration: 0.28, ease: [0.4, 0.0, 0.2, 1] }}
              className="bg-white border rounded-2xl shadow-sm p-6 md:p-8"
            >
              {renderStep(steps[step].key, answers, { update, setFiles, nextStep, prevStep, gotoCheckout })}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 text-sm text-gray-500">
            GDPR compliant. Data processed in Germany, deleted 30 days after fulfilment; only legally required metadata retained. <a className="underline" href="/legal/privacy">Privacy</a>.
          </div>
        </div>
      </motion.section>
    </main>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl md:text-2xl font-semibold mb-4">{children}</h2>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}

function renderStep(key: StepKey, answers: WizardAnswers, a: Actions) {
  switch (key) {
    case "audience":
      return (
        <div>
          <SectionTitle>Who are you?</SectionTitle>
          <div className="grid gap-3 md:grid-cols-2">
            {["expat","pensioner","buyer","investor","heir","diaspora"].map((opt) => (
              <button key={opt} onClick={() => { a.update({ audience: opt as any }); a.nextStep(); }} className="text-left rounded-xl border hover:border-blue-600 hover:bg-blue-50/50 transition-colors p-4">
                <div className="font-medium text-gray-900 capitalize">{opt}</div>
                <p className="text-sm text-gray-600 mt-1">Tailored flow for your situation.</p>
              </button>
            ))}
          </div>
        </div>
      );
    case "bundle":
      return (
        <div>
          <SectionTitle>Choose your bundle</SectionTitle>
          <div className="grid gap-3 md:grid-cols-2">
            <button onClick={() => { a.update({ bundleType: "starter" }); a.nextStep(); }} className={`text-left rounded-xl border p-4 hover:border-blue-600 hover:bg-blue-50/50 ${answers.bundleType === "starter" ? "border-blue-600 bg-blue-50/50" : ""}`}>
              <div className="font-medium text-gray-900">Starter Bundle</div>
              <p className="text-sm text-gray-600 mt-1">AFM (Tax ID) + Mobile number setup</p>
            </button>
            <button onClick={() => { a.update({ bundleType: "full" }); a.nextStep(); }} className={`text-left rounded-xl border p-4 hover:border-blue-600 hover:bg-blue-50/50 ${answers.bundleType === "full" ? "border-blue-600 bg-blue-50/50" : ""}`}>
              <div className="font-medium text-gray-900">Full Service</div>
              <p className="text-sm text-gray-600 mt-1">Includes bank account onboarding</p>
            </button>
          </div>
        </div>
      );
    case "afm_requirements": {
      const canContinue = !!(answers.hasValidId && answers.idType && answers.hasBirthCertificate && answers.hasAddressProof && answers.recentDocsConfirmed);
      return (
        <div>
          <SectionTitle>AFM Requirements</SectionTitle>
          <div className="grid gap-4">
            <div>
              <FieldLabel>Marital status</FieldLabel>
              <div className="flex items-center gap-4 text-sm">
                <label className="inline-flex items-center gap-2"><input type="radio" name="married" checked={!answers.isMarried} onChange={() => a.update({ isMarried: false })} /> Single</label>
                <label className="inline-flex items-center gap-2"><input type="radio" name="married" checked={answers.isMarried} onChange={() => a.update({ isMarried: true })} /> Married</label>
              </div>
            </div>
            <div>
              <FieldLabel>Valid ID available?</FieldLabel>
              <div className="flex items-center gap-4 text-sm">
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={answers.hasValidId} onChange={(e) => a.update({ hasValidId: e.target.checked })} /> Yes</label>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2"><input type="radio" name="idtype" disabled={!answers.hasValidId} checked={answers.idType === "passport"} onChange={() => a.update({ idType: "passport" })} /> Passport</label>
                  <label className="inline-flex items-center gap-2"><input type="radio" name="idtype" disabled={!answers.hasValidId} checked={answers.idType === "id"} onChange={() => a.update({ idType: "id" })} /> ID card</label>
                </div>
              </div>
            </div>
            <div>
              <FieldLabel>Documents available</FieldLabel>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={answers.hasBirthCertificate} onChange={(e)=> a.update({ hasBirthCertificate: e.target.checked })} /> Birth certificate</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={answers.hasAddressProof} onChange={(e)=> a.update({ hasAddressProof: e.target.checked })} /> Proof of address (registration or utility bill)</label>
              </div>
              <label className="inline-flex items-center gap-2 mt-3 text-sm"><input type="checkbox" checked={answers.recentDocsConfirmed} onChange={(e)=> a.update({ recentDocsConfirmed: e.target.checked })} /> Both are not older than 6 months</label>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50" disabled={!canContinue} onClick={a.nextStep}>Next</button>
          </div>
        </div>
      );
    }
    case "personal": {
      const p = answers.personal;
      const canContinue = [p.firstName,p.lastName,p.fatherFirstName,p.fatherLastName,p.motherFirstName,p.motherLastName,p.placeOfBirth,p.dateOfBirth].every(Boolean);
      return (
        <div>
          <SectionTitle>Personal details</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><FieldLabel>First name</FieldLabel><input className="input" value={p.firstName} onChange={(e)=> a.update({ personal: { ...p, firstName: e.target.value }})} /></div>
            <div><FieldLabel>Last name</FieldLabel><input className="input" value={p.lastName} onChange={(e)=> a.update({ personal: { ...p, lastName: e.target.value }})} /></div>
            <div><FieldLabel>Father first name</FieldLabel><input className="input" value={p.fatherFirstName} onChange={(e)=> a.update({ personal: { ...p, fatherFirstName: e.target.value }})} /></div>
            <div><FieldLabel>Father last name</FieldLabel><input className="input" value={p.fatherLastName} onChange={(e)=> a.update({ personal: { ...p, fatherLastName: e.target.value }})} /></div>
            <div><FieldLabel>Mother first name</FieldLabel><input className="input" value={p.motherFirstName} onChange={(e)=> a.update({ personal: { ...p, motherFirstName: e.target.value }})} /></div>
            <div><FieldLabel>Mother last name</FieldLabel><input className="input" value={p.motherLastName} onChange={(e)=> a.update({ personal: { ...p, motherLastName: e.target.value }})} /></div>
            <div><FieldLabel>Place of birth</FieldLabel><input className="input" value={p.placeOfBirth} onChange={(e)=> a.update({ personal: { ...p, placeOfBirth: e.target.value }})} /></div>
            <div><FieldLabel>Date of birth</FieldLabel><input type="date" className="input" value={p.dateOfBirth} onChange={(e)=> a.update({ personal: { ...p, dateOfBirth: e.target.value }})} /></div>
          </div>
          <div className="mt-6 flex justify-between">
            <button className="text-gray-600" onClick={a.prevStep}>← Back</button>
            <button className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50" disabled={!canContinue} onClick={a.nextStep}>Next</button>
          </div>
        </div>
      );
    }
    case "marriage": {
      if (!answers.isMarried) {
        return (
          <div>
            <SectionTitle>Marriage</SectionTitle>
            <p className="text-gray-600">Not applicable. Continue to document uploads.</p>
            <div className="mt-6 flex justify-end"><button className="rounded-md bg-blue-600 text-white px-4 py-2" onClick={a.nextStep}>Continue</button></div>
          </div>
        );
      }
      const hasMarriage = (answers.files["marriage_certificate"]?.length || 0) > 0;
      return (
        <div>
          <SectionTitle>Marriage</SectionTitle>
          <div className="grid gap-4">
            <div>
              <FieldLabel>Marriage certificate (upload)</FieldLabel>
              <input type="file" onChange={async (e)=> {
                a.setFiles("marriage_certificate", e.target.files);
                const f = e.target.files?.[0];
                if (f) await uploadToServer(f, "marriage_certificate");
              }} />
            </div>
            <div>
              <FieldLabel>Use couple service?</FieldLabel>
              <div className="flex items-center gap-4 text-sm">
                <label className="inline-flex items-center gap-2"><input type="radio" name="couple" checked={!answers.isCouple} onChange={()=> a.update({ isCouple: false })} /> Single</label>
                <label className="inline-flex items-center gap-2"><input type="radio" name="couple" checked={answers.isCouple} onChange={()=> a.update({ isCouple: true })} /> Couple</label>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button className="text-gray-600" onClick={a.prevStep}>← Back</button>
            <button className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50" disabled={!hasMarriage} onClick={a.nextStep}>Next</button>
          </div>
        </div>
      );
    }
    case "uploads_afm": {
      const hasId = (answers.files["id_document"]?.length || 0) > 0;
      const hasBirth = (answers.files["birth_certificate"]?.length || 0) > 0;
      const hasAddr = (answers.files["address_proof"]?.length || 0) > 0;
      const canContinue = hasId && hasBirth && hasAddr;
      return (
        <div>
          <SectionTitle>Upload documents (AFM)</SectionTitle>
          <p className="text-sm text-gray-600 mb-4">Provide scanned PDFs/images. Translations will be handled. Documents must be newer than 6 months.</p>
          <div className="grid gap-5">
            <div>
              <FieldLabel>ID document ({answers.idType || "passport / id"})</FieldLabel>
              <input type="file" onChange={async (e)=> { a.setFiles("id_document", e.target.files); const f=e.target.files?.[0]; if (f) await uploadToServer(f, "id_document"); }} />
            </div>
            <div>
              <FieldLabel>Birth certificate</FieldLabel>
              <input type="file" onChange={async (e)=> { a.setFiles("birth_certificate", e.target.files); const f=e.target.files?.[0]; if (f) await uploadToServer(f, "birth_certificate"); }} />
            </div>
            <div>
              <FieldLabel>Proof of address (registration certificate or utility bill)</FieldLabel>
              <input type="file" onChange={async (e)=> { a.setFiles("address_proof", e.target.files); const f=e.target.files?.[0]; if (f) await uploadToServer(f, "address_proof"); }} />
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button className="text-gray-600" onClick={a.prevStep}>← Back</button>
            <button className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50" disabled={!canContinue} onClick={a.nextStep}>Next</button>
          </div>
        </div>
      );
    }
    case "bank_overview": {
      const isFull = answers.bundleType === "full";
      if (!isFull) {
        return (
          <div>
            <SectionTitle>Bank account onboarding</SectionTitle>
            <p className="text-gray-600">Not required for Starter Bundle.</p>
            <div className="mt-6 flex justify-end"><button className="rounded-md bg-blue-600 text-white px-4 py-2" onClick={a.nextStep}>Continue</button></div>
          </div>
        );
      }
      return (
        <div>
          <SectionTitle>Bank account onboarding</SectionTitle>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Identification: EU Passport or EU ID (valid)</li>
            <li>Financial details: Tax clearance or annual wage statement</li>
            <li>Proof of address: Utility bill or registration certificate (if address on ID, optional)</li>
            <li>Work details: Employer certificate (also if self-employed)</li>
            <li>Mobile phone: EU number (with matching bill) or Greek number</li>
          </ul>
          <div className="mt-6 flex justify-end"><button className="rounded-md bg-blue-600 text-white px-4 py-2" onClick={a.nextStep}>Next</button></div>
        </div>
      );
    }
    case "bank_docs": {
      const b = answers.bank;
      const needAddressUpload = b.proofOfAddressOption !== "id_address";
      const hasFin = (answers.files["financial_doc"]?.length || 0) > 0;
      const hasAddr = !needAddressUpload || (answers.files["address_doc"]?.length || 0) > 0;
      const hasEmp = (answers.files["employer_certificate"]?.length || 0) > 0;
      const canContinue = !!(b.financialDocType && b.employmentLine && hasFin && hasAddr && hasEmp);
      return (
        <div>
          <SectionTitle>Bank documents</SectionTitle>
          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Financial document</FieldLabel>
                <select className="input" value={b.financialDocType} onChange={(e)=> a.update({ bank: { ...b, financialDocType: e.target.value as any } })}>
                  <option value="">Choose…</option>
                  <option value="tax_clearance">Tax clearance certificate</option>
                  <option value="annual_wage_statement">Annual wage statement</option>
                </select>
              </div>
              <div>
                <FieldLabel>Proof of address</FieldLabel>
                <select className="input" value={b.proofOfAddressOption} onChange={(e)=> a.update({ bank: { ...b, proofOfAddressOption: e.target.value as any } })}>
                  <option value="">Choose…</option>
                  <option value="utility">Utility bill</option>
                  <option value="registration">Registration certificate</option>
                  <option value="id_address">Address is on ID</option>
                </select>
              </div>
            </div>
            <div>
              <FieldLabel>Employer certificate (one sentence: employed where since when; also for self-employed)</FieldLabel>
              <input className="input" value={b.employmentLine} onChange={(e)=> a.update({ bank: { ...b, employmentLine: e.target.value } })} />
            </div>
            <div className="grid gap-4">
              <div>
                <FieldLabel>Upload financial document</FieldLabel>
                <input type="file" onChange={async (e)=> { a.setFiles("financial_doc", e.target.files); const f=e.target.files?.[0]; if (f) await uploadToServer(f, "financial_doc"); }} />
              </div>
              {needAddressUpload && (
                <div>
                  <FieldLabel>Upload proof of address</FieldLabel>
                  <input type="file" onChange={async (e)=> { a.setFiles("address_doc", e.target.files); const f=e.target.files?.[0]; if (f) await uploadToServer(f, "address_doc"); }} />
                </div>
              )}
              <div>
                <FieldLabel>Upload employer certificate</FieldLabel>
                <input type="file" onChange={async (e)=> { a.setFiles("employer_certificate", e.target.files); const f=e.target.files?.[0]; if (f) await uploadToServer(f, "employer_certificate"); }} />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button className="text-gray-600" onClick={a.prevStep}>← Back</button>
            <button className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50" disabled={!canContinue} onClick={a.nextStep}>Next</button>
          </div>
        </div>
      );
    }
    case "bank_mobile": {
      const b = answers.bank;
      const isEU = b.mobileOption === "eu_number";
      const isGR = b.mobileOption === "greek_number";
      const hasBill = (answers.files["mobile_bill"]?.length || 0) > 0;
      const hasProviderCert = (answers.files["provider_cert"]?.length || 0) > 0;
      const canContinue = (isEU && hasBill) || (isGR && (!b.hasGreekNumber || (b.hasGreekNumber && hasProviderCert)));
      return (
        <div>
          <SectionTitle>Mobile phone for banking</SectionTitle>
          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <button className={`rounded-xl border p-4 text-left ${b.mobileOption === "eu_number" ? "border-blue-600 bg-blue-50/50" : ""}`} onClick={()=> a.update({ bank: { ...b, mobileOption: "eu_number" } })}>
                <div className="font-medium text-gray-900">Use my EU number</div>
                <p className="text-sm text-gray-600 mt-1">Requires a mobile phone bill with the same address as your utility bill/registration.</p>
              </button>
              <button className={`rounded-xl border p-4 text-left ${b.mobileOption === "greek_number" ? "border-blue-600 bg-blue-50/50" : ""}`} onClick={()=> a.update({ bank: { ...b, mobileOption: "greek_number" } })}>
                <div className="font-medium text-gray-900">Use a Greek number</div>
                <p className="text-sm text-gray-600 mt-1">If you already have one, we need a provider certificate bound to your Greek tax ID. If not, we will provide one.</p>
              </button>
            </div>
            {isEU && (
              <div>
                <FieldLabel>Upload mobile phone bill (EU number)</FieldLabel>
                <input type="file" onChange={async (e)=> { a.setFiles("mobile_bill", e.target.files); const f=e.target.files?.[0]; if (f) await uploadToServer(f, "mobile_bill"); }} />
              </div>
            )}
            {isGR && (
              <div className="grid gap-3">
                <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={b.hasGreekNumber} onChange={(e)=> a.update({ bank: { ...b, hasGreekNumber: e.target.checked } })} /> I already have a Greek number</label>
                {b.hasGreekNumber ? (
                  <div>
                    <FieldLabel>Upload provider certificate (ownership tied to Greek tax ID)</FieldLabel>
                    <input type="file" onChange={async (e)=> { a.setFiles("provider_cert", e.target.files); const f=e.target.files?.[0]; if (f) await uploadToServer(f, "provider_cert"); }} />
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">We will provide a Greek number as part of the service.</p>
                )}
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-between">
            <button className="text-gray-600" onClick={a.prevStep}>← Back</button>
            <button className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50" disabled={!canContinue} onClick={a.nextStep}>Next</button>
          </div>
        </div>
      );
    }
    case "review": {
      const missing: string[] = [];
      const needBank = answers.bundleType === "full";
      if (!answers.hasValidId || !answers.idType) missing.push("Valid ID");
      if (!answers.hasBirthCertificate) missing.push("Birth certificate");
      if (!answers.hasAddressProof) missing.push("Proof of address");
      if (!answers.recentDocsConfirmed) missing.push("6-months doc freshness confirmation");
      if (answers.isMarried && !(answers.files["marriage_certificate"]?.length)) missing.push("Marriage certificate");
      if (!(answers.files["id_document"]?.length)) missing.push("ID document upload");
      if (!(answers.files["birth_certificate"]?.length)) missing.push("Birth certificate upload");
      if (!(answers.files["address_proof"]?.length)) missing.push("Address proof upload");
      if (needBank) {
        if (!answers.bank.financialDocType) missing.push("Financial document selection");
        if (!(answers.files["financial_doc"]?.length)) missing.push("Financial document upload");
        if (answers.bank.proofOfAddressOption !== "id_address" && !(answers.files["address_doc"]?.length)) missing.push("Bank address document upload");
        if (!answers.bank.employmentLine) missing.push("Employer certificate text");
        if (!(answers.files["employer_certificate"]?.length)) missing.push("Employer certificate upload");
        if (answers.bank.mobileOption === "eu_number" && !(answers.files["mobile_bill"]?.length)) missing.push("Mobile phone bill upload");
        if (answers.bank.mobileOption === "greek_number" && answers.bank.hasGreekNumber && !(answers.files["provider_cert"]?.length)) missing.push("Provider certificate upload");
      }
      const pass = missing.length === 0;
      return (
        <div>
          <SectionTitle>Review & Compliance Check</SectionTitle>
          {pass ? (
            <p className="text-green-700">All required checks passed. You can proceed to checkout.</p>
          ) : (
            <div>
              <p className="text-red-700 mb-2">Please complete the following:</p>
              <ul className="list-disc pl-5 text-red-700">
                {missing.map((m) => <li key={m}>{m}</li>)}
              </ul>
            </div>
          )}
          <div className="mt-6 flex justify-between">
            <button className="text-gray-600" onClick={a.prevStep}>← Back</button>
            <button className="rounded-md bg-green-600 text-white px-4 py-2 disabled:opacity-50" disabled={!pass} onClick={a.gotoCheckout}>Proceed to checkout</button>
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}

// Tailwind utility class for inputs
declare global {
  interface JSX {
    IntrinsicElements: any;
  }
}

