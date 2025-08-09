import { describe, it, expect } from 'vitest';
import { recommendations, getRecommendationsForAudience, isProductRecommended } from '../app/(wizard)/wizard/data/recommendations';
import type { Audience, ProductId } from '../store/wizardStore';

describe('Recommendations Engine', () => {
  describe('recommendations mapping', () => {
    it('should have recommendations for all audiences', () => {
      const expectedAudiences: Audience[] = [
        'homeBuyers',
        'diasporaHeirs', 
        'expats',
        'homeOwners',
        'investors',
        'professionals'
      ];

      expectedAudiences.forEach(audience => {
        expect(recommendations).toHaveProperty(audience);
        expect(recommendations[audience]).toBeInstanceOf(Set);
      });
    });

    it('should have correct recommendations for expats', () => {
      const expatsRecommendations = recommendations.expats;
      
      // Should include Starter bundles
      expect(expatsRecommendations.has('starter_single')).toBe(true);
      expect(expatsRecommendations.has('starter_couple')).toBe(true);
      
      // Should include Full-Service bundles
      expect(expatsRecommendations.has('full_single')).toBe(true);
      expect(expatsRecommendations.has('full_couple')).toBe(true);
      
      // Should include add-ons
      expect(expatsRecommendations.has('addon_govgr_single')).toBe(true);
      expect(expatsRecommendations.has('addon_govgr_couple')).toBe(true);
      expect(expatsRecommendations.has('addon_bank_single')).toBe(true);
      expect(expatsRecommendations.has('addon_bank_couple')).toBe(true);
      
      // Should include translations
      expect(expatsRecommendations.has('addon_translations_single')).toBe(true);
      expect(expatsRecommendations.has('addon_translations_couple')).toBe(true);
      
      // Should include Annual E9
      expect(expatsRecommendations.has('annual_e9_single')).toBe(true);
      expect(expatsRecommendations.has('annual_e9_couple')).toBe(true);
    });

    it('should have correct recommendations for homeBuyers', () => {
      const homeBuyersRecommendations = recommendations.homeBuyers;
      
      // Should include Starter and Full-Service bundles
      expect(homeBuyersRecommendations.has('starter_single')).toBe(true);
      expect(homeBuyersRecommendations.has('starter_couple')).toBe(true);
      expect(homeBuyersRecommendations.has('full_single')).toBe(true);
      expect(homeBuyersRecommendations.has('full_couple')).toBe(true);
      
      // Should include add-ons
      expect(homeBuyersRecommendations.has('addon_govgr_single')).toBe(true);
      expect(homeBuyersRecommendations.has('addon_bank_single')).toBe(true);
      expect(homeBuyersRecommendations.has('addon_translations_single')).toBe(true);
      
      // Should NOT include Annual E9 (not for buyers)
      expect(homeBuyersRecommendations.has('annual_e9_single')).toBe(false);
    });

    it('should have correct recommendations for homeOwners', () => {
      const homeOwnersRecommendations = recommendations.homeOwners;
      
      // Should include Annual E9
      expect(homeOwnersRecommendations.has('annual_e9_single')).toBe(true);
      expect(homeOwnersRecommendations.has('annual_e9_couple')).toBe(true);
      expect(homeOwnersRecommendations.has('annual_e9_family')).toBe(true);
      
      // Should include translations
      expect(homeOwnersRecommendations.has('addon_translations_single')).toBe(true);
      expect(homeOwnersRecommendations.has('addon_translations_couple')).toBe(true);
      
      // Should NOT include Starter bundles (already have AFM)
      expect(homeOwnersRecommendations.has('starter_single')).toBe(false);
      expect(homeOwnersRecommendations.has('starter_couple')).toBe(false);
    });

    it('should have correct recommendations for investors', () => {
      const investorsRecommendations = recommendations.investors;
      
      // Should include everything (comprehensive coverage)
      expect(investorsRecommendations.has('starter_single')).toBe(true);
      expect(investorsRecommendations.has('full_single')).toBe(true);
      expect(investorsRecommendations.has('addon_govgr_single')).toBe(true);
      expect(investorsRecommendations.has('addon_bank_single')).toBe(true);
      expect(investorsRecommendations.has('annual_e9_single')).toBe(true);
      expect(investorsRecommendations.has('addon_translations_single')).toBe(true);
    });

    it('should have correct recommendations for diasporaHeirs', () => {
      const diasporaHeirsRecommendations = recommendations.diasporaHeirs;
      
      // Should mirror homeOwners
      expect(diasporaHeirsRecommendations.has('annual_e9_single')).toBe(true);
      expect(diasporaHeirsRecommendations.has('annual_e9_couple')).toBe(true);
      expect(diasporaHeirsRecommendations.has('annual_e9_family')).toBe(true);
      expect(diasporaHeirsRecommendations.has('addon_translations_single')).toBe(true);
      expect(diasporaHeirsRecommendations.has('addon_translations_couple')).toBe(true);
      
      // Should NOT include Starter bundles
      expect(diasporaHeirsRecommendations.has('starter_single')).toBe(false);
    });

    it('should have correct recommendations for professionals', () => {
      const professionalsRecommendations = recommendations.professionals;
      
      // Should focus on translations only (B2B products don't exist in catalog yet)
      expect(professionalsRecommendations.has('addon_translations_single')).toBe(true);
      expect(professionalsRecommendations.has('addon_translations_couple')).toBe(true);
      
      // Should NOT include consumer bundles
      expect(professionalsRecommendations.has('starter_single')).toBe(false);
      expect(professionalsRecommendations.has('full_single')).toBe(false);
    });
  });

  describe('helper functions', () => {
    it('should return correct recommendations for audience', () => {
      const expatsRecs = getRecommendationsForAudience('expats');
      expect(expatsRecs.has('starter_single')).toBe(true);
      
      const undefinedRecs = getRecommendationsForAudience(undefined);
      expect(undefinedRecs.size).toBe(0);
    });

    it('should correctly identify recommended products', () => {
      expect(isProductRecommended('starter_single', 'expats')).toBe(true);
      expect(isProductRecommended('starter_single', 'homeOwners')).toBe(false);
      expect(isProductRecommended('annual_e9_single', 'homeOwners')).toBe(true);
      expect(isProductRecommended('annual_e9_single', 'homeBuyers')).toBe(false);
      
      expect(isProductRecommended('starter_single', undefined)).toBe(false);
    });
  });

  describe('recommendation consistency', () => {
    it('should have non-empty recommendations for all audiences except empty case', () => {
      Object.entries(recommendations).forEach(([audience, productSet]) => {
        expect(productSet.size).toBeGreaterThan(0);
      });
    });

    it('should use valid product IDs', () => {
      const validProductIds: ProductId[] = [
        'starter_single', 'starter_couple', 'full_single', 'full_couple',
        'addon_bank_single', 'addon_bank_couple',
        'addon_govgr_single', 'addon_govgr_couple', 
        'addon_translations_single', 'addon_translations_couple',
        'annual_e9_single', 'annual_e9_couple', 'annual_e9_family',
        'due_diligence', 'property_portfolio', 'e2e_purchase', 
        'investment_analysis', 'contract_drafting', 'standalone_translation'
      ];

      Object.entries(recommendations).forEach(([audience, productSet]) => {
        productSet.forEach(productId => {
          expect(validProductIds).toContain(productId);
        });
      });
    });
  });
});