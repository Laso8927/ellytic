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
  getProductsByCategory,
  getProductById
} from "./data/products";
import { isProductRecommended } from "./data/recommendations";
import { wizardAnalytics } from "@/lib/analytics";

interface Step2ProductsProps {
  onContinue: () => void;
  onBack?: () => void;
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
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className={`
        relative p-8 rounded-2xl transition-all duration-300 cursor-pointer backdrop-blur-sm
        min-h-[320px] flex flex-col justify-between overflow-hidden
        ${isSelected 
          ? 'bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border-2 border-blue-400/50 shadow-xl shadow-blue-200/50 ring-2 ring-blue-300/30' 
          : 'bg-white/80 border-2 border-gray-200/50 shadow-lg hover:shadow-2xl hover:border-blue-300/50 hover:bg-white/90'
        }
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none
      `}
      onClick={() => selectable && onToggle(product.id)}
    >
      {/* Recommendation Badge */}
      {isRecommended && (
        <div className="absolute -top-3 -right-3 z-20">
          <motion.span 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg backdrop-blur-sm border border-green-400/30"
          >
            <span className="mr-1">⭐</span>
            {t("wizard.step2.recommended")}
          </motion.span>
        </div>
      )}

      {/* Product Title - Top Left */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 text-left leading-tight">
          {t(product.titleKey)}
        </h3>
      </div>

      {/* Product Info */}
      <div className="flex-1 space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          {t(product.subtitleKey)}
        </p>

        {/* Suitability info */}
        {notSuited && (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
            {t("wizard.step2.suitability.onlyFor")} {product.suitableAudiences?.map((aud) => t(`wizard.step1.cards.${aud}.title`)).join(", ")}
          </div>
        )}
      </div>

      {/* Bottom Section with Price and Action */}
      <div className="flex items-end justify-between mt-auto pt-4">
        {/* Action Button - Bottom Left */}
        {selectable && (
          <button 
            className={`
              px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200
              ${isSelected
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              }
            `}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(product.id);
            }}
          >
            {isSelected ? 'Remove' : 'Select'}
          </button>
        )}
        
        {/* Price - Bottom Right */}
        <div className="text-right">
          <div className="text-lg font-bold text-blue-600">
            {product.price.display}
          </div>
        </div>
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

export function Step2Products({ onContinue, onBack }: Step2ProductsProps) {
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

    // Check if user selected products that require contact sales
    const contactSalesProducts = answers.selectedProducts.filter(productId => {
      const product = getProductById(productId);
      return product?.flags.contactSales;
    });

    // If any contact sales products selected, redirect to contact sales
    if (contactSalesProducts.length > 0) {
      const selectedProductNames = contactSalesProducts.join(",");
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
    <div className="space-y-12 max-w-8xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">{t("wizard.step2.title")}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("wizard.step2.subtitle")}</p>
      </div>

      {/* Category Sections */}
      <div className="space-y-16">
        {/* Translytic Section */}
        <section className="rounded-3xl border border-blue-200/30 p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 backdrop-blur-sm shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-4"></div>
            <h3 className="text-2xl font-bold text-gray-900">{t("wizard.step2.tabs.translytic")}</h3>
          </div>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl">
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
        <section className="rounded-3xl border border-green-200/30 p-8 bg-gradient-to-br from-green-50/50 to-emerald-50/30 backdrop-blur-sm shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-4"></div>
            <h3 className="text-2xl font-bold text-gray-900">{t("wizard.step2.tabs.taxlytic")}</h3>
          </div>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 max-w-5xl">
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
        <section className="rounded-3xl border border-purple-200/30 p-8 bg-gradient-to-br from-purple-50/50 to-pink-50/30 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-4"></div>
              <h3 className="text-2xl font-bold text-gray-900">{t("wizard.step2.tabs.homelytic")}</h3>
            </div>
            <div className="text-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full font-semibold shadow-md">
              {t("wizard.step2.contactSalesFlow")}
            </div>
          </div>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 max-w-5xl">
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
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/50 rounded-2xl p-6 text-center backdrop-blur-sm shadow-lg"
        >
          <p className="text-red-800 font-semibold">
            {t("wizard.validation.selectBundle")}
          </p>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-8">
        {/* Back Button */}
        {onBack && (
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-300/50 transition-all duration-300 backdrop-blur-sm border border-gray-200"
          >
            ← {t("wizard.back")}
          </motion.button>
        )}
        
        {/* Continue Button */}
        <motion.button
          onClick={handleContinue}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300/50 transition-all duration-300 backdrop-blur-sm border border-blue-400/30 ml-auto"
        >
          {t("wizard.continue")} →
        </motion.button>
      </div>
    </div>
  );
}