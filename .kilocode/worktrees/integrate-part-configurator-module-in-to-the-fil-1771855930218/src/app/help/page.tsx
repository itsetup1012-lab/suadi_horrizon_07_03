'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Phone, Mail, MessageCircle, FileText, ShoppingCart, CreditCard, Truck, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const faqCategories = [
    {
        icon: <ShoppingCart className="w-5 h-5" />,
        title: 'Orders & Shopping',
        questions: [
            { q: 'How do I track my order?', a: 'You can track your order by logging into your account and visiting the Orders section, or by using the tracking number sent to your email.' },
            { q: 'Can I modify or cancel my order?', a: 'Yes, you can modify or cancel your order within 24 hours of placement. Contact our support team for assistance.' },
            { q: 'What payment methods do you accept?', a: 'We accept credit cards (Visa, MasterCard, American Express), bank transfers, and cash on delivery.' },
        ],
    },
    {
        icon: <Truck className="w-5 h-5" />,
        title: 'Shipping & Delivery',
        questions: [
            { q: 'What are the shipping rates?', a: 'Shipping rates vary based on location and order size. Free shipping is available for orders over KWD 50 within Kuwait.' },
            { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days. Express delivery is available for next-day delivery at an additional cost.' },
            { q: 'Do you ship internationally?', a: 'Yes, we ship to GCC countries and select international destinations. Contact us for shipping rates to your location.' },
        ],
    },
    {
        icon: <CreditCard className="w-5 h-5" />,
        title: 'Payments & Pricing',
        questions: [
            { q: 'Is my payment information secure?', a: 'Yes, all payments are processed through secure SSL-encrypted channels. We never store your full card details.' },
            { q: 'Do you offer installment plans?', a: 'Yes, we offer 0% installment plans through select banks. Contact our sales team for more details.' },
            { q: 'Are prices inclusive of VAT?', a: 'Yes, all prices displayed on our website include VAT at the applicable rate.' },
        ],
    },
    {
        icon: <Package className="w-5 h-5" />,
        title: 'Returns & Warranty',
        questions: [
            { q: 'What is your return policy?', a: 'We offer a 14-day return policy for unused items in original packaging. Certain items like fluids and filters are non-returnable.' },
            { q: 'How do I initiate a return?', a: 'Log into your account, go to Orders, select the items you want to return, and follow the prompts. Our team will contact you for pickup.' },
            { q: 'What warranties do you offer?', a: 'All products come with manufacturer warranties. Extended warranty options are available for purchase at checkout.' },
        ],
    },
];

const contactOptions = [
    { icon: <Phone className="w-6 h-6" />, title: 'Phone', value: '+965 2222 3333', desc: 'Mon-Sat: 8AM-8PM' },
    { icon: <Mail className="w-6 h-6" />, title: 'Email', value: 'support@saudihorizon.com', desc: 'Response within 24 hours' },
    { icon: <MessageCircle className="w-6 h-6" />, title: 'Live Chat', value: 'Available Now', desc: 'Instant support' },
];

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = React.useState('');

    return (
        <div className="min-h-screen bg-navy text-white pt-32 pb-20">
            <div className="container mx-auto px-4">
                {/* Hero Section */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="heading-lg mb-6">How Can We <span className="text-gradient-gold">Help You?</span></h1>
                        <p className="text-body-lg text-white/70 mb-10">
                            Find answers to common questions or get in touch with our support team
                        </p>

                        {/* Search */}
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <Input
                                type="text"
                                placeholder="Search for help..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-14 pr-5 py-4 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold/50 focus:ring-gold/20 rounded-full text-lg"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* FAQ Categories */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {faqCategories.map((category, idx) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                            <Card className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300 h-full">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                                        <span className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                                            {category.icon}
                                        </span>
                                        {category.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="single" collapsible className="text-white/80">
                                        {category.questions.map((item, qIdx) => (
                                            <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`} className="border-white/10">
                                                <AccordionTrigger className="text-left hover:text-gold hover:no-underline py-4">
                                                    {item.q}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-white/60 leading-relaxed">
                                                    {item.a}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Contact Options */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="text-center mb-10">
                        <h2 className="heading-md mb-4">Still Need <span className="text-gradient-gold">Assistance?</span></h2>
                        <p className="text-white/60">Our support team is here to help you</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {contactOptions.map((option, idx) => (
                            <Card key={idx} className="bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300 text-center p-6">
                                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 text-gold">
                                    {option.icon}
                                </div>
                                <h3 className="font-semibold text-lg mb-1">{option.title}</h3>
                                <p className="text-gold font-medium">{option.value}</p>
                                <p className="text-white/50 text-sm mt-1">{option.desc}</p>
                            </Card>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
