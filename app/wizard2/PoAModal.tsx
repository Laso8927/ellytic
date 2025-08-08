"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function PoAModal({ open, onClose, onAccepted }: { open: boolean; onClose: () => void; onAccepted: () => void }) {
  const t = useTranslations();
  const [accepted, setAccepted] = useState(false);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-w-2xl w-full bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-semibold">Εξουσιοδότηση (Πληρεξούσιο)</h3>
        <p className="mt-2 text-sm text-gray-700">
          Παρακαλούμε επιβεβαιώστε τα πεδία και υπογράψτε ηλεκτρονικά. Αυτό το πληρεξούσιο επιτρέπει στην ELLYTIC να καταθέσει τα αιτήματα εκ μέρους σας στις ελληνικές αρχές.
        </p>
        <div className="mt-4 grid gap-2 text-sm">
          <label className="inline-flex items-start gap-2"><input type="checkbox" onChange={(e)=> setAccepted(e.target.checked)} /> Συμφωνώ με τους όρους και τα πεδία της εξουσιοδότησης.</label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="px-4 py-2 rounded-md border" onClick={onClose}>Schließen</button>
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50" disabled={!accepted} onClick={onAccepted}>Weiter zur Signatur (DocuSign)</button>
        </div>
      </div>
    </div>
  );
}

