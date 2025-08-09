export type ProductCategory = "translytic" | "taxlytic" | "homelytic";

export type ProductId = 
  // Translytic
  | "starter_single" 
  | "starter_couple"
  | "full_single"
  | "full_couple"
  | "addon_bank_single"
  | "addon_bank_couple"
  | "addon_govgr_single"
  | "addon_govgr_couple"
  | "addon_translations_single"
  | "addon_translations_couple"
  // Taxlytic
  | "annual_e9_single"
  | "annual_e9_couple"
  | "annual_e9_family"
  | "due_diligence"
  // Homelytic
  | "property_portfolio"
  | "e2e_purchase"
  | "investment_analysis"
  | "contract_drafting";

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
}

export const products: Product[] = [
  // Translytic Products
  {
    id: "starter_single",
    category: "translytic",
    titleKey: "wizard.step2.translytic.starter_single.title",
    subtitleKey: "wizard.step2.translytic.starter_single.subtitle",
    price: {
      single: "299",
      display: "€299"
    },
    flags: { bundle: true },
    role: "Base"
  },
  {
    id: "starter_couple",
    category: "translytic", 
    titleKey: "wizard.step2.translytic.starter_couple.title",
    subtitleKey: "wizard.step2.translytic.starter_couple.subtitle",
    price: {
      couple: "575",
      display: "€575"
    },
    flags: { bundle: true },
    role: "Base"
  },
  {
    id: "full_single",
    category: "translytic",
    titleKey: "wizard.step2.translytic.full_single.title", 
    subtitleKey: "wizard.step2.translytic.full_single.subtitle",
    price: {
      single: "475",
      display: "€475"
    },
    flags: { bundle: true },
    role: "Base"
  },
  {
    id: "full_couple",
    category: "translytic",
    titleKey: "wizard.step2.translytic.full_couple.title",
    subtitleKey: "wizard.step2.translytic.full_couple.subtitle", 
    price: {
      couple: "925",
      display: "€925"
    },
    flags: { bundle: true },
    role: "Base"
  },
  {
    id: "addon_bank_single",
    category: "translytic",
    titleKey: "wizard.step2.translytic.addon_bank_single.title",
    subtitleKey: "wizard.step2.translytic.addon_bank_single.subtitle",
    price: {
      single: "175",
      display: "€175"
    },
    flags: { addon: true },
    role: "Addon"
  },
  {
    id: "addon_bank_couple", 
    category: "translytic",
    titleKey: "wizard.step2.translytic.addon_bank_couple.title",
    subtitleKey: "wizard.step2.translytic.addon_bank_couple.subtitle",
    price: {
      couple: "325", 
      display: "€325"
    },
    flags: { addon: true },
    role: "Addon"
  },
  {
    id: "addon_govgr_single",
    category: "translytic",
    titleKey: "wizard.step2.translytic.addon_govgr_single.title",
    subtitleKey: "wizard.step2.translytic.addon_govgr_single.subtitle",
    price: {
      single: "89",
      display: "€89"
    },
    flags: { addon: true },
    role: "Upsell"
  },
  {
    id: "addon_govgr_couple",
    category: "translytic", 
    titleKey: "wizard.step2.translytic.addon_govgr_couple.title",
    subtitleKey: "wizard.step2.translytic.addon_govgr_couple.subtitle",
    price: {
      couple: "160",
      display: "€160"
    },
    flags: { addon: true },
    role: "Upsell"
  },
  {
    id: "addon_translations_single",
    category: "translytic",
    titleKey: "wizard.step2.translytic.addon_translations_single.title", 
    subtitleKey: "wizard.step2.translytic.addon_translations_single.subtitle",
    price: {
      single: "45",
      display: "€45"
    },
    flags: { addon: true },
    role: "Addon"
  },
  {
    id: "addon_translations_couple",
    category: "translytic",
    titleKey: "wizard.step2.translytic.addon_translations_couple.title",
    subtitleKey: "wizard.step2.translytic.addon_translations_couple.subtitle", 
    price: {
      couple: "85",
      display: "€85"
    },
    flags: { addon: true },
    role: "Addon"
  },

  // Taxlytic Products
  {
    id: "annual_e9_single",
    category: "taxlytic",
    titleKey: "wizard.step2.taxlytic.annual_e9_single.title",
    subtitleKey: "wizard.step2.taxlytic.annual_e9_single.subtitle",
    price: {
      single: "24.90",
      display: "€24.90"
    },
    flags: { recurring: true, standalone: true },
    role: "Recurring"
  },
  {
    id: "annual_e9_couple",
    category: "taxlytic",
    titleKey: "wizard.step2.taxlytic.annual_e9_couple.title", 
    subtitleKey: "wizard.step2.taxlytic.annual_e9_couple.subtitle",
    price: {
      couple: "49.90",
      display: "€49.90"
    },
    flags: { recurring: true, standalone: true },
    role: "Recurring"
  },
  {
    id: "annual_e9_family",
    category: "taxlytic",
    titleKey: "wizard.step2.taxlytic.annual_e9_family.title",
    subtitleKey: "wizard.step2.taxlytic.annual_e9_family.subtitle",
    price: {
      family: "59.90",
      extraChild: "10",
      display: "€59.90 + €10/extra child"
    },
    flags: { recurring: true, standalone: true },
    role: "Recurring"
  },
  {
    id: "due_diligence",
    category: "taxlytic",
    titleKey: "wizard.step2.taxlytic.due_diligence.title",
    subtitleKey: "wizard.step2.taxlytic.due_diligence.subtitle", 
    price: {
      display: "Price TBD"
    },
    flags: { standalone: true },
    role: "Standalone"
  },

  // Homelytic Products
  {
    id: "property_portfolio",
    category: "homelytic",
    titleKey: "wizard.step2.homelytic.property_portfolio.title",
    subtitleKey: "wizard.step2.homelytic.property_portfolio.subtitle",
    price: {
      display: "Price TBD"
    },
    flags: { standalone: true },
    role: "Standalone"
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
    role: "Standalone"
  },
  {
    id: "investment_analysis",
    category: "homelytic",
    titleKey: "wizard.step2.homelytic.investment_analysis.title",
    subtitleKey: "wizard.step2.homelytic.investment_analysis.subtitle", 
    price: {
      display: "Price TBD"
    },
    flags: { standalone: true },
    role: "Standalone"
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
    role: "Standalone"
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