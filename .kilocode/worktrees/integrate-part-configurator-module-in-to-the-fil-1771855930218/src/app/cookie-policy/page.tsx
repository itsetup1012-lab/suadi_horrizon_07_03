'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Cookie, Shield, Settings, Eye, Database, Target, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function CookiePolicyPage() {
    const router = useRouter();

    const cookieCategories = [
        {
            id: 'necessary',
            title: 'Strictly Necessary Cookies',
            description: 'These cookies are essential for the website to function properly. They enable basic features like page navigation, secure areas access, and remembering your preferences. The website cannot function without these cookies.',
            examples: ['Session cookies', 'Authentication tokens', 'Security cookies', 'Load balancing'],
            required: true,
            icon: Shield,
        },
        {
            id: 'analytics',
            title: 'Analytics Cookies',
            description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the site performance and user experience.',
            examples: ['Google Analytics', 'Page views', 'Time on site', 'Navigation patterns'],
            required: false,
            icon: Database,
        },
        {
            id: 'marketing',
            title: 'Marketing Cookies',
            description: 'These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.',
            examples: ['Ad tracking', 'Conversion pixels', 'Retargeting ads', 'Social media integration'],
            required: false,
            icon: Target,
        },
        {
            id: 'preferences',
            title: 'Preference Cookies',
            description: 'These cookies allow the website to remember choices you make (like language, region, or currency) and provide enhanced, more personal features.',
            examples: ['Language settings', 'Currency preferences', 'Region detection', 'UI customization'],
            required: false,
            icon: Settings,
        },
    ];

    return (
        <div className="min-h-screen bg-navy text-white pt-32 pb-20">
            <div className="container mx-auto px-4">
                <Breadcrumb className="mb-10">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/')}>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Cookie Policy</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Cookie className="w-10 h-10 text-gold" />
                    </div>
                    <h1 className="heading-lg mb-4">Cookie <span className="text-gradient-gold">Policy</span></h1>
                    <p className="text-xl text-white/70">
                        Learn how we use cookies to enhance your browsing experience.
                    </p>
                </motion.div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8 text-center">
                    <p className="text-white/60">
                        <span className="text-gold font-semibold">Last Updated:</span> February 2025
                    </p>
                </div>

                {/* Quick Actions */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            onClick={() => router.push('/privacy')}
                            className="bg-gold hover:bg-gold/90 text-navy font-semibold"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            View Privacy Policy
                        </Button>
                        <Button
                            onClick={() => {
                                // Trigger cookie settings modal
                                const event = new CustomEvent('openCookieSettings');
                                window.dispatchEvent(event);
                            }}
                            variant="outline"
                            className="border-gold text-gold hover:bg-gold/10"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Manage Cookie Settings
                        </Button>
                    </div>
                </motion.div>

                {/* Introduction */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300 mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-white">
                                <Cookie className="w-6 h-6 text-gold" />
                                What Are Cookies?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-white/70">
                            <p>
                                Cookies are small text files that are stored on your computer or mobile device when you visit a website.
                                They are widely used to make websites work more efficiently and provide information to website owners.
                            </p>
                            <p>
                                Cookies allow websites to recognize your device and remember information about your visit, such as your
                                preferred language, login information, and other settings. This can make your next visit easier and
                                the site more useful to you.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Cookie Categories */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-white text-center">
                        Cookie <span className="text-gold">Categories</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {cookieCategories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="bg-gray-800 border-gray-700 h-full">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3 text-white">
                                            <category.icon className="w-6 h-6 text-gold" />
                                            {category.title}
                                            {category.required && (
                                                <span className="ml-auto text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                                                    Required
                                                </span>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-gray-300">
                                        <p>{category.description}</p>
                                        <div>
                                            <p className="font-semibold text-white mb-2">Examples:</p>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                                {category.examples.map((example, i) => (
                                                    <li key={i}>{example}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="flex items-center gap-2 pt-2">
                                            {category.required ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm text-green-400">Cannot be disabled</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-4 h-4 text-yellow-500" />
                                                    <span className="text-sm text-yellow-400">You can choose to disable</span>
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* How We Use Cookies */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300 mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-white">
                                <RefreshCw className="w-6 h-6 text-gold" />
                                How We Use Cookies
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-white/70">
                            <ul className="list-disc list-inside space-y-3 ml-4">
                                <li><strong>Essential Operations:</strong> To keep you logged in and maintain your shopping cart</li>
                                <li><strong>Analytics:</strong> To analyze how our website is used and improve its performance</li>
                                <li><strong>Personalization:</strong> To remember your preferences and provide customized content</li>
                                <li><strong>Marketing:</strong> To show you relevant advertisements based on your interests</li>
                                <li><strong>Security:</strong> To detect and prevent fraudulent activity</li>
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Managing Cookies */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="bg-gray-800 border-gray-700 mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-white">
                                <Settings className="w-6 h-6 text-gold" />
                                Managing Your Cookie Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-gray-300">
                            <p>
                                You have the right to decide whether to accept or reject cookies. You can manage your preferences in several ways:
                            </p>
                            <ul className="list-disc list-inside space-y-3 ml-4">
                                <li>
                                    <strong>Cookie Banner:</strong> When you first visit our site, you can accept or customize your cookie preferences through our cookie banner.
                                </li>
                                <li>
                                    <strong>Browser Settings:</strong> Most web browsers allow you to control cookies through their settings. You can set your browser to notify you when you receive a cookie, or reject cookies entirely.
                                </li>
                                <li>
                                    <strong>Our Preference Center:</strong> Click the "Manage Cookie Settings" button above to update your preferences at any time.
                                </li>
                                <li>
                                    <strong>Third-Party Tools:</strong> You can opt-out of Google Analytics and other third-party cookies through the respective opt-out pages.
                                </li>
                            </ul>
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
                                <p className="text-yellow-400 font-semibold mb-2">Important Notice</p>
                                <p className="text-sm text-white/70">
                                    If you disable certain cookies, some features of our website may not function properly, and you may not be able to access certain areas of the site.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Contact Section */}
                <motion.div
                    className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 border border-yellow-500/30 rounded-lg p-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl font-bold mb-6 text-white text-center">Questions About Our Cookie Policy?</h2>
                    <div className="text-center">
                        <p className="text-white/70 mb-6">
                            If you have any questions about our use of cookies, please contact us.
                        </p>
                        <Button
                            onClick={() => router.push('/contact')}
                            className="bg-gold hover:bg-gold/90 text-navy font-semibold"
                        >
                            Contact Us
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
