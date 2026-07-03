'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Tag, Percent, Clock, Gift, ChevronRight, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { toast } from 'sonner';

const activePromotions = [
    {
        id: '1',
        title: 'New Year Sale',
        description: 'Get 15% off on all CAT equipment parts',
        code: 'NEWYEAR15',
        discount: '15%',
        expires: '2024-02-28',
        minOrder: 100,
        category: 'All Items',
        featured: true,
    },
    {
        id: '2',
        title: 'Free Shipping',
        description: 'Free shipping on orders over KWD 50',
        code: 'FREESHIP',
        discount: 'Free Shipping',
        expires: '2024-03-31',
        minOrder: 50,
        category: 'Shipping',
        featured: false,
    },
    {
        id: '3',
        title: 'Bulk Discount',
        description: '20% off on orders over KWD 500',
        code: 'BULK20',
        discount: '20%',
        expires: '2024-12-31',
        minOrder: 500,
        category: 'Bulk Orders',
        featured: false,
    },
];

const seasonalSales = [
    { name: 'Winter Sale', status: 'Active', discount: 'Up to 25% off', color: 'bg-blue-500' },
    { name: 'Spring Promotion', status: 'Coming Soon', discount: 'TBA', color: 'bg-green-500' },
    { name: 'Summer Deals', status: 'Coming Soon', discount: 'TBA', color: 'bg-yellow-500' },
];

export default function PromotionsPage() {
    const router = useRouter();
    const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
    const [couponCode, setCouponCode] = React.useState('');

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success('Coupon code copied!');
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const applyCoupon = () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }
        toast.success('Coupon applied successfully!');
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-6xl mx-auto px-4">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>Promotions</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                        <Percent className="w-10 h-10 text-primary" />
                        Special Offers & Promotions
                    </h1>
                    <p className="text-muted-foreground">Save more with our exclusive deals and discounts</p>
                </div>

                {/* Apply Coupon Section */}
                <Card className="glass-strong mb-8">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="text-sm font-medium mb-2 block">Have a coupon code?</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className="uppercase"
                                    />
                                    <Button onClick={applyCoupon}>Apply</Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="coupons" className="mb-12">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="coupons">Active Coupons</TabsTrigger>
                        <TabsTrigger value="sales">Upcoming Sales</TabsTrigger>
                    </TabsList>

                    <TabsContent value="coupons">
                        {/* Featured Promotion */}
                        {activePromotions.filter(p => p.featured).map((promo, index) => (
                            <motion.div
                                key={promo.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="mb-6"
                            >
                                <Card className="glass-strong border-primary/50">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6 items-center">
                                            <div className="w-20 h-20 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Gift className="w-10 h-10 text-primary" />
                                            </div>
                                            <div className="flex-1 text-center md:text-left">
                                                <Badge className="mb-2">Featured</Badge>
                                                <h3 className="text-xl font-bold mb-1">{promo.title}</h3>
                                                <p className="text-muted-foreground mb-2">{promo.description}</p>
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        Expires: {promo.expires}
                                                    </span>
                                                    <span>Min. order: KWD {promo.minOrder}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="px-4 py-2 bg-muted rounded-lg font-mono font-bold text-lg">
                                                    {promo.code}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(promo.code)}
                                                >
                                                    {copiedCode === promo.code ? (
                                                        <>
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Copied
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-4 h-4 mr-1" />
                                                            Copy
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}

                        {/* Other Coupons */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {activePromotions.filter(p => !p.featured).map((promo, index) => (
                                <motion.div
                                    key={promo.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="glass-light dark:glass-dark">
                                        <CardContent className="p-5">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-semibold">{promo.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{promo.description}</p>
                                                </div>
                                                <Badge variant="outline">{promo.discount}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t">
                                                <span className="text-xs text-muted-foreground">
                                                    Expires: {promo.expires}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(promo.code)}
                                                >
                                                    {copiedCode === promo.code ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                    <span className="ml-1">{promo.code}</span>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="sales">
                        <div className="grid md:grid-cols-3 gap-4">
                            {seasonalSales.map((sale, index) => (
                                <motion.div
                                    key={sale.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="glass-light dark:glass-dark">
                                        <CardContent className="p-5">
                                            <div className={`w-12 h-12 ${sale.color} rounded-lg flex items-center justify-center mb-4`}>
                                                <Tag className="w-6 h-6 text-white" />
                                            </div>
                                            <h4 className="font-semibold mb-1">{sale.name}</h4>
                                            <p className="text-sm text-muted-foreground mb-3">{sale.discount}</p>
                                            <Badge variant={sale.status === 'Active' ? 'default' : 'secondary'}>
                                                {sale.status}
                                            </Badge>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Loyalty Program Info */}
                <Card className="glass-light dark:glass-dark">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Gift className="w-7 h-7 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-2">Join Our Loyalty Program</h3>
                                <p className="text-muted-foreground mb-4">
                                    Earn points on every purchase and redeem them for exclusive discounts.
                                    Members get early access to sales and special promotions!
                                </p>
                                <Button onClick={() => router.push('/account')}>
                                    Learn More
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
