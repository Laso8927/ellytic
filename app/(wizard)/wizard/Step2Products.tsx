"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/store/wizardStore";
import { 
  ProductCategory, 
  Product, 
  ProductId,
  getProductsByCategory 
} from "./data/products";
import { isProductRecommended } from "./data/recommendations";
import { wizardAnalytics } from "@/lib/analytics";

interface Step2ProductsProps {
  onContinue: () => void;
}

const getRoleBadgeStyles = (role: string) => {
  switch (role) {
    case "Base":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Upsell":
      return "bg-green-100 text-green-800 border-green-200";
    case "Addon":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Recurring":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Standalone":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  isRecommended: boolean;
  selectable?: boolean;
  audience?: import("@/store/wizardStore").Audience | undefined;
  onToggle: (productId: ProductId) => void;
}

function ProductCard({ product, isSelected, isRecommended, selectable = true, audience, onToggle }: ProductCardProps) {
  const t = useTranslations();
  const notSuited = audience && product.suitableAudiences && !product.suitableAudiences.includes(audience);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer
        hover:shadow-lg hover:scale-[1.02] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
        min-h-[280px] flex flex-col justify-between
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200' 
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
      onClick={() => selectable && onToggle(product.id)}
    >
      {/* Recommendation Badge */}
      {isRecommended && (
        <div className="absolute -top-2 -right-2 z-10">
          <span className="px-2 py-1 text-xs font-medium bg-green-500 text-white rounded-full shadow-md">
            ⭐ {t("wizard.step2.recommended")}
          </span>
        </div>
      )}

      {/* Price Display */}
      <div className="flex justify-end mb-3">
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {product.price.display}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {t(product.titleKey)}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {t(product.subtitleKey)}
        </p>

        {/* Suitability info */}
        {notSuited && (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
            {t("wizard.step2.suitability.onlyFor")} {product.suitableAudiences?.map((aud) => t(`wizard.step1.cards.${aud}.title`)).join(", ")}
          </div>
        )}

        {/* Action Buttons */}
        {selectable && (
          <div className="flex justify-end gap-2 pt-2">
            <button 
              className={`
                px-4 py-2 text-sm font-medium rounded-lg transition-colors
                ${isSelected
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
              onClick={(e) => {
                e.stopPropagation();
                onToggle(product.id);
              }}
            >
              {isSelected ? 'Remove' : 'Add'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ProfessionalsGate() {
  const t = useTranslations();
  const router = useRouter();
  const { answers, update } = useWizardStore();

  const professionalOptions = [
    { id: "api", key: "wizard.step2.professionals.api" },
    { id: "bulk", key: "wizard.step2.professionals.bulk" },
    { id: "referral", key: "wizard.step2.professionals.referral" }
  ];

  const handleInterestToggle = (interestId: string) => {
    const currentInterests = answers.professionals.interests;
    const newInterests = currentInterests.includes(interestId)
      ? currentInterests.filter(id => id !== interestId)
      : [...currentInterests, interestId];
    
    update({
      professionals: {
        interests: newInterests
      }
    });
  };

  const handleContactSales = () => {
    const interests = answers.professionals.interests;
    wizardAnalytics.proContactStarted(interests, 'professionals');
    const interestsParam = interests.join(",");
    router.push(`/contact-sales?audience=professionals&interests=${interestsParam}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">{t("wizard.step2.professionals.title")}</h2>
        <p className="text-gray-600">{t("wizard.step2.professionals.subtitle")}</p>
      </div>

      {/* Professional Options */}
      <div className="space-y-4">
        {professionalOptions.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              p-6 rounded-xl border-2 cursor-pointer transition-all duration-200
              hover:shadow-lg hover:scale-[1.02] 
              ${answers.professionals.interests.includes(option.id)
                ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
            onClick={() => handleInterestToggle(option.id)}
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={answers.professionals.interests.includes(option.id)}
                onChange={() => handleInterestToggle(option.id)}
                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t(`${option.key}.title`)}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t(`${option.key}.description`)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contact Sales CTA */}
      <div className="flex justify-end pt-4">
        <button
          disabled={answers.professionals.interests.length === 0}
          onClick={handleContactSales}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {t("wizard.step2.professionals.contactSales")}
        </button>
      </div>
    </div>
  );
}

export function Step2Products({ onContinue }: Step2ProductsProps) {
  const t = useTranslations();
  const router = useRouter();
  const { answers, toggleProduct, update } = useWizardStore();

  // Check if audience is professionals - show gate instead of products
  if (answers.audience === "professionals") {
    return <ProfessionalsGate />;
  }

  // Prepare category sections
  const translyticProducts = getProductsByCategory("translytic").filter(p => (p.flags.bundle || p.id === "standalone_translation") && !p.flags.addon);
  const taxlyticProducts = getProductsByCategory("taxlytic").filter(p => p.id === "annual_e9_single" || p.id === "due_diligence");
  const homelyticProducts = getProductsByCategory("homelytic");

  const hasBundleSelected = answers.selectedProducts.includes("starter_bundle") || answers.selectedProducts.includes("full_service_bundle");
  const hasStandaloneSelected = answers.selectedProducts.includes("standalone_translation");
  const hasTaxlyticSelected = answers.selectedProducts.some(id => 
    id === "annual_e9_single" || id === "due_diligence"
  );
  const hasHomelyticSelected = answers.selectedProducts.some(id => 
    ["property_portfolio", "e2e_purchase", "investment_analysis", "contract_drafting"].includes(id)
  );
  const hasSelectedProducts = hasBundleSelected || hasStandaloneSelected || hasTaxlyticSelected || hasHomelyticSelected;
  const [showValidationHint, setShowValidationHint] = useState(false);

  const handleContinue = () => {
    if (!hasSelectedProducts) {
      setShowValidationHint(true);
      wizardAnalytics.validationFailed(2, 'no_choice_selected');
      // Hide hint after 3 seconds
      setTimeout(() => setShowValidationHint(false), 3000);
      return;
    }

    // Check if user selected only Taxlytic or Homelytic products
    const hasTranslyticProducts = answers.selectedProducts.some(id => 
      id === "starter_bundle" || id === "full_service_bundle" || id === "standalone_translation"
    );
    const hasTaxlyticProducts = answers.selectedProducts.some(id => 
      id === "annual_e9_single" || id === "due_diligence"
    );
    const hasHomelyticProducts = answers.selectedProducts.some(id => 
      ["property_portfolio", "e2e_purchase", "investment_analysis", "contract_drafting"].includes(id)
    );

    // If only Taxlytic/Homelytic products selected, redirect to contact sales
    if ((hasTaxlyticProducts || hasHomelyticProducts) && !hasTranslyticProducts) {
      const selectedProductNames = answers.selectedProducts.join(",");
      wizardAnalytics.stepCompleted(2, answers.audience);
      router.push(`/contact-sales?audience=${answers.audience}&products=${selectedProductNames}&source=wizard_step2`);
      return;
    }

    wizardAnalytics.stepCompleted(2, answers.audience);
    onContinue();
  };

  const handleProductToggle = (productId: ProductId) => {
    const wasSelected = answers.selectedProducts.includes(productId);
    // Enforce exclusivity between core bundles
    const isBundle = productId === "starter_bundle" || productId === "full_service_bundle";
    if (!wasSelected && isBundle) {
      // remove the other bundle if selected
      const other = productId === "starter_bundle" ? "full_service_bundle" : "starter_bundle";
      if (answers.selectedProducts.includes(other as ProductId)) {
        toggleProduct(other as ProductId); // remove other
      }
    }
    
    if (wasSelected) {
      wizardAnalytics.productRemoved(productId, answers.audience || 'unknown');
    } else {
      const isRecommended = productId === "full_service_bundle"; // Only full-service shows recommended badge
      wizardAnalytics.productAdded(productId, answers.audience || 'unknown', isRecommended);
    }
    
    toggleProduct(productId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">{t("wizard.step2.title")}</h2>
        <p className="text-gray-600">{t("wizard.step2.subtitle")}</p>
      </div>

      {/* Category Sections */}
      <div className="space-y-8">
        {/* Translytic Section */}
        <section className="rounded-2xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold mb-4">{t("wizard.step2.tabs.translytic")}</h3>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 max-w-4xl">
            {translyticProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={answers.selectedProducts.includes(product.id)}
                isRecommended={product.id === "full_service_bundle"}
                audience={answers.audience}
                selectable={true}
                onToggle={handleProductToggle}
              />
            ))}
          </div>
        </section>

        {/* Taxlytic Section */}
        <section className="rounded-2xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold">{t("wizard.step2.tabs.taxlytic")}</h3>
            <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
              {t("wizard.step2.contactSalesFlow")}
            </div>
          </div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 max-w-4xl">
            {taxlyticProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={answers.selectedProducts.includes(product.id)}
                isRecommended={false}
                audience={answers.audience}
                selectable={true}
                onToggle={handleProductToggle}
              />
            ))}
          </div>
        </section>

        {/* Homelytic Section */}
        <section className="rounded-2xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold">{t("wizard.step2.tabs.homelytic")}</h3>
            <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
              {t("wizard.step2.contactSalesFlow")}
            </div>
          </div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 max-w-4xl">
            {homelyticProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={answers.selectedProducts.includes(product.id)}
                isRecommended={false}
                audience={answers.audience}
                selectable={true}
                onToggle={handleProductToggle}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Selected Products Summary */}
      {hasSelectedProducts && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <h4 className="font-medium text-blue-900 mb-2">
            {t("wizard.step2.selected.title")} ({answers.selectedProducts.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {answers.selectedProducts.map((productId) => (
              <span
                key={productId}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md"
              >
                {productId.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Validation Hint */}
      {showValidationHint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
        >
          <p className="text-red-800 text-sm font-medium">
            {t("wizard.validation.selectBundle")}
          </p>
        </motion.div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleContinue}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {t("wizard.continue")}
        </button>
      </div>
    </div>
  );
}