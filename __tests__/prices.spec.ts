import { describe, it, expect } from 'vitest';
import { products, getProductById } from '../app/(wizard)/wizard/data/products';

describe('Product Prices', () => {
  describe('core bundle pricing', () => {
    it('should have correct VAT-inclusive pricing for core bundles', () => {
      const starterSingle = getProductById('starter_single');
      expect(starterSingle?.price.display).toBe('€299 incl. VAT');
      
      const starterCouple = getProductById('starter_couple');
      expect(starterCouple?.price.display).toBe('€575 incl. VAT');
      
      const fullSingle = getProductById('full_single');
      expect(fullSingle?.price.display).toBe('€475 incl. VAT');
      
      const fullCouple = getProductById('full_couple');
      expect(fullCouple?.price.display).toBe('€925 incl. VAT');
    });

    it('should have consistent individual price components', () => {
      const starterSingle = getProductById('starter_single');
      expect(starterSingle?.price.single).toBe('299');
      
      const starterCouple = getProductById('starter_couple');
      expect(starterCouple?.price.couple).toBe('575');
      
      const fullSingle = getProductById('full_single');
      expect(fullSingle?.price.single).toBe('475');
      
      const fullCouple = getProductById('full_couple');
      expect(fullCouple?.price.couple).toBe('925');
    });
  });

  describe('add-on pricing', () => {
    it('should have correct combined display format for add-ons', () => {
      const bankAddon = getProductById('addon_bank_single');
      expect(bankAddon?.price.display).toBe('€175 (Single) / €325 (Couple)');
      
      const govgrAddon = getProductById('addon_govgr_single');
      expect(govgrAddon?.price.display).toBe('€89 (Single) / €160 (Couple)');
      
      const translationsAddon = getProductById('addon_translations_single');
      expect(translationsAddon?.price.display).toBe('€45 (Single) / €85 (Couple)');
    });

    it('should have consistent price components for add-ons', () => {
      const bankAddon = getProductById('addon_bank_single');
      expect(bankAddon?.price.single).toBe('175');
      expect(bankAddon?.price.couple).toBe('325');
      
      const govgrAddon = getProductById('addon_govgr_single');
      expect(govgrAddon?.price.single).toBe('89');
      expect(govgrAddon?.price.couple).toBe('160');
      
      const translationsAddon = getProductById('addon_translations_single');
      expect(translationsAddon?.price.single).toBe('45');
      expect(translationsAddon?.price.couple).toBe('85');
    });

    it('should have matching pricing between single and couple variants', () => {
      // Bank onboarding
      const bankSingle = getProductById('addon_bank_single');
      const bankCouple = getProductById('addon_bank_couple');
      expect(bankSingle?.price.display).toBe(bankCouple?.price.display);
      expect(bankSingle?.price.single).toBe(bankCouple?.price.single);
      expect(bankSingle?.price.couple).toBe(bankCouple?.price.couple);
      
      // Gov.gr & E1 Concierge
      const govgrSingle = getProductById('addon_govgr_single');
      const govgrCouple = getProductById('addon_govgr_couple');
      expect(govgrSingle?.price.display).toBe(govgrCouple?.price.display);
      
      // Translations
      const translationsSingle = getProductById('addon_translations_single');
      const translationsCouple = getProductById('addon_translations_couple');
      expect(translationsSingle?.price.display).toBe(translationsCouple?.price.display);
    });
  });

  describe('recurring pricing', () => {
    it('should have correct consolidated E9 pricing', () => {
      const expectedDisplay = '€24.90 (Single) / €49.90 (Couple) / €59.90 (family incl. 2 kids) + €10/child';
      
      const e9Single = getProductById('annual_e9_single');
      expect(e9Single?.price.display).toBe(expectedDisplay);
      
      const e9Couple = getProductById('annual_e9_couple');
      expect(e9Couple?.price.display).toBe(expectedDisplay);
      
      const e9Family = getProductById('annual_e9_family');
      expect(e9Family?.price.display).toBe(expectedDisplay);
    });

    it('should have consistent E9 price components', () => {
      const e9Products = ['annual_e9_single', 'annual_e9_couple', 'annual_e9_family'];
      
      e9Products.forEach(productId => {
        const product = getProductById(productId as any);
        expect(product?.price.single).toBe('24.90');
        expect(product?.price.couple).toBe('49.90');
        expect(product?.price.family).toBe('59.90');
        expect(product?.price.extraChild).toBe('10');
      });
    });
  });

  describe('standalone pricing', () => {
    it('should have correct volume discount pricing', () => {
      const standaloneTranslation = getProductById('standalone_translation');
      expect(standaloneTranslation?.price.display).toBe('€45 → €30 (1–10 docs volume)');
    });
  });

  describe('price consistency', () => {
    it('should have display prices for all products', () => {
      products.forEach(product => {
        expect(product.price.display).toBeDefined();
        expect(product.price.display).toBeTruthy();
        expect(typeof product.price.display).toBe('string');
      });
    });

    it('should have Euro symbol in all display prices', () => {
      products.forEach(product => {
        expect(product.price.display).toContain('€');
      });
    });

    it('should have consistent pricing format', () => {
      const coreProducts = products.filter(p => p.flags.bundle);
      coreProducts.forEach(product => {
        expect(product.price.display).toContain('incl. VAT');
      });

      const addOnProducts = products.filter(p => p.flags.addon);
      addOnProducts.forEach(product => {
        if (product.id !== 'standalone_translation') {
          expect(product.price.display).toMatch(/€\d+.*\(Single\).*\/.*€\d+.*\(Couple\)/);
        }
      });
    });

    it('should have valid numeric price components', () => {
      products.forEach(product => {
        if (product.price.single) {
          expect(parseFloat(product.price.single)).toBeGreaterThan(0);
        }
        if (product.price.couple) {
          expect(parseFloat(product.price.couple)).toBeGreaterThan(0);
        }
        if (product.price.family) {
          expect(parseFloat(product.price.family)).toBeGreaterThan(0);
        }
        if (product.price.extraChild) {
          expect(parseFloat(product.price.extraChild)).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('catalog constants', () => {
    it('should match exact pricing requirements', () => {
      // Core Bundles
      expect(getProductById('starter_single')?.price.display).toBe('€299 incl. VAT');
      expect(getProductById('starter_couple')?.price.display).toBe('€575 incl. VAT');
      expect(getProductById('full_single')?.price.display).toBe('€475 incl. VAT');
      expect(getProductById('full_couple')?.price.display).toBe('€925 incl. VAT');

      // Add-ons
      expect(getProductById('addon_bank_single')?.price.display).toBe('€175 (Single) / €325 (Couple)');
      expect(getProductById('addon_govgr_single')?.price.display).toBe('€89 (Single) / €160 (Couple)');
      expect(getProductById('addon_translations_single')?.price.display).toBe('€45 (Single) / €85 (Couple)');

      // Recurring
      expect(getProductById('annual_e9_single')?.price.display).toBe('€24.90 (Single) / €49.90 (Couple) / €59.90 (family incl. 2 kids) + €10/child');

      // Standalone
      expect(getProductById('standalone_translation')?.price.display).toBe('€45 → €30 (1–10 docs volume)');
    });
  });
});