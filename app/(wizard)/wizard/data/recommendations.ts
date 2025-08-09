import type { Audience, ProductId } from "@/store/wizardStore";

// Recommendation matrix based on user requirements
// Mapping user columns to our audiences:
// - "expats" → Expats column
// - "homeBuyers" → Interested Buyers column  
// - "homeOwners" → Existing Owners column
// - "investors" → Investors column
// - "diasporaHeirs" → mirror Existing Owners + Certified Translations (B2C) + Annual E9
// - "professionals" → Certified Translations (Standalone/Packs), B2B API License, B2B Transactions, Referral Program

export const recommendations: Record<Audience, Set<ProductId>> = {
  // Expats column: ✅ for Starter, Full-Service, Gov.gr & E1, Bank onboarding, Certified Trans (B2C), Certified Trans (Standalone/Packs), Self-service E9
  expats: new Set([
    "starter_single",
    "starter_couple", 
    "full_single",
    "full_couple",
    "addon_govgr_single",
    "addon_govgr_couple",
    "addon_bank_single",
    "addon_bank_couple",
    "addon_translations_single",
    "addon_translations_couple",
    // Self-service E9 would map to our annual E9 products
    "annual_e9_single",
    "annual_e9_couple"
  ]),

  // Interested Buyers column: ✅ for Starter, Full-Service, Gov.gr & E1, Bank onboarding, Certified Trans (B2C), Certified Trans (Standalone/Packs)
  homeBuyers: new Set([
    "starter_single",
    "starter_couple",
    "full_single", 
    "full_couple",
    "addon_govgr_single",
    "addon_govgr_couple",
    "addon_bank_single",
    "addon_bank_couple",
    "addon_translations_single",
    "addon_translations_couple"
  ]),

  // Existing Owners column: ✅ for Annual E9 (B2C), Certified Trans (B2C), Certified Trans (Standalone/Packs), Self-service E9
  homeOwners: new Set([
    "annual_e9_single",
    "annual_e9_couple", 
    "annual_e9_family",
    "addon_translations_single",
    "addon_translations_couple"
  ]),

  // Investors column: ✅ for Starter, Full-Service, Gov.gr & E1, Bank onboarding, Annual E9 (B2C), Certified Trans (B2C), Certified Trans (Standalone/Packs), Self-service E9
  investors: new Set([
    "starter_single",
    "starter_couple",
    "full_single",
    "full_couple", 
    "addon_govgr_single",
    "addon_govgr_couple",
    "addon_bank_single",
    "addon_bank_couple",
    "annual_e9_single",
    "annual_e9_couple",
    "annual_e9_family",
    "addon_translations_single",
    "addon_translations_couple"
  ]),

  // Diaspora Heirs: mirror Existing Owners + Certified Translations (B2C) + Annual E9
  // This matches homeOwners but we'll be explicit for clarity
  diasporaHeirs: new Set([
    "annual_e9_single",
    "annual_e9_couple",
    "annual_e9_family", 
    "addon_translations_single",
    "addon_translations_couple"
  ]),

  // Professionals: Certified Translations (Standalone/Packs), B2B API License, B2B Transactions, Referral Program
  // Note: B2B products don't exist in our current catalog, so we'll focus on translations
  professionals: new Set([
    "addon_translations_single",
    "addon_translations_couple"
    // Future B2B products would be added here:
    // "b2b_api_license",
    // "b2b_transactions", 
    // "referral_program"
  ])
};

// Helper function to get recommendations for a specific audience
export const getRecommendationsForAudience = (audience: Audience | undefined): Set<ProductId> => {
  if (!audience) return new Set();
  return recommendations[audience] || new Set();
};

// Helper function to check if a product is recommended for an audience
export const isProductRecommended = (productId: ProductId, audience: Audience | undefined): boolean => {
  if (!audience) return false;
  return recommendations[audience]?.has(productId) || false;
};