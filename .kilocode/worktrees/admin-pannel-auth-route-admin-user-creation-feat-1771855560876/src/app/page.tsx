"use client";

import { HeroSection } from "@/components/home/premium/HeroSection";
import { BrandStripSection } from "@/components/home/premium/BrandStripSection";
import { FeaturesGridSection } from "@/components/home/premium/FeaturesGridSection";
import { CategoriesSection } from "@/components/home/premium/CategoriesSection";
import { ProductsSection } from "@/components/home/premium/ProductsSection";
import { SplitStorySection } from "@/components/home/premium/SplitStorySection";
import { TestimonialsSection } from "@/components/home/premium/TestimonialsSection";
import { HomeCTASection } from "@/components/home/premium/HomeCTASection";
import { FeaturedArticlesSection } from "@/components/home/premium/FeaturedArticlesSection";
import { FAQSection } from "@/components/home/premium/FAQSection";
import { StatsSection } from "@/components/home/premium/StatsSection";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { AnimatedConnector, FloatingParticles } from "@/components/effects/SceneEffects";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-navy relative">
            {/* Ambient Background Particles */}
            <FloatingParticles />

            <HeroSection />
            <AnimatedConnector />
            <BrandStripSection />
            <AnimatedConnector />
            <StatsSection />
            <AnimatedConnector />
            <FeaturesGridSection />
            <AnimatedConnector />
            <CategoriesSection />
            <AnimatedConnector />
            <ProductsSection />
            <AnimatedConnector />
            <SplitStorySection />
            <AnimatedConnector />
            <TestimonialsSection />
            <AnimatedConnector />
            <HomeCTASection />
            <AnimatedConnector />
            <FeaturedArticlesSection />
            <AnimatedConnector />
            <FAQSection />

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy to-transparent pointer-events-none" />
        </div>
    );
}
