import React from 'react';
import { motion } from 'framer-motion';

interface ShimmerProps {
    className?: string;
    width?: string;
    height?: string;
}

export const Shimmer: React.FC<ShimmerProps> = ({
    className = '',
    width = '100%',
    height = '1rem',
}) => {
    return (
        <div
            className={`bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer rounded ${className}`}
            style={{ width, height }}
        />
    );
};

interface ShimmerCardProps {
    className?: string;
}

export const ShimmerCard: React.FC<ShimmerCardProps> = ({ className = '' }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
            {/* Image shimmer */}
            <Shimmer className="w-full h-48 rounded-none" />

            <div className="p-4 space-y-3">
                {/* Title shimmer */}
                <Shimmer className="h-4 w-3/4" />

                {/* Subtitle shimmer */}
                <Shimmer className="h-3 w-1/2" />

                {/* Content shimmers */}
                <div className="space-y-2">
                    <Shimmer className="h-3 w-full" />
                    <Shimmer className="h-3 w-4/5" />
                </div>

                {/* Price shimmer */}
                <div className="flex justify-between items-center">
                    <Shimmer className="h-5 w-20" />
                    <Shimmer className="h-4 w-16" />
                </div>

                {/* Button shimmers */}
                <div className="flex gap-2 pt-2">
                    <Shimmer className="h-8 flex-1" />
                    <Shimmer className="h-8 flex-1" />
                    <Shimmer className="h-8 w-8" />
                </div>
            </div>
        </div>
    );
};

interface ShimmerGridProps {
    count?: number;
    className?: string;
}

export const ShimmerGrid: React.FC<ShimmerGridProps> = ({
    count = 6,
    className = ''
}) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <ShimmerCard />
                </motion.div>
            ))}
        </div>
    );
};
