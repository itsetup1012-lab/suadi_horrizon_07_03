'use client';

import { ReactNode } from 'react';

interface SquareBoxLayoutProps {
    children: ReactNode;
    className?: string;
    padding?: 'sm' | 'md' | 'lg' | 'xl';
    border?: boolean;
    shadow?: boolean;
    hover?: boolean;
}

export default function SquareBoxLayout({
    children,
    className = '',
    padding = 'md',
    border = true,
    shadow = true,
    hover = true,
}: SquareBoxLayoutProps) {
    const paddingClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-12',
    };

    const baseClasses = `
    bg-white rounded-lg transition-all duration-300
    ${paddingClasses[padding]}
    ${border ? 'border border-gray-200' : ''}
    ${shadow ? 'shadow-sm' : ''}
    ${hover ? 'hover:shadow-lg' : ''}
    ${className}
  `;

    return (
        <div className={baseClasses}>
            {children}
        </div>
    );
}