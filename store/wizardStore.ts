import { create } from "zustand";

interface WizardState {
  step: number;
  answers: Record<string, string>;
  nextStep: () => void;
  prevStep: () => void;
  setAnswer: (stepKey: string, value: string) => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  step: 0,
  answers: {},
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 0) })),
  setAnswer: (stepKey, value) =>
    set((state) => ({
      answers: { ...state.answers, [stepKey]: value }
    }))
})); 