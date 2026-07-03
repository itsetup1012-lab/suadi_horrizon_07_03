'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { clearCart } from '@/api/cart';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { FloatingParticles } from '@/components/effects/SceneEffects';

function PaymentResultContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const resourcePath = searchParams.get('resourcePath');
        if (!resourcePath) {
            toast.error('Payment verification failed — no payment reference found');
            router.push('/checkout');
            return;
        }

        verifyPayment(resourcePath);
    }, [searchParams]);

    const verifyPayment = async (resourcePath: string) => {
        try {
            const response = await fetch(
                `/api/hyperpay/status?resourcePath=${encodeURIComponent(resourcePath)}`
            );
            const data = await response.json();

            if (data.success) {
                // Retrieve the pending order data saved before payment
                const orderData = JSON.parse(
                    sessionStorage.getItem('pendingOrder') || '{}'
                );

                // Create the order in the database
                if (orderData.items && orderData.items.length > 0) {
                    const token = localStorage.getItem('accessToken');
                    await fetch('/api/orders', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                        },
                        body: JSON.stringify({
                            userId: user?._id,
                            items: orderData.items.map((item: any) => ({
                                name: item.name,
                                quantity: item.quantity,
                                price: item.price,
                                productId: item._id || item.productId,
                            })),
                            totalAmount: parseFloat(data.amount) || orderData.totalAmount,
                            shippingAddress: orderData.shippingAddress,
                            paymentId: data.paymentId,
                            paymentBrand: data.brand,
                            status: 'pending',
                        }),
                    });
                }

                // Clear cart and pending order data
                clearCart();
                sessionStorage.removeItem('pendingOrder');

                setStatus('success');
                toast.success('Payment successful!');

                // Redirect to success page after a short delay
                setTimeout(() => {
                    router.push('/checkout/success');
                }, 1500);
            } else {
                setStatus('failed');
                setErrorMessage(data.error || 'Payment was not successful');
                toast.error(data.error || 'Payment failed');
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            setStatus('failed');
            setErrorMessage('Unable to verify payment. Please contact support.');
            toast.error('Payment verification failed');
        }
    };

    return (
        <div className="min-h-screen bg-navy flex items-center justify-center relative overflow-hidden">
            <FloatingParticles />
            <div className="text-center relative z-10">
                {status === 'verifying' && (
                    <div>
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <div className="absolute inset-0 border-4 border-gold/10 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-10 h-10 text-gold animate-spin" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                            Verifying Payment...
                        </h2>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                            Please wait while we confirm your transaction
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <div className="w-24 h-24 mx-auto mb-8 bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20 flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                            Payment <span className="text-gradient-gold">Confirmed</span>
                        </h2>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                            Redirecting to order confirmation...
                        </p>
                    </div>
                )}

                {status === 'failed' && (
                    <div>
                        <div className="w-24 h-24 mx-auto mb-8 bg-red-500/10 rounded-[2rem] border border-red-500/20 flex items-center justify-center">
                            <XCircle className="w-12 h-12 text-red-500" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                            Payment Failed
                        </h2>
                        <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
                            {errorMessage}
                        </p>
                        <button
                            onClick={() => router.push('/checkout')}
                            className="px-8 py-4 bg-gold text-navy font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:shadow-[0_15px_40px_rgba(197,160,89,0.3)] transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PaymentResultPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-navy flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-gold animate-spin" />
            </div>
        }>
            <PaymentResultContent />
        </Suspense>
    );
}
