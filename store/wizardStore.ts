import { create } from "zustand";
import type { ProductId } from "@/app/(wizard)/wizard/data/products";

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
  email: string;
  mobilePhone: string;
}

export interface BankOptions {
  financialDocType: "tax_clearance" | "annual_wage_statement" | "";
  proofOfAddressOption: "utility" | "registration" | "id_address" | "";
  employmentLine: string;
  mobileOption: "eu_number" | "greek_number" | "";
  hasGreekNumber: boolean;
}

export type Audience =
  | "homeBuyers"
  | "diasporaHeirs" 
  | "expats"
  | "homeOwners"
  | "investors"
  | "professionals";

export interface ProfessionalsInfo {
  interests: string[]; // api, bulk, referral
}

export interface WizardAnswers {
  audience?: Audience;
  bundleType: BundleType | null;
  selectedProducts: ProductId[]; // products selected in Step 2
  professionals: ProfessionalsInfo; // professional interests for B2B
  isMarried: boolean;
  isCouple: boolean; // purchase couple variant
  idType: "passport" | "id" | "";
  hasValidId: boolean;
  hasBirthCertificate: boolean;
  hasAddressProof: boolean;
  recentDocsConfirmed: boolean;
  hasMarriageCertificate: boolean;
  // Consents & POA
  consentSelf: boolean; // confirms acting only for self
  consentNoCoercion: boolean; // confirms not coerced
  consentGenuineDocs: boolean; // confirms genuine documents belonging to the user
  poaAccepted: boolean; // confirms POA reviewed & signed
  personal: PersonalInfo;
  files: Record<string, File[]>; // keys: id_document, birth_certificate, address_proof, marriage_certificate, financial_doc, address_doc, employer_certificate, mobile_bill, provider_cert
  bank: BankOptions;
}

interface WizardState {
  step: number;
  answers: WizardAnswers;
  nextStep: () => void;
  prevStep: () => void;
  skipToStep: (stepIndex: number) => void;
  update: (partial: Partial<WizardAnswers>) => void;
  setFiles: (key: string, files: FileList | null) => void;
  addProduct: (productId: ProductId) => void;
  removeProduct: (productId: ProductId) => void;
  toggleProduct: (productId: ProductId) => void;
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
    email: "",
    mobilePhone: "",
};

const initialAnswers: WizardAnswers = {
  audience: undefined,
  bundleType: null,
  selectedProducts: [],
  professionals: {
    interests: [],
  },
  isMarried: false,
  isCouple: false,
  idType: "",
  hasValidId: false,
  hasBirthCertificate: false,
  hasAddressProof: false,
  recentDocsConfirmed: false,
  hasMarriageCertificate: false,
  consentSelf: false,
  consentNoCoercion: false,
  consentGenuineDocs: false,
  poaAccepted: false,
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

export const useWizardStore = create<WizardState>((set, get) => ({
  step: 0,
  answers: initialAnswers,
  nextStep: () => set((state) => {
    const isStarter = state.answers.selectedProducts.includes("starter_bundle");
    const currentStep = state.step;
    let nextStep = currentStep + 1;
    
    // Skip bank steps for starter bundle
    if (isStarter) {
      if (currentStep === 7) nextStep = 11; // Skip bank_overview, bank_docs, bank_mobile (steps 8,9,10)
    }
    
    return { step: nextStep };
  }),
  prevStep: () => set((state) => {
    const isStarter = state.answers.selectedProducts.includes("starter_bundle");
    const currentStep = state.step;
    let prevStep = Math.max(currentStep - 1, 0);
    
    // Skip bank steps for starter bundle when going back
    if (isStarter) {
      if (currentStep === 11) prevStep = 7; // Skip bank steps when going back from review
    }
    
    return { step: prevStep };
  }),
  skipToStep: (stepIndex: number) => set(() => ({ step: stepIndex })),
  update: (partial) =>
    set((state) => ({ answers: { ...state.answers, ...partial } })),
  setFiles: (key, files) =>
    set((state) => {
      const arr: File[] = files ? Array.from(files) : [];
      return { answers: { ...state.answers, files: { ...state.answers.files, [key]: arr } } };
    }),
  addProduct: (productId) =>
    set((state) => {
      const products = state.answers.selectedProducts;
      if (!products.includes(productId)) {
        return { answers: { ...state.answers, selectedProducts: [...products, productId] } };
      }
      return state;
    }),
  removeProduct: (productId) =>
    set((state) => {
      const products = state.answers.selectedProducts.filter(id => id !== productId);
      return { answers: { ...state.answers, selectedProducts: products } };
    }),
  toggleProduct: (productId) =>
    set((state) => {
      const products = state.answers.selectedProducts;
      const isSelected = products.includes(productId);
      const newProducts = isSelected 
        ? products.filter(id => id !== productId)
        : [...products, productId];
      return { answers: { ...state.answers, selectedProducts: newProducts } };
    }),
  reset: () => set({ step: 0, answers: initialAnswers }),
}));