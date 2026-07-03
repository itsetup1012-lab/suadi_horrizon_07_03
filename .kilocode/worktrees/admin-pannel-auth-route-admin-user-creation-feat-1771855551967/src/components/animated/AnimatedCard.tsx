import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    hover?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
    children,
    className = '',
    delay = 0,
    hover = true,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : undefined}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
    children,
    className = '',
    delay = 0,
}) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay }}
            className={className}
        >
            {children}
        </motion.section>
    );
};
