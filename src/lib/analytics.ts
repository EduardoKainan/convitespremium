export const TRACKING_ID = import.meta.env.VITE_META_PIXEL_ID || '';

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

// Meta standard events
const standardEvents = new Set([
  'AddPaymentInfo', 'AddToCart', 'AddToWishlist', 'CompleteRegistration',
  'Contact', 'CustomizeProduct', 'Donate', 'FindLocation',
  'InitiateCheckout', 'Lead', 'Purchase', 'Schedule', 'Search',
  'StartTrial', 'SubmitApplication', 'Subscribe', 'ViewContent'
]);

/**
 * Tracks an event in Meta Ads (Facebook Pixel)
 * @param eventName The event name (e.g., 'Lead', 'InitiateCheckout', 'custom_event')
 * @param params Additional parameters for the event
 */
export const trackEvent = (eventName: string, params: object = {}) => {
  if (typeof window !== 'undefined' && window.fbq && TRACKING_ID) {
    if (standardEvents.has(eventName)) {
      window.fbq('track', eventName, params);
    } else {
      window.fbq('trackCustom', eventName, params);
    }
  } else {
    // Development fallback
    console.log(`[Meta Pixel] Event: ${eventName}`, params);
  }
};
