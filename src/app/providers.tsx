"use client";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import ChatWidget from "@/components/ChatWidget";
import { PopupBanner } from "@/components/home/PopupBanner";
import { useEffect, useState } from "react";
import { CookiesProvider } from "react-cookie";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [isI18nReady, setIsI18nReady] = useState(false);
    const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
    const [lang, setLang] = useState("en");

    // Warm up database connection on app load
    useEffect(() => {
        // Pre-connect to database to avoid cold start on first API call
        fetch('/api/warmup', {
            method: 'GET',
            cache: 'no-store'
        }).then(() => {
            console.log('🔌 Database connection warmed up');
        }).catch(() => {
            // Ignore errors, fallback will handle it
        });
    }, []);

    useEffect(() => {
        // Ensure i18n is ready and sync state
        if (i18n && i18n.dir) {
            setDir(i18n.dir());
            setLang(i18n.language || "en");

            const handleLangChange = (lng: string) => {
                setLang(lng);
                setDir(i18n.dir(lng));
                // Update document attributes directly for immediate feedback
                if (typeof document !== 'undefined') {
                    document.dir = i18n.dir(lng);
                    document.documentElement.lang = lng;
                }
            };
            i18n.on('languageChanged', handleLangChange);
            setIsI18nReady(true);
        }
    }, []);

    useEffect(() => {
        if (isI18nReady) {
            document.dir = dir;
            document.documentElement.lang = lang;
            document.documentElement.className = lang === 'ar' ? 'font-arabic' : '';
        }
    }, [isI18nReady, dir, lang]);

    return (
        <I18nextProvider i18n={i18n}>
            <CookiesProvider>
                <AuthProvider>
                    <ComparisonProvider>
                        <WishlistProvider>
                            <ChatProvider>
                                <ThemeProvider defaultTheme="light" storageKey="ui-theme">
                                    {children}
                                    <Toaster />
                                    <ChatWidget />
                                    <PopupBanner />
                                </ThemeProvider>
                            </ChatProvider>
                        </WishlistProvider>
                    </ComparisonProvider>
                </AuthProvider>
            </CookiesProvider>
        </I18nextProvider>
    );
}
