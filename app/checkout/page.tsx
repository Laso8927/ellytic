"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { useTranslations } from "next-intl";

type BundleKey =
  | "starter_single"
  | "starter_couple"
  | "full_single"
  | "full_couple"
  | "translation";

const PRICES = {
  bundles: {
    starter_single: 325,
    starter_couple: 575,
    full_single: 475,
    full_couple: 875,
  },
  addons: {
    bank_onboarding: 150,
    gov_e1_single: 89,
    gov_e1_couple: 149,
    gov_e1_discount_per_person: 41,
  },
  translationBase: 45,
  translationTierMin: 19.9,
  extraPagePrice: 3.9,
};

function formatEUR(n: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);
}

export default function CheckoutPage() {
  const params = useSearchParams();
  const bundle = (params.get("bundle") || "starter_single") as BundleKey;
  const router = useRouter();
  const t = useTranslations();
  const [withGovE1, setWithGovE1] = useState(false);
  const [withBank, setWithBank] = useState(false);
  const [translationDocs, setTranslationDocs] = useState(1);
  const [translationPages, setTranslationPages] = useState(4);

  const isStarter = bundle === "starter_single" || bundle === "starter_couple";
  const isCouple = bundle.endsWith("couple");

  const basePrice = useMemo(() => {
    return PRICES.bundles[bundle as keyof typeof PRICES.bundles] ?? 0;
  }, [bundle]);

  const translationPerDoc = useMemo(() => {
    if (bundle !== "translation") return 0;
    const steps = 10;
    const start = PRICES.translationBase;
    const end = PRICES.translationTierMin;
    const docs = Math.min(Math.max(translationDocs, 1), 10);
    const price = start - ((start - end) * (docs - 1)) / (steps - 1);
    return Math.round(price * 100) / 100;
  }, [bundle, translationDocs]);

  const translationExtraPagesCost = useMemo(() => {
    if (bundle !== "translation") return 0;
    const pages = Math.min(Math.max(translationPages, 1), 10);
    const extra = Math.max(pages - 4, 0);
    return extra * PRICES.extraPagePrice * translationDocs;
  }, [bundle, translationPages, translationDocs]);

  const addonsPrice = useMemo(() => {
    let total = 0;
    if (withGovE1) total += isCouple ? PRICES.addons.gov_e1_couple : PRICES.addons.gov_e1_single;
    if (withBank && isStarter) total += PRICES.addons.bank_onboarding;
    if (isStarter && withGovE1 && withBank) {
      total -= isCouple ? PRICES.addons.gov_e1_discount_per_person * 2 : PRICES.addons.gov_e1_discount_per_person;
    }
    return total;
  }, [withGovE1, withBank, isStarter, isCouple]);

  const total = useMemo(() => {
    if (bundle === "translation") {
      return translationPerDoc * translationDocs + translationExtraPagesCost;
    }
    return basePrice + addonsPrice;
  }, [bundle, basePrice, addonsPrice, translationPerDoc, translationDocs, translationExtraPagesCost]);

  const consentsOk = params.get("consents") === "1";
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <Disclaimer className="mb-4" />
        {!consentsOk && (
          <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 text-amber-900 p-4">
            Please review the consents in the previous step before proceeding.
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 bg-white border rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-2">Selected: {labelize(bundle)}</h2>

            {bundle === "translation" ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">Certified Translation Service: pricing from 45€ down to 19,90€ per document (1–10 docs). Each document includes up to 4 pages. Extra pages cost 3,90€ per page. Max 10 pages per document.</div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium">Number of documents</span>
                    <input type="number" min={1} max={10} value={translationDocs} onChange={(e) => setTranslationDocs(Number(e.target.value))} className="mt-1 w-full rounded-md border-gray-300 focus:border-blue-600 focus:ring-blue-600" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">Pages per document</span>
                    <input type="number" min={1} max={10} value={translationPages} onChange={(e) => setTranslationPages(Number(e.target.value))} className="mt-1 w-full rounded-md border-gray-300 focus:border-blue-600 focus:ring-blue-600" />
                  </label>
                </div>
                <div className="text-sm text-gray-700">Current price per document: <strong>{formatEUR(translationPerDoc)}</strong></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">Add-ons</div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="h-4 w-4" checked={withGovE1} onChange={(e) => setWithGovE1(e.target.checked)} />
                    <span>Gov.gr & E1 Concierge Package ({isCouple ? formatEUR(PRICES.addons.gov_e1_couple) : formatEUR(PRICES.addons.gov_e1_single)})</span>
                  </label>
                  {isStarter && (
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="h-4 w-4" checked={withBank} onChange={(e) => setWithBank(e.target.checked)} />
                      <span>Bank Account Onboarding ({formatEUR(PRICES.addons.bank_onboarding)})</span>
                    </label>
                  )}
                  {isStarter && withGovE1 && withBank && (
                    <div className="text-sm text-green-700">Bundle discount applied: −{formatEUR(isCouple ? PRICES.addons.gov_e1_discount_per_person * 2 : PRICES.addons.gov_e1_discount_per_person)}</div>
                  )}
                </div>
                <div className="text-sm text-gray-600">Bundle customers receive vouchers for certified translations: Singles up to 3 docs for 24,90€ each; Couples up to 6 docs for 24,90€ each.</div>
              </div>
            )}
          </div>
          <div className="bg-gray-50 border rounded-2xl p-6 h-fit">
            <h3 className="font-semibold mb-4">Summary</h3>
            <ul className="text-sm space-y-2">
              {bundle !== "translation" ? (
                <>
                  <li className="flex justify-between"><span>Base</span><span>{formatEUR(basePrice)}</span></li>
                  {withGovE1 && <li className="flex justify-between"><span>Gov.gr & E1</span><span>{formatEUR(isCouple ? PRICES.addons.gov_e1_couple : PRICES.addons.gov_e1_single)}</span></li>}
                  {isStarter && withBank && <li className="flex justify-between"><span>Bank Onboarding</span><span>{formatEUR(PRICES.addons.bank_onboarding)}</span></li>}
                  {isStarter && withGovE1 && withBank && (
                    <li className="flex justify-between text-green-700"><span>Discount</span><span>-{formatEUR(isCouple ? PRICES.addons.gov_e1_discount_per_person * 2 : PRICES.addons.gov_e1_discount_per_person)}</span></li>
                  )}
                </>
              ) : (
                <>
                  <li className="flex justify-between"><span>Docs × {translationDocs} @ {formatEUR(translationPerDoc)}</span><span>{formatEUR(translationPerDoc * translationDocs)}</span></li>
                  {translationExtraPagesCost > 0 && <li className="flex justify-between"><span>Extra pages</span><span>{formatEUR(translationExtraPagesCost)}</span></li>}
                </>
              )}
            </ul>
            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatEUR(total)}</span>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              We are a professional, GDPR-compliant team. Data is processed and stored securely within Germany (EU law). Personal data is deleted 30 days after fulfilment; we retain only legally mandated metadata (name, contact details, payment records). See <a className="underline" href="/legal/privacy">Privacy</a>.
            </p>
            <button
              className="mt-6 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              onClick={(e) => {
                e.preventDefault();
                const qs = new URLSearchParams({
                  bundle,
                  gov: String(withGovE1 ? 1 : 0),
                  bank: String(withBank ? 1 : 0),
                });
                router.push(`/checkout/complete?${qs.toString()}`);
              }}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 

function labelize(key: string): string {
  const map: Record<string, string> = {
    starter_single: "Starter Bundle – Single",
    starter_couple: "Starter Bundle – Couple",
    full_single: "Full-Service – Single",
    full_couple: "Full-Service – Couple",
    translation: "Certified Translation Pack",
  };
  return map[key] || key;
} 