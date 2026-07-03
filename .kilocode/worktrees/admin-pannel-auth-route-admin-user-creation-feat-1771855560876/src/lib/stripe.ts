import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY || '';

// Only warn if missing, avoid throwing to prevent build-time failures
if (!secretKey && typeof window === 'undefined') {
    console.warn('⚠️ [Stripe] STRIPE_SECRET_KEY is missing. Payment functionality will be disabled.');
}

export const stripe = new Stripe(secretKey, {
    apiVersion: '2025-01-27' as any,
});
