import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    placeholder?: string;
    blurDataURL?: string;
    className?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    placeholder,
    blurDataURL,
    className = '',
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
    };

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            {/* Placeholder/Blur */}
            {inView && !isLoaded && blurDataURL && (
                <img
                    src={blurDataURL}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
                    aria-hidden="true"
                />
            )}

            {/* Main Image */}
            {inView && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    {...props}
                />
            )}

            {/* Loading state */}
            {!inView && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="text-gray-400 text-sm">Image failed to load</div>
                </div>
            )}
        </div>
    );
};
