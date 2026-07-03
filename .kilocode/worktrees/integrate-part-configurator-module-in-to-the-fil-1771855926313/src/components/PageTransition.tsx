import React from 'react';
import { motion, AnimatePresence, Transition } from 'framer-motion';

interface PageTransitionProps {
    children: React.ReactNode;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
    },
    exit: {
        opacity: 0,
        y: -20,
    },
};

const pageTransition: Transition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.3,
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
        >
            {children}
        </motion.div>
    );
};

// Animated Routes component for wrapping Routes
export const AnimatedRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AnimatePresence mode="wait">
            {children}
        </AnimatePresence>
    );
};
