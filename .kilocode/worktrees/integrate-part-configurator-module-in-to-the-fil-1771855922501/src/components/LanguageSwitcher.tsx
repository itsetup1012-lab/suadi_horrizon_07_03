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

export function LanguageSwitcher() {
    const [isClient, setIsClient] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');

    useEffect(() => {
        setIsClient(true);
        setCurrentLang(i18n.language || 'en');
    }, []);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setCurrentLang(lng);
        document.dir = i18n.dir(lng);
        document.documentElement.lang = lng;
    };

    if (!isClient) {
        return (
            <Button variant="ghost" size="icon" disabled>
                <Globe className="h-5 w-5" />
                <span className="sr-only">Switch Language</span>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Switch Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage('en')} disabled={currentLang === 'en'}>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('ar')} disabled={currentLang === 'ar'}>
                    العربية
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
