import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { Step2Products } from '../app/(wizard)/wizard/Step2Products';
import { useWizardStore } from '../store/wizardStore';

// Mock the router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}));

// Mock the wizard store
vi.mock('../store/wizardStore', () => ({
  useWizardStore: vi.fn()
}));

// Mock analytics
vi.mock('../lib/analytics', () => ({
  wizardAnalytics: {
    proContactStarted: vi.fn(),
    stepCompleted: vi.fn(),
    validationFailed: vi.fn(),
    productAdded: vi.fn(),
    productRemoved: vi.fn()
  }
}));

// Mock messages for testing
const messages = {
  'wizard.step2.professionals.title': 'Tell us how you\'d like to work with us',
  'wizard.step2.professionals.subtitle': 'Select the services that interest you and we\'ll get in touch.',
  'wizard.step2.professionals.contactSales': 'Contact Sales',
  'wizard.step2.professionals.api.title': 'B2B API License',
  'wizard.step2.professionals.api.description': 'Direct API access for integrating our services into your platform or workflow.',
  'wizard.step2.professionals.bulk.title': 'Bulk B2B Transactions',
  'wizard.step2.professionals.bulk.description': 'High-volume processing for translations, AFM, mobile setup, and bank onboarding.',
  'wizard.step2.professionals.referral.title': 'Referral Program (B2B Lite)',
  'wizard.step2.professionals.referral.description': 'Earn commissions by referring clients to our services with dedicated support.',
  'wizard.step2.title': 'Choose your bundle',
  'wizard.step2.subtitle': 'Select the products and services that match your needs.',
  'wizard.continue': 'Continue',
  'wizard.validation.selectProduct': 'Please select at least one product to continue.'
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <NextIntlClientProvider locale="en" messages={messages}>
    {children}
  </NextIntlClientProvider>
);

