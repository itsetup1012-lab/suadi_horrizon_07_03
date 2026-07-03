"use client";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import ChatWidget from "@/components/ChatWidget";
import { useEffect, useState } from "react";

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
        // Dynamic import of i18n to avoid SSR issues
        import("@/lib/i18n").then((i18nModule) => {
            const i18n = i18nModule.default || i18nModule;
            // Wait for the translation to be ready
            if (i18n && i18n.dir) {
                setDir(i18n.dir());
                setLang(i18n.language || "en");
            }
            setIsI18nReady(true);
        }).catch(() => {
            // i18n failed to load, continue anyway
            setIsI18nReady(true);
        });
    }, []);

    useEffect(() => {
        if (isI18nReady) {
            document.dir = dir;
            document.documentElement.lang = lang;
        }
    }, [isI18nReady, dir, lang]);

    return (
        <ComparisonProvider>
            <WishlistProvider>
                <AuthProvider>
                    <ChatProvider>
                        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
                            {children}
                            <Toaster />
                            <ChatWidget />
                        </ThemeProvider>
                    </ChatProvider>
                </AuthProvider>
            </WishlistProvider>
        </ComparisonProvider>
    );
}
