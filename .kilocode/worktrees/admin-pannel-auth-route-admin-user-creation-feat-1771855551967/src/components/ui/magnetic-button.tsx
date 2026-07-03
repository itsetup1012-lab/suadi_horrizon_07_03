"use client";

import { useRef, useCallback, ReactNode } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'outline' | 'ghost';
    onClick?: () => void;
    magnetStrength?: number;
}

export function MagneticButton({
    children,
    className = '',
    variant = 'default',
    onClick,
    magnetStrength = 0.3
}: MagneticButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLSpanElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const button = buttonRef.current;
        const content = contentRef.current;
        if (!button || !content) return;

        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Move button slightly toward cursor
        gsap.to(button, {
            x: x * magnetStrength,
            y: y * magnetStrength,
            duration: 0.3,
            ease: 'power2.out',
        });

        // Move content in opposite direction for parallax effect
        gsap.to(content, {
            x: x * magnetStrength * 0.5,
            y: y * magnetStrength * 0.5,
            duration: 0.3,
            ease: 'power2.out',
        });
    }, [magnetStrength]);

    const handleMouseLeave = useCallback(() => {
        const button = buttonRef.current;
        const content = contentRef.current;
        if (!button || !content) return;

        gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
        });

        gsap.to(content, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
        });
    }, []);

    return (
        <Button
            ref={buttonRef}
            variant={variant as any}
            className={`relative overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            <span ref={contentRef} className="relative z-10 flex items-center gap-2">
                {children}
            </span>
        </Button>
    );
}

// Glowing variant with pulse animation
export function GlowButton({
    children,
    className = '',
    onClick,
}: {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                relative px-8 py-4 font-semibold text-navy bg-yellow 
                rounded-xl overflow-hidden
                transition-all duration-300
                hover:shadow-[0_0_30px_rgba(245,190,77,0.5)]
                hover:scale-105
                active:scale-95
                ${className}
            `}
        >
            {/* Glow pulse */}
            <span className="absolute inset-0 bg-gradient-to-r from-yellow-light via-yellow to-yellow-light animate-pulse opacity-50" />

            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    );
}
