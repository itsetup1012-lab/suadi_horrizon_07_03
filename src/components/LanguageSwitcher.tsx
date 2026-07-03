import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Globe } from 'lucide-react';
import i18n from '@/lib/i18n';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
    const { i18n: i18nInstance } = useTranslation();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const changeLanguage = (lng: string) => {
        i18nInstance.changeLanguage(lng);
        // Persistence handled by i18next-browser-languagedetector
    };

    if (!isClient) {
        return (
            <Button variant="ghost" size="icon" disabled>
                <Globe className="h-5 w-5" />
            </Button>
        );
    }

    const currentLang = i18nInstance.language?.split('-')[0] || 'en';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:text-gold transition-colors">
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Switch Language</span>
                    <span className="ml-1 text-[10px] uppercase font-bold text-white/40">{currentLang}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-navy border-white/10 text-white">
                <DropdownMenuItem onClick={() => changeLanguage('en')} className="focus:bg-gold/10 focus:text-gold cursor-pointer">
                    English (US)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('ar')} className="focus:bg-gold/10 focus:text-gold cursor-pointer">
                    العربية (SA)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
