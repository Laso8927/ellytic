"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useWizardStore } from "@/store/wizardStore";
import { 
  ProductCategory, 
  Product, 
  ProductId,
  categories, 
  getProductsByCategory 
} from "./data/products";
import { isProductRecommended } from "./data/recommendations";

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
  onToggle: (productId: ProductId) => void;
}

function ProductCard({ product, isSelected, isRecommended, onToggle }: ProductCardProps) {
  const t = useTranslations();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer
        hover:shadow-lg hover:scale-[1.02] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200' 
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
      onClick={() => onToggle(product.id)}
    >
      {/* Recommendation Badge */}
      {isRecommended && (
        <div className="absolute -top-2 -right-2 z-10">
          <span className="px-2 py-1 text-xs font-medium bg-green-500 text-white rounded-full shadow-md">
            ⭐ {t("wizard.step2.recommended")}
          </span>
        </div>
      )}

      {/* Role Badge */}
      <div className="flex justify-between items-start mb-3">
        <span className={`
          px-2 py-1 text-xs font-medium rounded-full border
          ${getRoleBadgeStyles(product.role)}
        `}>
          {product.role}
        </span>
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

        {/* Flags */}
        <div className="flex flex-wrap gap-2">
          {product.flags.bundle && (
            <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md">
              Bundle
            </span>
          )}
          {product.flags.addon && (
            <span className="px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded-md">
              Add-on
            </span>
          )}
          {product.flags.recurring && (
            <span className="px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded-md">
              Recurring
            </span>
          )}
          {product.flags.standalone && (
            <span className="px-2 py-1 text-xs bg-gray-50 text-gray-700 rounded-md">
              Standalone
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button 
            className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Open learn more modal/tooltip
            }}
          >
            Learn more
          </button>
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
      </div>
    </motion.div>
  );
}

export function Step2Products({ onContinue }: Step2ProductsProps) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<ProductCategory>("translytic");
  const { answers, toggleProduct } = useWizardStore();

  // Get products for the current tab and sort with recommended first
  const allTabProducts = getProductsByCategory(activeTab);
  const tabProducts = allTabProducts.sort((a, b) => {
    const aRecommended = isProductRecommended(a.id, answers.audience);
    const bRecommended = isProductRecommended(b.id, answers.audience);
    
    // Recommended products come first
    if (aRecommended && !bRecommended) return -1;
    if (!aRecommended && bRecommended) return 1;
    
    // Within same recommendation status, maintain original order
    return 0;
  });

  const hasSelectedProducts = answers.selectedProducts.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">{t("wizard.step2.title")}</h2>
        <p className="text-gray-600">{t("wizard.step2.subtitle")}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === category
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={activeTab === category ? 'page' : undefined}
            >
              {t(`wizard.step2.tabs.${category}`)}
            </button>
          ))}
        </nav>
      </div>

      {/* Product Grid */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {tabProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard
              product={product}
              isSelected={answers.selectedProducts.includes(product.id)}
              isRecommended={isProductRecommended(product.id, answers.audience)}
              onToggle={toggleProduct}
            />
          </motion.div>
        ))}
      </motion.div>

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

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <button
          disabled={!hasSelectedProducts}
          onClick={onContinue}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {t("wizard.continue")}
        </button>
      </div>
    </div>
  );
}