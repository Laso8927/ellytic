export type ProductCategory = "translytic" | "taxlytic" | "homelytic";

import type { Audience } from "@/store/wizardStore";

export type ProductId = 
  // Translytic - Core Bundles
  | "starter_bundle"
  | "full_service_bundle"
  // Post-Purchase Add-ons
  | "additional_documents"
  | "govgr_concierge"
  // Taxlytic
  | "annual_e9_single"
  | "annual_e9_couple"
  | "annual_e9_family"
  | "due_diligence"
  // Homelytic
  | "property_portfolio"
  | "e2e_purchase"
  | "investment_analysis"
  | "contract_drafting"
  // Standalone
  | "standalone_translation";

export type ProductRole = "Base" | "Upsell" | "Addon" | "Recurring" | "Standalone";

export interface ProductFlags {
  bundle?: boolean;
  addon?: boolean;
  recurring?: boolean;
  standalone?: boolean;
}

export interface ProductPrice {
  single?: string;
  couple?: string;
  family?: string;
  extraChild?: string;
  display: string; // For UI display
}

export interface Product {
  id: ProductId;
  category: ProductCategory;
  titleKey: string;
  subtitleKey: string;
  price: ProductPrice;
  flags: ProductFlags;
  role: ProductRole;
  suitableAudiences?: Audience[]; // If set, indicates which audiences this product is suited for
}

