import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseIntersectionObserverOptions {
    threshold?: number;
    triggerOnce?: boolean;
    rootMargin?: string;
}

export const useIntersectionObserver = (
    options: UseIntersectionObserverOptions = {}
) => {
    const {
        threshold = 0.1,
        triggerOnce = true,
        rootMargin = '0px',
    } = options;

    const [ref, inView] = useInView({
        threshold,
        triggerOnce,
        rootMargin,
    });

    return { ref, inView };
};

// Hook for staggered animations
export const useStaggeredAnimation = (index: number, delay: number = 100) => {
    const { ref, inView } = useIntersectionObserver();

    return {
        ref,
        style: {
            animationDelay: inView ? `${index * delay}ms` : '0ms',
        },
    };
};
