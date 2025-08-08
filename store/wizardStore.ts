import { create } from "zustand";

export type BundleType = "starter" | "full";

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  fatherFirstName: string;
  fatherLastName: string;
  motherFirstName: string;
  motherLastName: string;
  sex: "male" | "female" | "non_binary" | "";
  placeOfBirth: string;
  birthRegion: string;
  birthZipCode: string;
  birthCountry: string;
  dateOfBirth: string; // ISO yyyy-mm-dd
  currentStreet: string;
  currentCity: string;
  currentZipCode: string;
  currentCountry: string;
}

export interface BankOptions {
  financialDocType: "tax_clearance" | "annual_wage_statement" | "";
  proofOfAddressOption: "utility" | "registration" | "id_address" | "";
  employmentLine: string;
  mobileOption: "eu_number" | "greek_number" | "";
  hasGreekNumber: boolean;
}

export interface WizardAnswers {
  audience?: "expat" | "pensioner" | "buyer" | "investor" | "heir" | "diaspora";
  bundleType: BundleType | null;
  isMarried: boolean;
  isCouple: boolean; // purchase couple variant
  idType: "passport" | "id" | "";
  hasValidId: boolean;
  hasBirthCertificate: boolean;
  hasAddressProof: boolean;
  recentDocsConfirmed: boolean;
  hasMarriageCertificate: boolean;
  personal: PersonalInfo;
  files: Record<string, File[]>; // keys: id_document, birth_certificate, address_proof, marriage_certificate, financial_doc, address_doc, employer_certificate, mobile_bill, provider_cert
  bank: BankOptions;
}

interface WizardState {
  step: number;
  answers: WizardAnswers;
  nextStep: () => void;
  prevStep: () => void;
  update: (partial: Partial<WizardAnswers>) => void;
  setFiles: (key: string, files: FileList | null) => void;
  reset: () => void;
}

const emptyPersonal: PersonalInfo = {
  firstName: "",
  lastName: "",
  fatherFirstName: "",
  fatherLastName: "",
  motherFirstName: "",
  motherLastName: "",
  sex: "",
  placeOfBirth: "",
  birthRegion: "",
  birthZipCode: "",
  birthCountry: "",
  dateOfBirth: "",
  currentStreet: "",
  currentCity: "",
  currentZipCode: "",
  currentCountry: "",
};

const initialAnswers: WizardAnswers = {
  audience: undefined,
  bundleType: null,
  isMarried: false,
  isCouple: false,
  idType: "",
  hasValidId: false,
  hasBirthCertificate: false,
  hasAddressProof: false,
  recentDocsConfirmed: false,
  hasMarriageCertificate: false,
  personal: emptyPersonal,
  files: {},
  bank: {
    financialDocType: "",
    proofOfAddressOption: "",
    employmentLine: "",
    mobileOption: "",
    hasGreekNumber: false,
  },
};

export const useWizardStore = create<WizardState>((set) => ({
  step: 0,
  answers: initialAnswers,
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 0) })),
  update: (partial) =>
    set((state) => ({ answers: { ...state.answers, ...partial } })),
  setFiles: (key, files) =>
    set((state) => {
      const arr: File[] = files ? Array.from(files) : [];
      return { answers: { ...state.answers, files: { ...state.answers.files, [key]: arr } } };
    }),
  reset: () => set({ step: 0, answers: initialAnswers }),
}));