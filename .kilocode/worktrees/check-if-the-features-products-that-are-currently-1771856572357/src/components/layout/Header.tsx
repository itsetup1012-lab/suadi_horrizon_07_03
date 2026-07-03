'use client';

import Link from "next/link";
import { ShoppingCart, Menu, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleWhatsApp = () => {
        const message = encodeURIComponent("Hello! I'm interested in heavy equipment spare parts.");
        window.open(`https://wa.me/966570196677?text=${message}`, '_blank');
    };

    const navItems = [
        { label: 'Home', path: "/" },
        { label: 'Spare Parts', path: "/products" },
        { label: 'Categories', path: "/categories" },
        { label: 'About', path: "/about" },
        { label: 'Contact', path: "/contact" },
    ];

    return (
        <header
            className={`
        fixed top-0 z-50 w-full transition-all duration-300
        ${isScrolled
                    ? 'bg-navy/95 backdrop-blur-md shadow-lg'
                    : 'bg-navy'}
      `}
        >
            <div className="flex h-16 items-center justify-between px-6 lg:px-24">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <div className="w-10 h-10 bg-yellow rounded-lg flex items-center justify-center">
                        <span className="text-navy font-bold text-sm">SH</span>
                    </div>
                    <span className="font-heading font-bold text-xl text-white hidden sm:block">
                        Saudi Horizon
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.path}
                            className="px-4 py-2 text-sm text-white/80 hover:text-yellow hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* WhatsApp Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleWhatsApp}
                        aria-label="Contact via WhatsApp"
                        className="text-green-400 hover:text-green-300 hover:bg-white/5"
                        title="WhatsApp"
                    >
                        <MessageCircle className="h-5 w-5" />
                    </Button>

                    {/* Request Quote CTA */}
                    <Button
                        size="sm"
                        onClick={() => window.location.href = "/contact"}
                        className="hidden sm:flex bg-yellow hover:bg-yellow/90 text-navy font-semibold"
                    >
                        Request Quote
                    </Button>

                    {/* Cart Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.location.href = "/cart"}
                        className="relative text-white/80 hover:text-yellow hover:bg-white/5"
                        aria-label="Shopping cart"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {/* Cart count badge - can be dynamic later */}
                    </Button>

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-white/80 hover:text-yellow hover:bg-white/5"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-navy border-t border-white/10 animate-in slide-in-from-top">
                    <nav className="flex flex-col gap-1 p-4">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-4 py-3 text-white/80 hover:text-yellow hover:bg-white/5 rounded-lg transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                window.location.href = "/contact";
                            }}
                            className="mt-2 bg-yellow hover:bg-yellow/90 text-navy font-semibold justify-start"
                        >
                            Request Quote
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleWhatsApp();
                            }}
                            className="text-green-400 hover:text-green-300 hover:bg-white/5 justify-start"
                        >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            WhatsApp
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    );
}
