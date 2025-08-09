// Translation pricing calculator
// Base price: €45 per document
// Volume discount: €30 per document for 1-10 documents

export function calculateTranslationPrice(documentCount: number): number {
  if (documentCount < 1 || documentCount > 10) {
    throw new Error("Document count must be between 1 and 10");
  }
  
  // Volume pricing: €30 per document for any quantity 1-10
  const pricePerDocument = 30;
  return documentCount * pricePerDocument;
}

export function formatTranslationPrice(documentCount: number): string {
  const totalPrice = calculateTranslationPrice(documentCount);
  return `€${totalPrice} incl. VAT (${documentCount} document${documentCount > 1 ? 's' : ''})`;
}

export const TRANSLATION_LIMITS = {
  MIN_DOCUMENTS: 1,
  MAX_DOCUMENTS: 10,
  MAX_PAGES_PER_DOCUMENT: 6, // technically possible up to 6 pages
  RECOMMENDED_MAX_PAGES: 4, // recommended maximum
  MAX_CHARACTERS_PER_PAGE: 3000
} as const;