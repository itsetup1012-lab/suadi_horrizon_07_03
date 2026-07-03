"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

const quickLinks = [
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "Contact", href: "/contact" },
    { label: "Installation", href: "/installation" },
    { label: "Maintenance", href: "/maintenance" },
];

const productCategories = [
    { label: "Engine Parts", href: "/categories?category=engine" },
    { label: "Hydraulic Systems", href: "/categories?category=hydraulic" },
    { label: "Electrical Parts", href: "/categories?category=electrical" },
    { label: "Transmission", href: "/categories?category=transmission" },
    { label: "Undercarriage", href: "/categories?category=undercarriage" },
    { label: "Attachments", href: "/categories?category=attachments" },
];

const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
];

export function CTAFooterSection() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const footerRef = useRef(null);
    const footerInView = useInView(footerRef, { once: true, margin: "-100px" });

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail("");
        }
    };

    return (
        <>
            {/* Footer only - CTA removed */}
            <footer ref={footerRef} className="bg-[var(--color-bg-secondary)] pt-24 pb-8">
                <div className="container-premium">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                        {/* Brand Column */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={footerInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-1"
                        >
                            <Link href="/" className="inline-block mb-6">
                                <span className="text-2xl font-bold tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                                    SAUDI <span className="text-[var(--color-accent)]">HORIZON</span>
                                </span>
                            </Link>
                            <p className="text-body-md text-white/60 mb-8">
                                Premier supplier of heavy machinery parts and industrial equipment
                                across the Kingdom of Saudi Arabia and the Middle East.
                            </p>
                            {/* Social Links */}
                            <div className="flex gap-3">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-accent)] hover:text-[var(--color-bg-primary)] transition-colors"
                                        aria-label={social.label}
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={footerInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
                            <ul className="space-y-3.5">
                                {quickLinks.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-body-md text-white/60 hover:text-[var(--color-accent)] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Product Categories */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={footerInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h4 className="text-lg font-bold mb-6">Product Categories</h4>
                            <ul className="space-y-3.5">
                                {productCategories.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-body-md text-white/60 hover:text-[var(--color-accent)] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Contact & Newsletter */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={footerInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <h4 className="text-lg font-bold mb-6">Stay Updated</h4>

                            {/* Contact Info */}
                            <div className="space-y-4 mb-8">
                                <a href="tel:+966500000000" className="flex items-center gap-3 text-body-md text-white/60 hover:text-[var(--color-accent)] transition-colors">
                                    <Phone className="w-5 h-5" />
                                    <span>+966 50 000 0000</span>
                                </a>
                                <a href="mailto:info@saudihorizon.com" className="flex items-center gap-3 text-body-md text-white/60 hover:text-[var(--color-accent)] transition-colors">
                                    <Mail className="w-5 h-5" />
                                    <span>info@saudihorizon.com</span>
                                </a>
                                <div className="flex items-start gap-3 text-body-md text-white/60">
                                    <MapPin className="w-5 h-5 mt-0.5" />
                                    <span>Riyadh, Kingdom of Saudi Arabia</span>
                                </div>
                            </div>

                            {/* Newsletter */}
                            <div>
                                <p className="text-body-sm text-white/60 mb-4">
                                    Subscribe to our newsletter for the latest stock updates and industry news.
                                </p>
                                {subscribed ? (
                                    <p className="text-[var(--color-accent)] font-semibold">Thank you for subscribing!</p>
                                ) : (
                                    <form onSubmit={handleSubscribe} className="flex">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Your email"
                                            className="flex-1 bg-white/5 border border-white/10 px-5 py-3.5 rounded-l-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-accent)] transition-colors text-body-md"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="bg-[var(--color-accent)] text-[var(--color-bg-primary)] px-5 py-3.5 rounded-r-lg font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-body-sm text-white/40">
                            © 2026 Saudi Horizon. All rights reserved.
                        </p>
                        <div className="flex gap-8">
                            <Link href="/privacy" className="text-body-sm text-white/40 hover:text-[var(--color-accent)] transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-body-sm text-white/40 hover:text-[var(--color-accent)] transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/sitemap" className="text-body-sm text-white/40 hover:text-[var(--color-accent)] transition-colors">
                                Sitemap
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