describe('Professionals Gate', () => {
  const mockPush = vi.fn();
  const mockUpdate = vi.fn();
  const mockToggleProduct = vi.fn();
  const mockOnContinue = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
  });

  describe('when audience is professionals', () => {
    beforeEach(() => {
      (useWizardStore as any).mockReturnValue({
        answers: {
          audience: 'professionals',
          selectedProducts: [],
          professionals: {
            interests: []
          }
        },
        update: mockUpdate,
        toggleProduct: mockToggleProduct
      });
    });

    it('should render professionals gate instead of product tabs', () => {
      render(
        <TestWrapper>
          <Step2Products onContinue={mockOnContinue} />
        </TestWrapper>
      );

      // Should show gate title
      expect(screen.getByText('Tell us how you\'d like to work with us')).toBeInTheDocument();
      
      // Should show all three B2B options
      expect(screen.getByText('B2B API License')).toBeInTheDocument();
      expect(screen.getByText('Bulk B2B Transactions')).toBeInTheDocument();
      expect(screen.getByText('Referral Program (B2B Lite)')).toBeInTheDocument();
      
      // Should NOT show product tabs
      expect(screen.queryByText('Translytic')).not.toBeInTheDocument();
      expect(screen.queryByText('Taxlytic')).not.toBeInTheDocument();
      expect(screen.queryByText('Homelytic')).not.toBeInTheDocument();
    });

    it('should show Contact Sales button', () => {
      render(
        <TestWrapper>
          <Step2Products onContinue={mockOnContinue} />
        </TestWrapper>
      );

      const contactSalesButton = screen.getByText('Contact Sales');
      expect(contactSalesButton).toBeInTheDocument();
    });

    it('should disable Contact Sales button when no interests selected', () => {
      render(
        <TestWrapper>
          <Step2Products onContinue={mockOnContinue} />
        </TestWrapper>
      );

      const contactSalesButton = screen.getByText('Contact Sales');
      expect(contactSalesButton).toBeDisabled();
    });

    it('should enable Contact Sales button when interests are selected', () => {
      (useWizardStore as any).mockReturnValue({
        answers: {
          audience: 'professionals',
          selectedProducts: [],
          professionals: {
            interests: ['api']
          }
        },
        update: mockUpdate,
        toggleProduct: mockToggleProduct
      });

      render(
        <TestWrapper>
          <Step2Products onContinue={mockOnContinue} />
        </TestWrapper>
      );

      const contactSalesButton = screen.getByText('Contact Sales');
      expect(contactSalesButton).not.toBeDisabled();
    });

    it('should allow selecting multiple interests', () => {
      render(
        <TestWrapper>
          <Step2Products onContinue={mockOnContinue} />
        </TestWrapper>
      );

      // Click on API option
      const apiCheckbox = screen.getByRole('checkbox', { name: /B2B API License/ });
      fireEvent.click(apiCheckbox);

      expect(mockUpdate).toHaveBeenCalledWith({
        professionals: {
          interests: ['api']
        }
      });

      // Reset mock and simulate having API selected
      vi.clearAllMocks();
      (useWizardStore as any).mockReturnValue({
        answers: {
          audience: 'professionals',
          selectedProducts: [],
          professionals: {
            interests: ['api']
          }
        },
        update: mockUpdate,
        toggleProduct: mockToggleProduct
      });

      // Re-render with updated state
      render(
        <TestWrapper>
          <Step2Products onContinue={mockOnContinue} />
        </TestWrapper>
      );

      // Click on Bulk option
      const bulkCheckbox = screen.getByRole('checkbox', { name: /Bulk B2B Transactions/ });
      fireEvent.click(bulkCheckbox);

      expect(mockUpdate).toHaveBeenCalledWith({
        professionals: {
          interests: ['api', 'bulk']
        }
      });
    });

    it('should route to contact-sales with correct query parameters', async () => {
      (useWizardStore as any).mockReturnValue({
        answers: {
          audience: 'professionals',
          selectedProducts: [],
          professionals: {
            interests: ['api', 'bulk']
          }
        },
        update: mockUpdate,
        toggleProduct: mockToggleProduct
      });

      render(
        <TestWrapper>
          <Step2Products onContinue={mockOnContinue} />
        </TestWrapper>
      );

      const contactSalesButton = screen.getByText('Contact Sales');
      fireEvent.click(contactSalesButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/contact-sales?audience=professionals&interests=api,bulk');
      });
    });

    it('should track analytics when starting contact flow', async () => {
      const { wizardAnalytics } = await import('../lib/analytics');
      
      (useWizardStore as any).mockReturnValue({
        answers: {
          audience: 'professionals',
          selectedProducts: [],
          professionals: {
            interests: ['referral']
          }
        },
        update: mockUpdate,
        toggleProduct: mockToggleProduct
      });

      render(
        <TestWrapper>
          <Step2Products onContinue={mockOnContinue} />
        </TestWrapper>
      );

      const contactSalesButton = screen.getByText('Contact Sales');
      fireEvent.click(contactSalesButton);

      await waitFor(() => {
        expect(wizardAnalytics.proContactStarted).toHaveBeenCalledWith(['referral'], 'professionals');
      });
    });

    it('should handle interest deselection', () => {
      (useWizardStore as any).mockReturnValue({
        answers: {
          audience: 'professionals',
          selectedProducts: [],
          professionals: {
            interests: ['api', 'bulk']
          }
        },
        update: mockUpdate,
        toggleProduct: mockToggleProduct
      });

      render(
        <TestWrapper>
          <Step2Products onContinue={mockOnContinue} />
        </TestWrapper>
      );

      // Click on already selected API option to deselect
      const apiCheckbox = screen.getByRole('checkbox', { name: /B2B API License/ });
      fireEvent.click(apiCheckbox);

      expect(mockUpdate).toHaveBeenCalledWith({
        professionals: {
          interests: ['bulk'] // API removed
        }
      });
    });
  });

  describe('when audience is not professionals', () => {
    beforeEach(() => {
      (useWizardStore as any).mockReturnValue({
        answers: {
          audience: 'expats',
          selectedProducts: [],
          professionals: {
            interests: []
          }
        },
        update: mockUpdate,
        toggleProduct: mockToggleProduct
      });
    });

    it('should render product tabs instead of professionals gate', () => {
      render(
        <TestWrapper>
          <Step2Products onContinue={mockOnContinue} />
        </TestWrapper>
      );

      // Should show regular product selection
      expect(screen.getByText('Choose your bundle')).toBeInTheDocument();
      
      // Should NOT show professionals gate
      expect(screen.queryByText('Tell us how you\'d like to work with us')).not.toBeInTheDocument();
      expect(screen.queryByText('B2B API License')).not.toBeInTheDocument();
    });

    it('should show Continue button instead of Contact Sales', () => {
      render(
        <TestWrapper>
          <Step2Products onContinue={mockOnContinue} />
        </TestWrapper>
      );

      expect(screen.getByText('Continue')).toBeInTheDocument();
      expect(screen.queryByText('Contact Sales')).not.toBeInTheDocument();
    });
  });
});