export const products: Product[] = [
  // Core Bundles - Main Selection in Step 2
  {
    id: "starter_bundle",
    category: "translytic",
    titleKey: "wizard.step2.translytic.starter_bundle.title",
    subtitleKey: "wizard.step2.translytic.starter_bundle.subtitle",
    price: {
      display: "€299 incl. VAT"
    },
    flags: { bundle: true },
    role: "Base",
    suitableAudiences: ["expats", "homeBuyers", "investors", "diasporaHeirs"]
  },
  {
    id: "full_service_bundle",
    category: "translytic",
    titleKey: "wizard.step2.translytic.full_service_bundle.title", 
    subtitleKey: "wizard.step2.translytic.full_service_bundle.subtitle",
    price: {
      display: "€475 incl. VAT"
    },
    flags: { bundle: true },
    role: "Base",
    suitableAudiences: ["expats", "homeBuyers", "investors", "diasporaHeirs"]
  },

  // Post-Purchase Add-ons (not shown in Step 2)
  {
    id: "additional_documents",
    category: "translytic",
    titleKey: "wizard.postsale.additional_documents.title",
    subtitleKey: "wizard.postsale.additional_documents.subtitle",
    price: {
      display: "€24.90 per document"
    },
    flags: { addon: true },
    role: "Addon",
    suitableAudiences: ["expats", "homeBuyers", "investors", "diasporaHeirs", "homeOwners", "professionals"]
  },
  {
    id: "govgr_concierge",
    category: "translytic",
    titleKey: "wizard.postsale.govgr_concierge.title",
    subtitleKey: "wizard.postsale.govgr_concierge.subtitle",
    price: {
      single: "89",
      couple: "160",
      display: "€89 (Single) / €160 (Couple)"
    },
    flags: { addon: true },
    role: "Upsell"
  },

  // Taxlytic Products
  {
    id: "annual_e9_single",
    category: "taxlytic",
    titleKey: "wizard.step2.taxlytic.annual_e9_single.title",
    subtitleKey: "wizard.step2.taxlytic.annual_e9_single.subtitle",
    price: {
      single: "24.90",
      couple: "49.90",
      family: "59.90",
      extraChild: "10",
      display: "€24.90 (Single) / €49.90 (Couple) / €59.90 (family incl. 2 kids) + €10/child"
    },
    flags: { recurring: true, standalone: true },
    role: "Recurring",
    suitableAudiences: ["homeOwners", "diasporaHeirs"]
  },
  {
    id: "annual_e9_couple",
    category: "taxlytic",
    titleKey: "wizard.step2.taxlytic.annual_e9_couple.title", 
    subtitleKey: "wizard.step2.taxlytic.annual_e9_couple.subtitle",
    price: {
      single: "24.90",
      couple: "49.90",
      family: "59.90",
      extraChild: "10",
      display: "€24.90 (Single) / €49.90 (Couple) / €59.90 (family incl. 2 kids) + €10/child"
    },
    flags: { recurring: true, standalone: true },
    role: "Recurring",
    suitableAudiences: ["homeOwners", "diasporaHeirs"]
  },
  {
    id: "annual_e9_family",
    category: "taxlytic",
    titleKey: "wizard.step2.taxlytic.annual_e9_family.title",
    subtitleKey: "wizard.step2.taxlytic.annual_e9_family.subtitle",
    price: {
      single: "24.90",
      couple: "49.90",
      family: "59.90",
      extraChild: "10",
      display: "€24.90 (Single) / €49.90 (Couple) / €59.90 (family incl. 2 kids) + €10/child"
    },
    flags: { recurring: true, standalone: true },
    role: "Recurring",
    suitableAudiences: ["homeOwners", "diasporaHeirs"]
  },
  {
    id: "due_diligence",
    category: "taxlytic",
    titleKey: "wizard.step2.taxlytic.due_diligence.title",
    subtitleKey: "wizard.step2.taxlytic.due_diligence.subtitle", 
    price: {
      display: "€499"
    },
    flags: { standalone: true },
    role: "Standalone",
    suitableAudiences: ["homeBuyers", "homeOwners", "investors"]
  },

  // Homelytic Products
  {
    id: "property_portfolio",
    category: "homelytic",
    titleKey: "wizard.step2.homelytic.property_portfolio.title",
    subtitleKey: "wizard.step2.homelytic.property_portfolio.subtitle",
    price: {
      display: "€39/month or €399/year"
    },
    flags: { standalone: true },
    role: "Standalone",
    suitableAudiences: ["investors", "homeBuyers"]
  },
  {
    id: "e2e_purchase",
    category: "homelytic",
    titleKey: "wizard.step2.homelytic.e2e_purchase.title",
    subtitleKey: "wizard.step2.homelytic.e2e_purchase.subtitle",
    price: {
      display: "Price TBD"
    },
    flags: { standalone: true },
    role: "Standalone",
    suitableAudiences: ["homeBuyers", "investors"]
  },
  {
    id: "investment_analysis",
    category: "homelytic",
    titleKey: "wizard.step2.homelytic.investment_analysis.title",
    subtitleKey: "wizard.step2.homelytic.investment_analysis.subtitle", 
    price: {
      display: "€899"
    },
    flags: { standalone: true },
    role: "Standalone",
    suitableAudiences: ["investors"]
  },
  {
    id: "contract_drafting",
    category: "homelytic",
    titleKey: "wizard.step2.homelytic.contract_drafting.title",
    subtitleKey: "wizard.step2.homelytic.contract_drafting.subtitle",
    price: {
      display: "Price TBD"
    },
    flags: { standalone: true },
    role: "Standalone",
    suitableAudiences: ["homeBuyers", "investors"]
  },
  
  // Standalone Services
  {
    id: "standalone_translation",
    category: "translytic",
    titleKey: "wizard.products.standalone_translation.title",
    subtitleKey: "wizard.products.standalone_translation.subtitle",
    price: {
      display: "€45 → €30 (1–10 docs volume)"
    },
    flags: { standalone: true },
    role: "Standalone",
    suitableAudiences: ["expats", "homeBuyers", "investors", "diasporaHeirs", "homeOwners", "professionals"]
  }
];

// Helper functions
export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: ProductId): Product | undefined => {
  return products.find(product => product.id === id);
};

export const categories: ProductCategory[] = ["translytic", "taxlytic", "homelytic"];