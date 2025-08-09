"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Audience } from "@/store/wizardStore";

interface Step1AudienceProps {
  selectedAudience: Audience | null;
  onAudienceSelect: (audience: Audience) => void;
  onContinue: () => void;
}

const audienceOptions: Audience[] = [
  "homeBuyers",
  "diasporaHeirs", 
  "expats",
  "homeOwners",
  "investors",
  "professionals"
];

export function Step1Audience({ selectedAudience, onAudienceSelect, onContinue }: Step1AudienceProps) {
  const t = useTranslations();

  const handleCardSelect = (audience: Audience) => {
    onAudienceSelect(audience);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">{t("wizard.step1.title")}</h2>
        <p className="text-gray-600">{t("wizard.step1.subtitle")}</p>
      </div>

      {/* Grid: 2 columns × 3 rows on md+, stack on mobile */}
      <div className="grid gap-4 md:grid-cols-2">
        {audienceOptions.map((audience, index) => {
          const isSelected = selectedAudience === audience;
          const gridPositions = [
            "md:order-1", // homeBuyers - Top Left
            "md:order-2", // diasporaHeirs - Top Right  
            "md:order-3", // expats - Middle Left
            "md:order-4", // homeOwners - Middle Right
            "md:order-5", // investors - Bottom Left
            "md:order-6"  // professionals - Bottom Right
          ];
          
          return (
            <motion.div
              key={audience}
              className={`${gridPositions[index]} relative`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                role="radio"
                aria-checked={isSelected}
                data-audience={audience}
                onClick={() => handleCardSelect(audience)}
                className={`
                  w-full text-left p-6 rounded-2xl border-2 transition-all duration-200
                  hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t(`wizard.step1.cards.${audience}.title`)}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t(`wizard.step1.cards.${audience}.description`)}
                  </p>
                  <div className="flex justify-end">
                    <span className={`
                      px-3 py-1 text-xs font-medium rounded-full transition-colors
                      ${isSelected 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {isSelected ? t("wizard.step1.selected") : t("wizard.step1.select")}
                    </span>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <button
          disabled={!selectedAudience}
          onClick={onContinue}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {t("wizard.continue")}
        </button>
      </div>
    </div>
  );
}