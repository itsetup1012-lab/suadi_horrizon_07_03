'use client';

import { useEffect, useState, ReactNode } from 'react';

interface RtlWrapperProps {
    children: ReactNode;
}

export default function RtlWrapper({ children }: RtlWrapperProps) {
    const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
    const [lang, setLang] = useState("en");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Dynamic import of i18n to get current language direction
        import("@/lib/i18n").then((i18nModule) => {
            const i18n = i18nModule.default || i18nModule;

            const updateDirection = () => {
                const currentLang = i18n.language || "en";
                const direction = currentLang === "ar" ? "rtl" : "ltr";
                setDir(direction);
                setLang(currentLang);
            };

            // Initial check
            updateDirection();

            // Listen for language changes
            if (i18n.on) {
                i18n.on('languageChanged', updateDirection);
            }

            setIsReady(true);

            return () => {
                if (i18n.off) {
                    i18n.off('languageChanged', updateDirection);
                }
            };
        }).catch(() => {
            setIsReady(true);
        });
    }, []);

    useEffect(() => {
        if (isReady) {
            document.dir = dir;
            document.documentElement.lang = lang;
        }
    }, [isReady, dir, lang]);

    // Prevent flash of wrong direction
    if (!isReady) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex flex-col">
                {children}
            </div>
        );
    }

    return (
        <div dir={dir} lang={lang} className="min-h-screen bg-gradient-to-br from-background to-secondary flex flex-col">
            {children}
        </div>
    );
}
