"use client";
import { useWizardStore, type WizardAnswers } from "@/store/wizardStore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { useTranslations } from "next-intl";
import { PoAModal } from "./PoAModal";
import { Select } from "@/components/ui/Select";
import { FileUpload } from "@/components/ui/FileUpload";

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
  | "consents"
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
  { id: 5, key: "consents" },
  { id: 6, key: "uploads_afm" },
  { id: 7, key: "bank_overview" },
  { id: 8, key: "bank_docs" },
  { id: 9, key: "bank_mobile" },
  { id: 10, key: "review" },
];

interface Actions {
  update: (partial: Partial<WizardAnswers>) => void;
  setFiles: (key: string, files: FileList | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  gotoCheckout: () => void;
  skipToStep: (stepIndex: number) => void;
}

export default function WizardAdvancedPage() {
  const { step, nextStep, prevStep, update, setFiles, answers } = useWizardStore();
  const router = useRouter();
  const progress = Math.round(((step + 1) / steps.length) * 100);
  const t = useTranslations();

  const [poaOpen, setPoaOpen] = useState(false);
  const gotoCheckout = () => {
    const isFull = answers.bundleType === "full";
    const bundle = isFull
      ? (answers.isCouple ? "full_couple" : "full_single")
      : (answers.isCouple ? "starter_couple" : "starter_single");
    // Require POA acceptance before redirect
    if (!answers.poaAccepted) {
      setPoaOpen(true);
      return;
    }
    router.push(`/checkout?bundle=${bundle}&consents=1`);
  };

  return (
    <main className="min-h-screen">
      <header className="px-6 py-4 border-b sticky top-0 bg-white/70 backdrop-blur z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg tracking-tight text-black subpixel-antialiased leading-none">ELLYTIC</Link>
          <Link className="text-sm text-gray-600 hover:text-black" href="/">{t("wizard.backToHome")}</Link>
        </div>
      </header>

      <PoAModal
        open={poaOpen}
        onClose={() => setPoaOpen(false)}
        onAccepted={() => {
          // In production, call DocuSign envelope creation first
          // fetch('/api/poa/docusign', { method: 'POST', body: JSON.stringify({...}) })
          //   .then(() => ...)
          update({ poaAccepted: true });
          setPoaOpen(false);
          gotoCheckout();
        }}
      />

      <motion.section
        className="px-6 py-10 md:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0.0, 0.2, 1] }}
      >
        <div className="max-w-4xl mx-auto">
          <Disclaimer className="mb-4" />
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t("wizard.title")}</h1>
            <p className="mt-2 text-gray-600">{t("wizard.subtitle")}</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>{t("wizard.step", { current: step + 1, total: steps.length })}</span>
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
              transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
            >
              {renderStep(steps[step].key, answers, { update, setFiles, nextStep, prevStep, gotoCheckout })}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>
    </main>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold mb-6">{children}</h2>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="font-medium text-gray-900 mb-2">{children}</div>;
}

function renderStep(key: StepKey, answers: WizardAnswers, a: Actions) {
  const t = useTranslations();
  
  switch (key) {
    case "consents": {
      const canContinue = !!(
        answers.consentSelf && answers.consentNoCoercion && answers.consentGenuineDocs
      );
      return (
        <div>
          <SectionTitle>{t("wizard.consents.title")}</SectionTitle>
          <div className="grid gap-3 text-sm">
            <label className="inline-flex items-start gap-2">
              <input type="checkbox" checked={answers.consentSelf} onChange={(e)=> a.update({ consentSelf: e.target.checked })} />
              <span>{t("wizard.consents.self")}</span>
            </label>
            <label className="inline-flex items-start gap-2">
              <input type="checkbox" checked={answers.consentNoCoercion} onChange={(e)=> a.update({ consentNoCoercion: e.target.checked })} />
              <span>{t("wizard.consents.noCoercion")}</span>
            </label>
            <label className="inline-flex items-start gap-2">
              <input type="checkbox" checked={answers.consentGenuineDocs} onChange={(e)=> a.update({ consentGenuineDocs: e.target.checked })} />
              <span>{t("wizard.consents.genuineDocs")}</span>
            </label>
          </div>
          <div className="mt-6 flex justify-between">
            <button className="text-gray-600" onClick={a.prevStep}>← {t("wizard.back")}</button>
            <button className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50" disabled={!canContinue} onClick={a.nextStep}>{t("wizard.next")}</button>
          </div>
        </div>
      );
    }
    case "audience":
      return (
        <div>
          <SectionTitle>{t("wizard.audience.title")}</SectionTitle>
          <div className="grid gap-8 md:grid-cols-2">
            {["expat","pensioner","buyer","investor","heir","diaspora"].map((opt) => (
              <motion.button
                key={opt}
                onClick={() => { a.update({ audience: opt as any }); a.nextStep(); }}
                layout
                transition={{ layout: {duration: 0.28, ease: [0.2, 0, 0.2, 1]}, duration: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-0 origin-center will-change-transform text-left rounded-2xl glass p-4 transition-all hover:shadow-2xl hover:ring-2 hover:ring-blue-300/60 hover:z-10"
              >
                <div className="font-medium text-gray-900 capitalize flex items-center justify-between">
                  <span>{t(`wizard.audience.options.${opt}`)}</span>
                  <span className="text-xs text-gray-500">{t("wizard.audience.subtitle")}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      );
    case "bundle":
      return (
        <div>
          <SectionTitle>{t("wizard.bundle.title")}</SectionTitle>
          <div className="grid gap-8 md:grid-cols-2">
            {[{key:"starter", title:t("wizard.bundle.starter.title"), desc:t("wizard.bundle.starter.description")}, {key:"full", title:t("wizard.bundle.full.title"), desc:t("wizard.bundle.full.description")}].map((b)=> (
              <motion.button
                key={b.key}
                onClick={() => { a.update({ bundleType: b.key as any }); a.nextStep(); }}
                layout
                transition={{ layout: {duration: 0.28, ease: [0.2, 0, 0.2, 1]}, duration: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.98 }}
                className={`relative z-0 origin-center will-change-transform text-left rounded-2xl glass p-4 transition-all hover:shadow-2xl hover:ring-2 hover:ring-blue-300/60 hover:z-10 ${answers.bundleType === b.key ? "ring-2 ring-blue-600" : ""}`}
              >
                <div className="font-medium text-gray-900">{b.title}</div>
                <p className="text-sm text-gray-600 mt-1">{b.desc}</p>
              </motion.button>
            ))}
          </div>
          <div className="mt-6 flex justify-start">
            <button className="text-gray-600" onClick={a.prevStep}>← {t("wizard.back")}</button>
          </div>
        </div>
      );
    case "afm_requirements": {
      const canContinue = !!(
        answers.hasValidId &&
        answers.idType &&
        answers.hasBirthCertificate &&
        answers.hasAddressProof &&
        answers.recentDocsConfirmed &&
        (!answers.isMarried || answers.hasMarriageCertificate)
      );
      return (
        <div>
          <SectionTitle>{t("wizard.afm.title")}</SectionTitle>
          <div className="grid gap-4">
            <div>
              <FieldLabel>{t("wizard.afm.maritalStatus")}</FieldLabel>
              <div className="flex items-center gap-4 text-sm">
                <label className="inline-flex items-center gap-2"><input type="radio" name="married" checked={!answers.isMarried} onChange={() => a.update({ isMarried: false })} /> {t("wizard.afm.single")}</label>
                <label className="inline-flex items-center gap-2"><input type="radio" name="married" checked={answers.isMarried} onChange={() => a.update({ isMarried: true })} /> {t("wizard.afm.married")}</label>
              </div>
            </div>
            <div>
              <FieldLabel>{t("wizard.afm.validId")}</FieldLabel>
              <div className="flex items-center gap-4 text-sm">
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={answers.hasValidId} onChange={(e) => a.update({ hasValidId: e.target.checked })} /> {t("wizard.afm.yes")}</label>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2"><input type="radio" name="idtype" disabled={!answers.hasValidId} checked={answers.idType === "passport"} onChange={() => a.update({ idType: "passport" })} /> {t("wizard.afm.passport")}</label>
                  <label className="inline-flex items-center gap-2"><input type="radio" name="idtype" disabled={!answers.hasValidId} checked={answers.idType === "id"} onChange={() => a.update({ idType: "id" })} /> {t("wizard.afm.idCard")}</label>
                </div>
              </div>
            </div>
            <div>
              <FieldLabel>{t("wizard.afm.documentsAvailable")}</FieldLabel>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={answers.hasBirthCertificate} onChange={(e)=> a.update({ hasBirthCertificate: e.target.checked })} /> {t("wizard.afm.birthCertificate")}</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={answers.hasAddressProof} onChange={(e)=> a.update({ hasAddressProof: e.target.checked })} /> {t("wizard.afm.addressProof")}</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={answers.recentDocsConfirmed} onChange={(e)=> a.update({ recentDocsConfirmed: e.target.checked })} /> {t("wizard.afm.recentDocs")}</label>
                <AnimatePresence initial={false}>
                  {answers.isMarried && (
                    <motion.label
                      key="marriage-cert"
                      initial={{opacity: 0, scale: 0.98}}
                      animate={{opacity: 1, scale: 1}}
                      exit={{opacity: 0, scale: 0.98}}
                      transition={{duration: 0.18, ease: [0.2, 0, 0.2, 1]}}
                      className="inline-flex items-center gap-2 text-sm"
                    >
                      <input type="checkbox" checked={answers.hasMarriageCertificate} onChange={(e)=> a.update({ hasMarriageCertificate: e.target.checked })} /> {t("wizard.afm.marriageCertificate")}
                    </motion.label>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button className="text-gray-600" onClick={a.prevStep}>← {t("wizard.back")}</button>
            <button className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50" disabled={!canContinue} onClick={a.nextStep}>{t("wizard.next")}</button>
          </div>
        </div>
      );
    }
    case "personal": {
      const p = answers.personal;
      const isAdultUser = isAdult(p.dateOfBirth);
      const canContinue = [
        p.firstName,p.lastName,p.fatherFirstName,p.fatherLastName,p.motherFirstName,p.motherLastName,
        p.placeOfBirth,p.birthRegion,p.birthZipCode,p.birthCountry,
        p.currentStreet,p.currentCity,p.currentZipCode,p.currentCountry,
        p.dateOfBirth,p.email,p.mobilePhone
      ].every(Boolean) && isAdultUser;
      return (
        <div>
          <SectionTitle>{t("wizard.personal.title")}</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="field-group"><FieldLabel>{t("wizard.personal.firstName")}</FieldLabel><input placeholder={t("wizard.personal.firstName")} className="input" value={p.firstName} onChange={(e)=> a.update({ personal: { ...p, firstName: e.target.value }})} /></div>
            <div className="field-group"><FieldLabel>{t("wizard.personal.lastName")}</FieldLabel><input placeholder={t("wizard.personal.lastName")} className="input" value={p.lastName} onChange={(e)=> a.update({ personal: { ...p, lastName: e.target.value }})} /></div>
            <div className="field-group"><FieldLabel>{t("wizard.personal.fatherFirstName")}</FieldLabel><input placeholder={t("wizard.personal.fatherFirstName")} className="input" value={p.fatherFirstName} onChange={(e)=> a.update({ personal: { ...p, fatherFirstName: e.target.value }})} /></div>
            <div className="field-group"><FieldLabel>{t("wizard.personal.fatherLastName")}</FieldLabel><input placeholder={t("wizard.personal.fatherLastName")} className="input" value={p.fatherLastName} onChange={(e)=> a.update({ personal: { ...p, fatherLastName: e.target.value }})} /></div>
            <div className="field-group"><FieldLabel>{t("wizard.personal.motherFirstName")}</FieldLabel><input placeholder={t("wizard.personal.motherFirstName")} className="input" value={p.motherFirstName} onChange={(e)=> a.update({ personal: { ...p, motherFirstName: e.target.value }})} /></div>
            <div className="field-group"><FieldLabel>{t("wizard.personal.motherLastName")}</FieldLabel><input placeholder={t("wizard.personal.motherLastName")} className="input" value={p.motherLastName} onChange={(e)=> a.update({ personal: { ...p, motherLastName: e.target.value }})} /></div>
            <div className="field-group sm:col-span-2">
              <FieldLabel>{t("wizard.personal.sex")}</FieldLabel>
              <div className="flex items-center gap-6 text-sm">
                <label className="inline-flex items-center gap-2"><input type="radio" name="sex" checked={p.sex === "male"} onChange={()=> a.update({ personal: { ...p, sex: "male" }})} /> {t("wizard.personal.sexMale")}</label>
                <label className="inline-flex items-center gap-2"><input type="radio" name="sex" checked={p.sex === "female"} onChange={()=> a.update({ personal: { ...p, sex: "female" }})} /> {t("wizard.personal.sexFemale")}</label>
                <label className="inline-flex items-center gap-2"><input type="radio" name="sex" checked={p.sex === "non_binary"} onChange={()=> a.update({ personal: { ...p, sex: "non_binary" }})} /> {t("wizard.personal.sexNonBinary")}</label>
              </div>
            </div>
            <div className="sm:col-span-2 grid gap-3">
              <div className="field-group"><FieldLabel>{t("wizard.personal.placeOfBirth")}</FieldLabel><input placeholder={t("wizard.personal.placeOfBirth")} className="input" value={p.placeOfBirth} onChange={(e)=> a.update({ personal: { ...p, placeOfBirth: e.target.value }})} onBlur={async (e)=> {
                const val = normalizePlace(e.target.value);
                a.update({ personal: { ...p, placeOfBirth: val }});
                if (val) {
                  const res = await fetch(`/api/geocode?q=${encodeURIComponent(val)}`);
                  const j = await res.json();
                  if (j?.found) {
                    a.update({ personal: { ...p, placeOfBirth: j.city || val, birthRegion: j.region || p.birthRegion, birthZipCode: j.postcode || p.birthZipCode, birthCountry: j.country || p.birthCountry } });
                  }
                }
              }} /></div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="field-group"><FieldLabel>{t("wizard.personal.region")}</FieldLabel><input placeholder={t("wizard.personal.region")} className="input" value={p.birthRegion} onChange={(e)=> a.update({ personal: { ...p, birthRegion: e.target.value }})} /></div>
                <div className="field-group"><FieldLabel>{t("wizard.personal.zipCode")}</FieldLabel><input placeholder={t("wizard.personal.zipCode")} className="input" value={p.birthZipCode} onChange={(e)=> a.update({ personal: { ...p, birthZipCode: e.target.value }})} /></div>
                <div className="field-group"><FieldLabel>{t("wizard.personal.country")}</FieldLabel><input placeholder={t("wizard.personal.country")} className="input" value={p.birthCountry} onChange={(e)=> a.update({ personal: { ...p, birthCountry: e.target.value }})} /></div>
              </div>
            </div>
            <div className="field-group"><FieldLabel>{t("wizard.personal.dateOfBirth")}</FieldLabel><input type="date" className="input" value={p.dateOfBirth} onChange={(e)=> a.update({ personal: { ...p, dateOfBirth: e.target.value }})} /></div>
            <div className="field-group"><FieldLabel>{t("wizard.personal.email")}</FieldLabel><input type="email" placeholder={t("wizard.personal.email")} className="input" value={p.email} onChange={(e)=> a.update({ personal: { ...p, email: e.target.value }})} /></div>
            <div className="field-group"><FieldLabel>{t("wizard.personal.mobilePhone")}</FieldLabel><input type="tel" placeholder={t("wizard.personal.mobilePhone")} className="input" value={p.mobilePhone} onChange={(e)=> a.update({ personal: { ...p, mobilePhone: e.target.value }})} /></div>
            <div className="sm:col-span-2 grid gap-3">
              <FieldLabel>{t("wizard.personal.currentResidence")}</FieldLabel>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="field-group"><input className="input" placeholder={t("wizard.personal.street")} value={p.currentStreet} onChange={(e)=> a.update({ personal: { ...p, currentStreet: e.target.value }})} /></div>
                <div className="field-group"><input className="input" placeholder={t("wizard.personal.city")} value={p.currentCity} onChange={(e)=> a.update({ personal: { ...p, currentCity: e.target.value }})} /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="field-group"><input className="input" placeholder={t("wizard.personal.zipCode")} value={p.currentZipCode} onChange={(e)=> a.update({ personal: { ...p, currentZipCode: e.target.value }})} /></div>
                <div className="field-group"><input className="input" placeholder={t("wizard.personal.country")} value={p.currentCountry} onChange={(e)=> a.update({ personal: { ...p, currentCountry: e.target.value }})} /></div>
              </div>
            </div>
          </div>
          {!isAdultUser && p.dateOfBirth && (
            <p className="mt-3 text-sm text-red-600">{t("wizard.personal.ageError")}</p>
          )}
          <div className="mt-6 flex justify-between">
            <button className="text-gray-600" onClick={a.prevStep}>← {t("wizard.back")}</button>
            <button className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50" disabled={!canContinue} onClick={a.nextStep}>{t("wizard.next")}</button>
          </div>
        </div>
      );
    }
    case "marriage": {
      if (!answers.isMarried) {
        return (
          <div>
            <SectionTitle>{t("wizard.marriage.title")}</SectionTitle>
            <p className="text-gray-600">{t("wizard.marriage.notApplicable")}</p>
          <div className="mt-6 flex justify-between"><button className="text-gray-600" onClick={a.prevStep}>← {t("wizard.back")}</button><button className="rounded-md bg-blue-600 text-white px-4 py-2" onClick={a.nextStep}>{t("wizard.next")}</button></div>
          </div>
        );
      }
      const hasMarriage = (answers.files["marriage_certificate"]?.length || 0) > 0;
      return (
        <div>
          <SectionTitle>{t("wizard.marriage.title")}</SectionTitle>
          <div className="grid gap-4">
            <div>
              <FieldLabel>{t("wizard.marriage.certificate")}</FieldLabel>
              <FileUpload 
                accept=".pdf,.jpg,.jpeg,.png"
                label="Upload marriage certificate"
                onChange={async (files) => {
                  a.setFiles("marriage_certificate", files);
                  const f = files?.[0];
                  if (f) await uploadToServer(f, "marriage_certificate");
                }} 
              />
            </div>
            <div>
              <FieldLabel>{t("wizard.marriage.coupleService")}</FieldLabel>
              <div className="flex items-center gap-4 text-sm">
                <label className="inline-flex items-center gap-2"><input type="radio" name="couple" checked={!answers.isCouple} onChange={()=> a.update({ isCouple: false })} /> {t("wizard.marriage.single")}</label>
                <label className="inline-flex items-center gap-2"><input type="radio" name="couple" checked={answers.isCouple} onChange={()=> a.update({ isCouple: true })} /> {t("wizard.marriage.couple")}</label>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button className="text-gray-600" onClick={a.prevStep}>← {t("wizard.back")}</button>
            <button className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50" disabled={!hasMarriage} onClick={a.nextStep}>{t("wizard.next")}</button>
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
          <SectionTitle>{t("wizard.uploads.title")}</SectionTitle>
          <p className="text-sm text-gray-600 mb-4">{t("wizard.uploads.description")}</p>
          <div className="grid gap-5">
            <div>
              <FieldLabel>{t("wizard.uploads.idDocument", { type: answers.idType || "passport / id" })}</FieldLabel>
              <FileUpload 
                accept=".pdf,.jpg,.jpeg,.png"
                label="Upload ID document"
                onChange={async (files) => { 
                  a.setFiles("id_document", files); 
                  const f = files?.[0]; 
                  if (f) await uploadToServer(f, "id_document"); 
                }} 
              />
            </div>
            <div>
              <FieldLabel>{t("wizard.uploads.birthCertificate")}</FieldLabel>
              <FileUpload 
                accept=".pdf,.jpg,.jpeg,.png"
                label="Upload birth certificate"
                onChange={async (files) => { 
                  a.setFiles("birth_certificate", files); 
                  const f = files?.[0]; 
                  if (f) await uploadToServer(f, "birth_certificate"); 
                }} 
              />
            </div>
            <div>
              <FieldLabel>{t("wizard.uploads.addressProof")}</FieldLabel>
              <FileUpload 
                accept=".pdf,.jpg,.jpeg,.png"
                label="Upload address proof"
                onChange={async (files) => { 
                  a.setFiles("address_proof", files); 
                  const f = files?.[0]; 
                  if (f) await uploadToServer(f, "address_proof"); 
                }} 
              />
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button className="text-gray-600" onClick={a.prevStep}>← {t("wizard.back")}</button>
            <button className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50" disabled={!canContinue} onClick={a.nextStep}>{t("wizard.next")}</button>
          </div>
        </div>
      );
    }
    case "bank_overview": {
      const isFull = answers.bundleType === "full";
      if (!isFull) {
        return (
          <div>
            <SectionTitle>{t("wizard.bank.title")}</SectionTitle>
            <p className="text-gray-600">{t("wizard.bank.notRequired")}</p>
            <div className="mt-6 flex justify-between">
              <button className="text-gray-600" onClick={a.prevStep}>← {t("wizard.back")}</button>
              <button className="rounded-md bg-blue-600 text-white px-4 py-2" onClick={a.nextStep}>{t("wizard.next")}</button>
            </div>
          </div>
        );
      }
      return (
        <div>
          <SectionTitle>{t("wizard.bank.title")}</SectionTitle>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>{t("wizard.bank.identification")}</li>
            <li>{t("wizard.bank.financial")}</li>
            <li>{t("wizard.bank.address")}</li>
            <li>{t("wizard.bank.work")}</li>
            <li>{t("wizard.bank.mobile")}</li>
          </ul>
          <div className="mt-6 flex justify-between">
            <button className="text-gray-600" onClick={a.prevStep}>← {t("wizard.back")}</button>
            <button className="rounded-md bg-blue-600 text-white px-4 py-2" onClick={a.nextStep}>{t("wizard.next")}</button>
          </div>
        </div>
      );
    }
    case "bank_docs": {
      const isFull = answers.bundleType === "full";
      if (!isFull) {
        // This should not happen due to skip logic, but just in case
        a.nextStep();
        return null;
      }
      const b = answers.bank;
      const needAddressUpload = b.proofOfAddressOption !== "id_address";
      const hasFin = (answers.files["financial_doc"]?.length || 0) > 0;
      const hasAddr = !needAddressUpload || (answers.files["address_doc"]?.length || 0) > 0;
      const hasEmp = (answers.files["employer_certificate"]?.length || 0) > 0;
      const canContinue = !!(b.financialDocType && b.employmentLine && hasFin && hasAddr && hasEmp);
      return (
        <div>
          <SectionTitle>{t("wizard.bankDocs.title")}</SectionTitle>
          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>{t("wizard.bankDocs.financial")}</FieldLabel>
                <Select
                  value={b.financialDocType}
                  onChange={(value) => a.update({ bank: { ...b, financialDocType: value as any } })}
                  placeholder={t("wizard.bankDocs.choose")}
                  options={[
                    { value: "tax_clearance", label: t("wizard.bankDocs.taxClearance") },
                    { value: "annual_wage_statement", label: t("wizard.bankDocs.annualWage") }
                  ]}
                />
              </div>
              <div>
                <FieldLabel>{t("wizard.bankDocs.proofOfAddress")}</FieldLabel>
                <Select
                  value={b.proofOfAddressOption}
                  onChange={(value) => a.update({ bank: { ...b, proofOfAddressOption: value as any } })}
                  placeholder={t("wizard.bankDocs.choose")}
                  options={[
                    { value: "utility", label: t("wizard.bankDocs.utility") },
                    { value: "registration", label: t("wizard.bankDocs.registration") },
                    { value: "id_address", label: t("wizard.bankDocs.idAddress") }
                  ]}
                />
              </div>
            </div>
            <div className="grid gap-4">
              <div>
                <FieldLabel>{t("wizard.bankDocs.uploadFinancial")}</FieldLabel>
                <FileUpload 
                  accept=".pdf,.jpg,.jpeg,.png"
                  label="Upload financial document"
                  onChange={async (files) => { 
                    a.setFiles("financial_doc", files); 
                    const f = files?.[0]; 
                    if (f) await uploadToServer(f, "financial_doc"); 
                  }} 
                />
              </div>
              {needAddressUpload && (
                <div>
                  <FieldLabel>{t("wizard.bankDocs.uploadAddress")}</FieldLabel>
                  <FileUpload 
                    accept=".pdf,.jpg,.jpeg,.png"
                    label="Upload address document"
                    onChange={async (files) => { 
                      a.setFiles("address_doc", files); 
                      const f = files?.[0]; 
                      if (f) await uploadToServer(f, "address_doc"); 
                    }} 
                  />
                </div>
              )}
              <div>
                <FieldLabel>{t("wizard.bankDocs.uploadEmployer")}</FieldLabel>
                <FileUpload 
                  accept=".pdf,.jpg,.jpeg,.png"
                  label="Upload employer certificate"
                  onChange={async (files) => { 
                    a.setFiles("employer_certificate", files); 
                    const f = files?.[0]; 
                    if (f) await uploadToServer(f, "employer_certificate"); 
                  }} 
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button className="text-gray-600" onClick={a.prevStep}>← {t("wizard.back")}</button>
            <button className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50" disabled={!canContinue} onClick={a.nextStep}>{t("wizard.next")}</button>
          </div>
        </div>
      );
    }
    case "bank_mobile": {
      const isFull = answers.bundleType === "full";
      if (!isFull) {
        // This should not happen due to skip logic, but just in case
        a.nextStep();
        return null;
      }
      const b = answers.bank;
      const isEU = b.mobileOption === "eu_number";
      const isGR = b.mobileOption === "greek_number";
      const hasBill = (answers.files["mobile_bill"]?.length || 0) > 0;
      const hasProviderCert = (answers.files["provider_cert"]?.length || 0) > 0;
      const canContinue = (isEU && hasBill) || (isGR && (!b.hasGreekNumber || (b.hasGreekNumber && hasProviderCert)));
      return (
        <div>
          <SectionTitle>{t("wizard.mobile.title")}</SectionTitle>
          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <button className={`rounded-xl border p-4 text-left ${b.mobileOption === "eu_number" ? "border-blue-600 bg-blue-50/50" : ""}`} onClick={()=> a.update({ bank: { ...b, mobileOption: "eu_number" } })}>
                <div className="font-medium text-gray-900">{t("wizard.mobile.euNumber")}</div>
                <p className="text-sm text-gray-600 mt-1">{t("wizard.mobile.euDescription")}</p>
              </button>
              <button className={`rounded-xl border p-4 text-left ${b.mobileOption === "greek_number" ? "border-blue-600 bg-blue-50/50" : ""}`} onClick={()=> a.update({ bank: { ...b, mobileOption: "greek_number" } })}>
                <div className="font-medium text-gray-900">{t("wizard.mobile.greekNumber")}</div>
                <p className="text-sm text-gray-600 mt-1">{t("wizard.mobile.greekDescription")}</p>
              </button>
            </div>
            {isEU && (
              <div>
                <FieldLabel>{t("wizard.mobile.uploadBill")}</FieldLabel>
                <FileUpload 
                  accept=".pdf,.jpg,.jpeg,.png"
                  label="Upload mobile phone bill"
                  onChange={async (files) => { 
                    a.setFiles("mobile_bill", files); 
                    const f = files?.[0]; 
                    if (f) await uploadToServer(f, "mobile_bill"); 
                  }} 
                />
              </div>
            )}
            {isGR && (
              <div className="grid gap-3">
                <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={b.hasGreekNumber} onChange={(e)=> a.update({ bank: { ...b, hasGreekNumber: e.target.checked } })} /> {t("wizard.mobile.hasGreekNumber")}</label>
                {b.hasGreekNumber ? (
                  <div>
                    <FieldLabel>{t("wizard.mobile.uploadProviderCert")}</FieldLabel>
                    <FileUpload 
                      accept=".pdf,.jpg,.jpeg,.png"
                      label="Upload provider certificate"
                      onChange={async (files) => { 
                        a.setFiles("provider_cert", files); 
                        const f = files?.[0]; 
                        if (f) await uploadToServer(f, "provider_cert"); 
                      }} 
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">{t("wizard.mobile.willProvide")}</p>
                )}
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-between">
            <button className="text-gray-600" onClick={a.prevStep}>← {t("wizard.back")}</button>
            <button className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50" disabled={!canContinue} onClick={a.nextStep}>{t("wizard.next")}</button>
          </div>
        </div>
      );
    }
    case "review": {
      const missing: string[] = [];
      const needBank = answers.bundleType === "full";
      if (!answers.hasValidId || !answers.idType) missing.push(t("wizard.review.missingItems.validId"));
      if (!answers.hasBirthCertificate) missing.push(t("wizard.review.missingItems.birthCertificate"));
      if (!answers.hasAddressProof) missing.push(t("wizard.review.missingItems.addressProof"));
      if (!answers.recentDocsConfirmed) missing.push(t("wizard.review.missingItems.recentDocs"));
      if (answers.isMarried && !(answers.files["marriage_certificate"]?.length)) missing.push(t("wizard.review.missingItems.marriageCertificate"));
      if (!(answers.files["id_document"]?.length)) missing.push(t("wizard.review.missingItems.idUpload"));
      if (!(answers.files["birth_certificate"]?.length)) missing.push(t("wizard.review.missingItems.birthUpload"));
      if (!(answers.files["address_proof"]?.length)) missing.push(t("wizard.review.missingItems.addressUpload"));
      if (needBank) {
        if (!answers.bank.financialDocType) missing.push(t("wizard.review.missingItems.financialDoc"));
        if (!(answers.files["financial_doc"]?.length)) missing.push(t("wizard.review.missingItems.financialUpload"));
        if (answers.bank.proofOfAddressOption !== "id_address" && !(answers.files["address_doc"]?.length)) missing.push(t("wizard.review.missingItems.bankAddressUpload"));
        if (!answers.bank.employmentLine) missing.push(t("wizard.review.missingItems.employerText"));
        if (!(answers.files["employer_certificate"]?.length)) missing.push(t("wizard.review.missingItems.employerUpload"));
        if (answers.bank.mobileOption === "eu_number" && !(answers.files["mobile_bill"]?.length)) missing.push(t("wizard.review.missingItems.mobileBill"));
        if (answers.bank.mobileOption === "greek_number" && answers.bank.hasGreekNumber && !(answers.files["provider_cert"]?.length)) missing.push(t("wizard.review.missingItems.providerCert"));
      }
      const pass = missing.length === 0 && answers.consentSelf && answers.consentNoCoercion && answers.consentGenuineDocs;
      return (
        <div>
          <SectionTitle>{t("wizard.review.title")}</SectionTitle>
          {pass ? (
            <p className="text-green-700">{t("wizard.review.passed")}</p>
          ) : (
            <div>
              <p className="text-red-700 mb-2">{t("wizard.review.missing")}</p>
              <ul className="list-disc pl-5 text-red-700">
                {missing.map((m) => <li key={m}>{m}</li>)}
              </ul>
            </div>
          )}
          <div className="mt-6 flex justify-between">
            <button className="text-gray-600" onClick={a.prevStep}>← {t("wizard.back")}</button>
            <button className="rounded-md bg-green-600 text-white px-4 py-2 disabled:opacity-50" disabled={!pass} onClick={a.gotoCheckout}>{t("wizard.review.proceedToCheckout")}</button>
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

function isAdult(isoDate: string): boolean {
  if (!isoDate) return false;
  const dob = new Date(isoDate);
  const now = new Date();
  const age = now.getFullYear() - dob.getFullYear() - ((now.getMonth() < dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())) ? 1 : 0);
  return age >= 18;
}

function normalizePlace(input: string): string {
  const trimmed = (input || "").trim();
  if (!trimmed) return "";
  return trimmed
    .toLowerCase()
    .split(/\s+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

