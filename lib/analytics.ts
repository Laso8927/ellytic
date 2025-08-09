// Analytics utility for tracking wizard events
// This can be integrated with Google Analytics, Mixpanel, or other analytics providers

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
}

export const analytics = {
  track: (eventName: string, properties?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      event: eventName,
      properties: {
        timestamp: new Date().toISOString(),
        ...properties
      }
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event);
    }

    // In production, send to your analytics provider
    // Example integrations:
    
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }

    // Mixpanel
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      (window as any).mixpanel.track(eventName, properties);
    }

    // PostHog
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture(eventName, properties);
    }

    // Custom analytics endpoint
    if (typeof window !== 'undefined') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }).catch(error => {
        console.warn('Analytics tracking failed:', error);
      });
    }
  }
};

// Wizard-specific analytics events
export const wizardAnalytics = {
  audienceSelected: (audience: string) => {
    analytics.track('audience_selected', {
      audience,
      step: 1
    });
  },

  productAdded: (productId: string, audience: string, isRecommended: boolean) => {
    analytics.track('product_added', {
      product_id: productId,
      audience,
      is_recommended: isRecommended,
      step: 2
    });
  },

  productRemoved: (productId: string, audience: string) => {
    analytics.track('product_removed', {
      product_id: productId,
      audience,
      step: 2
    });
  },

  proContactStarted: (interests: string[], audience: string) => {
    analytics.track('pro_contact_started', {
      interests,
      audience,
      step: 2,
      contact_type: 'b2b_sales'
    });
  },

  stepCompleted: (step: number, audience?: string) => {
    analytics.track('wizard_step_completed', {
      step,
      audience
    });
  },

  validationFailed: (step: number, reason: string) => {
    analytics.track('wizard_validation_failed', {
      step,
      reason
    });
  }
};