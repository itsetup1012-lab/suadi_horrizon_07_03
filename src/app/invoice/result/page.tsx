'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

function PaymentResultContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyPayment = async () => {
            const resourcePath = searchParams.get('resourcePath');
            if (!resourcePath) {
                setStatus('error');
                setMessage('Invalid payment session');
                return;
            }

            try {
                const response = await fetch(`/api/hyperpay/status?resourcePath=${encodeURIComponent(resourcePath)}`);
                const data = await response.json();

                if (data.success) {
                    setStatus('success');
                    toast.success('Payment Successful!');
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Payment was not successful');
                }
            } catch (error) {
                console.error('Error verifying payment:', error);
                setStatus('error');
                setMessage('Failed to verify payment status');
            }
        };

        verifyPayment();
    }, [searchParams, params.id]);

    return (
        <AnimatePresence mode="wait">
            {status === 'loading' && (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-4"
                >
                    <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto" />
                    <p className="text-white font-bold uppercase tracking-widest text-sm">Verifying Payment...</p>
                </motion.div>
            )}

            {status === 'success' && (
                <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <Card className="glass border-emerald-500/20 p-10 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-emerald-500/5">
                            <CheckCircle2 className="w-32 h-32" />
                        </div>

                        <div className="w-20 h-20 bg-emerald-500 text-navy rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>

                        <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>Payment Successful</h2>
                        <p className="text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] mb-10">Thank you for your payment</p>

                        <div className="space-y-3">
                            <Button
                                onClick={() => router.push(`/invoice/${params.id}`)}
                                className="w-full bg-gold text-navy font-black h-14 rounded-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                            >
                                <FileText className="w-4 h-4" />
                                View Receipt
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/')}
                                className="w-full text-white/40 hover:text-white h-12 uppercase tracking-widest text-[10px] font-black"
                            >
                                Return to Home
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            )}

            {status === 'error' && (
                <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <Card className="glass border-red-500/20 p-10 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-red-500/5">
                            <XCircle className="w-32 h-32" />
                        </div>

                        <div className="w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                            <XCircle className="w-10 h-10" />
                        </div>

                        <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>Payment Failed</h2>
                        <p className="text-red-400 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Transaction Denied</p>
                        <p className="text-white/40 text-sm mb-10 italic">"{message}"</p>

                        <div className="space-y-3">
                            <Button
                                onClick={() => router.push(`/invoice/${params.id}`)}
                                className="w-full bg-white/10 text-white hover:bg-white/20 font-black h-14 rounded-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                            >
                                Try Again
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/')}
                                className="w-full text-white/40 hover:text-white h-12 uppercase tracking-widest text-[10px] font-black"
                            >
                                Go to Support
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function InvoicePaymentResultPage() {
    return (
        <div className="min-h-screen bg-navy flex items-center justify-center p-4">
            <Suspense fallback={
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto" />
                    <p className="text-white font-bold uppercase tracking-widest text-sm">Loading...</p>
                </div>
            }>
                <PaymentResultContent />
            </Suspense>
        </div>
    );
}
