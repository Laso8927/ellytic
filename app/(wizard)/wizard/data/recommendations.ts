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
  // Expats: Recommend both core bundles for Step 2 selection
  expats: new Set([
    "starter_bundle",
    "full_service_bundle"
  ]),

  // Home Buyers: Recommend both bundles (they need AFM + setup)
  homeBuyers: new Set([
    "starter_bundle",
    "full_service_bundle"
  ]),

  // Home Owners: Only Annual E9 (they already have AFM)
  homeOwners: new Set([
    "annual_e9_single",
    "annual_e9_couple", 
    "annual_e9_family"
  ]),

  // Investors: Recommend both bundles (comprehensive needs)
  investors: new Set([
    "starter_bundle",
    "full_service_bundle",
    "annual_e9_single",
    "annual_e9_couple",
    "annual_e9_family"
  ]),

  // Diaspora Heirs: Similar to home owners
  diasporaHeirs: new Set([
    "annual_e9_single",
    "annual_e9_couple",
    "annual_e9_family"
  ]),

  // Professionals: No core bundle recommendations (they use B2B gate)
  professionals: new Set([
    // Empty - they go through professionals gate
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