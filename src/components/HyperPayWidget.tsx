'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

interface HyperPayWidgetProps {
    checkoutId: string;
    brands?: string;
    shopperResultUrl: string;
}

declare global {
    interface Window {
        wpwlOptions: any;
    }
}

export default function HyperPayWidget({
    checkoutId,
    brands = 'VISA MASTER AMEX MADA',
    shopperResultUrl,
}: HyperPayWidgetProps) {
    const [loading, setLoading] = useState(true);
    const scriptLoadedRef = useRef(false);

    useEffect(() => {
        if (scriptLoadedRef.current || !checkoutId) return;
        scriptLoadedRef.current = true;

        // Configure widget options before loading the script
        window.wpwlOptions = {
            style: 'card',
            locale: 'en',
            paymentTarget: '_top',
            brandDetection: true,
            brandDetectionType: 'binlist',
            onReady: () => {
                setLoading(false);
            },
            onError: (error: any) => {
                console.error('HyperPay widget error:', error);
                setLoading(false);
            },
        };

        // Load HyperPay payment widget JS
        const baseUrl = process.env.NEXT_PUBLIC_HYPERPAY_BASE_URL || 'https://eu-test.oppwa.com';
        const script = document.createElement('script');
        script.src = `${baseUrl}/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.body.appendChild(script);

        return () => {
            // Cleanup on unmount
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            delete (window as any).wpwlOptions;
        };
    }, [checkoutId]);

    return (
        <div className="hyperpay-widget-container">
            {loading && (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative w-20 h-20 mb-6">
                        <div className="absolute inset-0 border-4 border-gold/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-gold animate-spin" />
                        </div>
                    </div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                        Loading secure payment form...
                    </p>
                </div>
            )}

            {/* HyperPay COPYandPAY renders the payment form inside this element */}
            <form
                action={shopperResultUrl}
                className="paymentWidgets"
                data-brands={brands}
            />

            {/* Security note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[9px] text-white/20 uppercase tracking-[0.2em] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-gold/40" />
                <span>Secured by HyperPay — PCI DSS Certified</span>
            </div>

            {/* Custom CSS to match the dark theme */}
            <style jsx global>{`
                .wpwl-form {
                    background: rgba(255, 255, 255, 0.03) !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    border-radius: 1.5rem !important;
                    padding: 2rem !important;
                    color: #fff !important;
                    font-family: inherit !important;
                }
                .wpwl-form-card {
                    background: transparent !important;
                }
                .wpwl-label {
                    color: rgba(255, 255, 255, 0.5) !important;
                    font-size: 10px !important;
                    font-weight: 900 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.15em !important;
                }
                .wpwl-control {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    border-radius: 0.75rem !important;
                    color: #fff !important;
                    height: 3.5rem !important;
                    padding: 0 1rem !important;
                    font-size: 14px !important;
                }
                .wpwl-control:focus {
                    border-color: rgba(197, 160, 89, 0.5) !important;
                    box-shadow: 0 0 0 2px rgba(197, 160, 89, 0.1) !important;
                }
                .wpwl-button-pay {
                    background: #C5A059 !important;
                    color: #0A1628 !important;
                    border: none !important;
                    border-radius: 1rem !important;
                    height: 4rem !important;
                    font-size: 12px !important;
                    font-weight: 900 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.2em !important;
                    width: 100% !important;
                    cursor: pointer !important;
                    transition: all 0.3s ease !important;
                }
                .wpwl-button-pay:hover {
                    background: #D4B068 !important;
                    box-shadow: 0 15px 40px rgba(197, 160, 89, 0.3) !important;
                }
                .wpwl-brand-card {
                    border-radius: 0.5rem !important;
                }
                .wpwl-wrapper {
                    margin-bottom: 1rem !important;
                }
                .wpwl-hint {
                    color: rgba(255, 255, 255, 0.3) !important;
                    font-size: 9px !important;
                }
                .wpwl-has-error .wpwl-control {
                    border-color: rgba(239, 68, 68, 0.5) !important;
                }
                .wpwl-has-error .wpwl-hint {
                    color: rgba(239, 68, 68, 0.7) !important;
                }
                .wpwl-group-brand {
                    display: flex !important;
                    gap: 0.5rem !important;
                    margin-bottom: 1rem !important;
                }
            `}</style>
        </div>
    );
}
