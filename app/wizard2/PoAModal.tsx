"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useWizardStore } from "@/store/wizardStore";
import { PoAData } from "@/lib/signature/types";

export function PoAModal({ open, onClose, onAccepted }: { open: boolean; onClose: () => void; onAccepted: () => void }) {
  const t = useTranslations();
  const { answers } = useWizardStore();
  const [step, setStep] = useState<"preview" | "form" | "signing">("preview");
  const [formData, setFormData] = useState<Partial<PoAData>>({
    authorizationType: "myself",
    declareAuthorize: true,
    onMyBehalf: true,
    onBehalfOf: false,
    toReceive: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  const handleCreateSignature = async () => {
    setIsLoading(true);
    try {
      const poaData: PoAData = {
        fullName: answers.personal.firstName + " " + answers.personal.lastName,
        fatherFullName: answers.personal.fatherFirstName + " " + answers.personal.fatherLastName,
        motherFullName: answers.personal.motherFirstName + " " + answers.personal.motherLastName,
        identityNumber: "PLACEHOLDER_ID", // From uploaded documents
        identityType: answers.idType as "passport" | "id",
        dateAuthority: "PLACEHOLDER_DATE",
        email: answers.personal.email,
        mobilePhone: answers.personal.mobilePhone,
        ...formData,
      } as PoAData;

      const response = await fetch("/api/signature/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(poaData),
      });

      if (!response.ok) throw new Error("Failed to create signature");

      const result = await response.json();
      
      // Open Yousign signature URL in new window
      window.open(result.signUrl, "_blank", "width=800,height=600");
      
      // For demo purposes, simulate completion after 3 seconds
      setTimeout(() => {
        onAccepted();
      }, 3000);
      
    } catch (error) {
      console.error("Signature creation failed:", error);
      alert("Fehler beim Erstellen der Signatur. Bitte versuchen Sie es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "preview") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative z-10 max-w-4xl w-full bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">AUTHORIZATION TO ISSUE TIN AND AUTHENTICATION KEY</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Full Name:</strong> {answers.personal.firstName} {answers.personal.lastName}</div>
              <div><strong>Date and Authority of Issue:</strong> [Wird automatisch ausgefüllt]</div>
              <div><strong>Father's Full Name:</strong> {answers.personal.fatherFirstName} {answers.personal.fatherLastName}</div>
              <div><strong>Competent Tax Office:</strong> [Wird automatisch bestimmt]</div>
              <div><strong>Mother's Full Name:</strong> {answers.personal.motherFirstName} {answers.personal.motherLastName}</div>
              <div></div>
              <div><strong>Identity Card or Passport Number:</strong> [Aus hochgeladenen Dokumenten]</div>
              <div><strong>TIN:</strong> [Wird beantragt]</div>
              <div className="col-span-2"><strong>Email Address:</strong> {answers.personal.email}</div>
              <div className="col-span-2"><strong>Mobile phone number:</strong> {answers.personal.mobilePhone}</div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">I declare that I authorize:</h4>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.declareAuthorize} onChange={(e) => setFormData({...formData, declareAuthorize: e.target.checked})} />
                  ELLYTIC to act as my representative
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.onMyBehalf} onChange={(e) => setFormData({...formData, onMyBehalf: e.target.checked})} />
                  on my behalf
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.toReceive} onChange={(e) => setFormData({...formData, toReceive: e.target.checked})} />
                  to submit a request for the simultaneous issuance of a TIN and an Authentication Key
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button className="px-4 py-2 rounded-md border" onClick={onClose}>Cancel</button>
            <button 
              className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50" 
              disabled={!formData.declareAuthorize || isLoading}
              onClick={handleCreateSignature}
            >
              {isLoading ? "Creating signature..." : "Sign with Yousign"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

