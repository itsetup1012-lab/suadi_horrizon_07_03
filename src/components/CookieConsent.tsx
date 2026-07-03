'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, X, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';

export interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
    timestamp: number;
}

const defaultPreferences: CookiePreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
    timestamp: 0,
};

const COOKIE_KEY = 'cookie_consent_preferences';
const CONSENT_EXPIRY_DAYS = 365;

interface CookieConsentProps {
    position?: 'bottom' | 'top' | 'bottom-left' | 'bottom-right';
    theme?: 'light' | 'dark';
}

export function CookieConsent({
    position = 'bottom',
    theme = 'dark'
}: CookieConsentProps) {
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
    const [isExpanded, setIsExpanded] = useState(false);

    // Load preferences from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(COOKIE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as CookiePreferences;
                setPreferences(parsed);
                // Don't show banner if consent was already given
                return;
            } catch {
                // Invalid stored data
            }
        }
        // Show banner if no consent exists
        setShowBanner(true);
    }, []);

    // Listen for custom event to open settings
    useEffect(() => {
        const handleOpenSettings = () => {
            setShowBanner(true);
            setShowSettings(true);
        };
        window.addEventListener('openCookieSettings', handleOpenSettings);
        return () => window.removeEventListener('openCookieSettings', handleOpenSettings);
    }, []);

    const savePreferences = useCallback((prefs: CookiePreferences) => {
        const newPrefs = { ...prefs, timestamp: Date.now() };
        localStorage.setItem(COOKIE_KEY, JSON.stringify(newPrefs));
        setPreferences(newPrefs);
        setShowBanner(false);
        setShowSettings(false);

        // Send consent to API for tracking statistics
        fetch('/api/cookie-consent', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                necessary: prefs.necessary,
                analytics: prefs.analytics,
                marketing: prefs.marketing,
                preferences: prefs.preferences
            })
        }).catch(err => console.error('Error tracking consent:', err));

        // Dispatch event for other components to react
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: newPrefs }));
    }, []);

    const handleAcceptAll = () => {
        savePreferences({
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true,
            timestamp: Date.now(),
        });
    };

    const handleRejectAll = () => {
        savePreferences({
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false,
            timestamp: Date.now(),
        });
    };

    const handleSaveSettings = () => {
        savePreferences({
            ...preferences,
            necessary: true, // Always required
            timestamp: Date.now(),
        });
    };

    const handlePreferenceChange = (key: keyof Omit<CookiePreferences, 'timestamp'>, checked: boolean) => {
        setPreferences(prev => ({
            ...prev,
            [key]: checked,
        }));
    };

    // Position styles
    const getPositionStyles = () => {
        switch (position) {
            case 'top':
                return 'top-0 left-0 right-0';
            case 'bottom-left':
                return 'bottom-4 left-4 max-w-sm';
            case 'bottom-right':
                return 'bottom-4 right-4 max-w-sm';
            case 'bottom':
            default:
                return 'bottom-0 left-0 right-0';
        }
    };

    const getContainerStyles = () => {
        const base = 'fixed z-50 p-4';
        const positionStyle = getPositionStyles();

        if (position === 'bottom' || position === 'top') {
            return `${base} ${positionStyle}`;
        }
        return `${base} ${positionStyle}`;
    };

    // Theme styles
    const isDark = theme === 'dark';
    const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ opacity: 0, y: position === 'top' || position === 'bottom' ? position === 'top' ? -100 : 100 : 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: position === 'top' || position === 'bottom' ? position === 'top' ? -100 : 100 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={getContainerStyles()}
                >
                    {!showSettings ? (
                        // Main Banner
                        <Card className={`${bgColor} ${borderColor} border shadow-xl`}>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-gold/10' : 'bg-amber-100'}`}>
                                        <Cookie className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-amber-600'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-semibold ${textColor} mb-1`}>
                                            We value your privacy
                                        </h3>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                                            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                                            By clicking "Accept All", you consent to our use of cookies.
                                            <a
                                                href="/cookie-policy"
                                                className={`underline ml-1 ${isDark ? 'text-gold hover:text-gold/80' : 'text-amber-600 hover:text-amber-700'}`}
                                            >
                                                Read More
                                            </a>
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                onClick={handleAcceptAll}
                                                size="sm"
                                                className="bg-gold hover:bg-gold/90 text-navy font-semibold"
                                            >
                                                Accept All
                                            </Button>
                                            <Button
                                                onClick={handleRejectAll}
                                                size="sm"
                                                variant="outline"
                                                className={`${isDark ? 'border-gray-600 text-white hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                                            >
                                                Reject Non-Essential
                                            </Button>
                                            <Button
                                                onClick={() => setShowSettings(true)}
                                                size="sm"
                                                variant="outline"
                                                className={`${isDark ? 'border-gray-600 text-white hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                                            >
                                                <Settings className="w-4 h-4 mr-2" />
                                                Customize
                                            </Button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowBanner(false)}
                                        className={`flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        // Settings Panel
                        <Card className={`${bgColor} ${borderColor} border shadow-xl max-h-[80vh] overflow-hidden flex flex-col`}>
                            <CardContent className="p-4 overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Settings className={`w-5 h-5 ${isDark ? 'text-gold' : 'text-amber-600'}`} />
                                        <h3 className={`font-semibold ${textColor}`}>
                                            Cookie Preferences
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Manage your cookie preferences. Some cookies are required for the website to function properly.
                                </p>

                                {/* Cookie Categories */}
                                <div className="space-y-4 mb-6">
                                    {/* Necessary */}
                                    <div className={`flex items-start gap-3 p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                                        <Checkbox
                                            id="necessary"
                                            checked={preferences.necessary}
                                            disabled
                                            className="mt-1"
                                        />
                                        <div className="flex-1">
                                            <label
                                                htmlFor="necessary"
                                                className={`font-medium ${textColor} flex items-center gap-2`}
                                            >
                                                Strictly Necessary
                                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                                                    Always On
                                                </span>
                                            </label>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                                Essential for the website to function. Cannot be disabled.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Analytics */}
                                    <div className={`flex items-start gap-3 p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                                        <Checkbox
                                            id="analytics"
                                            checked={preferences.analytics}
                                            onCheckedChange={(checked) => handlePreferenceChange('analytics', checked as boolean)}
                                            className="mt-1"
                                        />
                                        <div className="flex-1">
                                            <label
                                                htmlFor="analytics"
                                                className={`font-medium ${textColor}`}
                                            >
                                                Analytics Cookies
                                            </label>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                                Help us understand how visitors interact with our website.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Marketing */}
                                    <div className={`flex items-start gap-3 p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                                        <Checkbox
                                            id="marketing"
                                            checked={preferences.marketing}
                                            onCheckedChange={(checked) => handlePreferenceChange('marketing', checked as boolean)}
                                            className="mt-1"
                                        />
                                        <div className="flex-1">
                                            <label
                                                htmlFor="marketing"
                                                className={`font-medium ${textColor}`}
                                            >
                                                Marketing Cookies
                                            </label>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                                Used to track visitors across websites for advertising purposes.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Preferences */}
                                    <div className={`flex items-start gap-3 p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                                        <Checkbox
                                            id="preferences"
                                            checked={preferences.preferences}
                                            onCheckedChange={(checked) => handlePreferenceChange('preferences', checked as boolean)}
                                            className="mt-1"
                                        />
                                        <div className="flex-1">
                                            <label
                                                htmlFor="preferences"
                                                className={`font-medium ${textColor}`}
                                            >
                                                Preference Cookies
                                            </label>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                                Allow the website to remember your preferences and settings.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        onClick={handleSaveSettings}
                                        className="bg-gold hover:bg-gold/90 text-navy font-semibold"
                                    >
                                        Save Preferences
                                    </Button>
                                    <Button
                                        onClick={handleAcceptAll}
                                        variant="outline"
                                        size="sm"
                                        className={`${isDark ? 'border-gray-600 text-white hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        Accept All
                                    </Button>
                                    <Button
                                        onClick={handleRejectAll}
                                        variant="outline"
                                        size="sm"
                                        className={`${isDark ? 'border-gray-600 text-white hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        Reject All
                                    </Button>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <button
                                        onClick={() => window.location.href = '/cookie-policy'}
                                        className={`text-sm underline ${isDark ? 'text-gold hover:text-gold/80' : 'text-amber-600 hover:text-amber-700'}`}
                                    >
                                        Learn more about our Cookie Policy
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Hook to get current cookie preferences
export function useCookieConsent() {
    const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
    const [hasConsented, setHasConsented] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(COOKIE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as CookiePreferences;
                setPreferences(parsed);
                setHasConsented(true);
            } catch {
                setHasConsented(false);
            }
        }
    }, []);

    const updatePreferences = useCallback((newPrefs: Partial<CookiePreferences>) => {
        const current = preferences || defaultPreferences;
        const updated = { ...current, ...newPrefs, timestamp: Date.now() };
        localStorage.setItem(COOKIE_KEY, JSON.stringify(updated));
        setPreferences(updated);
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: updated }));
    }, [preferences]);

    const resetConsent = useCallback(() => {
        localStorage.removeItem(COOKIE_KEY);
        setPreferences(null);
        setHasConsented(false);
    }, []);

    return {
        preferences,
        hasConsented,
        updatePreferences,
        resetConsent,
    };
}

export default CookieConsent;
