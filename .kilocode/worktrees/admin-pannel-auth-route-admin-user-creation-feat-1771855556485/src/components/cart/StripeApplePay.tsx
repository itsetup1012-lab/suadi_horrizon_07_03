"use client";

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    ExpressCheckoutElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { CartItem } from '@/api/cart';
import { AlertCircle, Lock } from 'lucide-react';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function ApplePayButton({ cartItems }: { cartItems: CartItem[] }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(false);

    const onConfirm = async () => {
        if (!stripe || !elements) return;

        setLoading(true);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            toast.error(submitError.message || 'Payment submission failed');
            setLoading(false);
            return;
        }

        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cartItems }),
        });

        const data = await response.json();

        if (data.error) {
            toast.error(data.error);
            setLoading(false);
            return;
        }

        const { error: confirmError } = await stripe.confirmPayment({
            elements,
            clientSecret: data.clientSecret,
            confirmParams: {
                return_url: `${window.location.origin}/cart?success=true`,
            },
        });

        if (confirmError) {
            toast.error(confirmError.message || 'Payment confirmation failed');
        }

        setLoading(false);
    };

    return (
        <div className="w-full">
            {!ready && !loading && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                    <div className="flex items-center gap-3 text-gold mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Initialization Pending</span>
                    </div>
                    <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-wider font-bold">
                        Apple Pay requires a secure HTTPS connection and a valid Stripe configuration. Ensure your keys are set in the environment logs.
                    </p>
                </div>
            )}

            <ExpressCheckoutElement
                onConfirm={onConfirm}
                onReady={() => setReady(true)}
            />

            {loading && (
                <div className="flex flex-col items-center gap-2 mt-4">
                    <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] text-gold/60 text-center animate-pulse uppercase tracking-[0.2em] font-black">
                        SECURE LOGISTICS ENCRYPTION ACTIVE...
                    </p>
                </div>
            )}
        </div>
    );
}

export default function StripeApplePay({ cartItems }: { cartItems: CartItem[] }) {
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = totalAmount * 0.15;
    const finalTotal = totalAmount + tax;

    if (!publishableKey || publishableKey.includes('your_key_here')) {
        return (
            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-3 text-amber-500 mb-2">
                    <Lock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Gateway Configuration Required</span>
                </div>
                <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-wider font-bold">
                    Stripe API keys are missing or invalid. Please update your <code className="text-amber-500/80">.env.local</code> file with your production/test keys to activate the payment terminal.
                </p>
            </div>
        );
    }

    return (
        <Elements
            stripe={stripePromise}
            options={{
                mode: 'payment',
                amount: Math.round(finalTotal * 100),
                currency: 'usd',
                appearance: {
                    theme: 'night',
                    variables: {
                        colorPrimary: '#C5A059',
                        colorBackground: '#040914',
                        colorText: '#ffffff',
                        borderRadius: '16px',
                        fontFamily: 'Inter, system-ui, sans-serif',
                    },
                },
            }}
        >
            <ApplePayButton cartItems={cartItems} />
        </Elements>
    );
}
