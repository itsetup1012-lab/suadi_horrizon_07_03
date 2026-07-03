'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Package, MapPin, CreditCard, Bell, Mail, MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { getNotificationPreferences, updateNotificationPreferences, NotificationPreferences } from '@/api/user';

export default function NotificationsPage() {
    const router = useRouter();
    const { isAuthenticated, user, isInitialized } = useAuth();

    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotionalEmails: false,
        smsNotifications: true,
        pushNotifications: true,
        newsletter: false,
        newProducts: true,
        priceAlerts: true,
    });

    React.useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push('/login?redirect=/account/notifications');
        }
    }, [isAuthenticated, isInitialized, router]);

    // Fetch notification preferences from API
    useEffect(() => {
        const fetchNotifications = async () => {
            if (isAuthenticated) {
                try {
                    const data = await getNotificationPreferences();
                    setNotifications(data);
                } catch (error) {
                    console.error('Error fetching notification preferences:', error);
                }
            }
        };
        fetchNotifications();
    }, [isAuthenticated]);

    if (!isInitialized || !isAuthenticated) {
        return null;
    }

    const handleToggle = async (key: keyof NotificationPreferences) => {
        const newValue = !notifications[key];
        setNotifications({
            ...notifications,
            [key]: newValue,
        });
        try {
            await updateNotificationPreferences({ [key]: newValue });
            toast.success('Notification preferences updated');
        } catch (error) {
            // Revert on error
            setNotifications({
                ...notifications,
                [key]: !newValue,
            });
            toast.error('Failed to update preferences');
        }
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-6xl mx-auto px-4">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/')}>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/account')}>Account</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>Notifications</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="glass-light dark:glass-dark">
                            <CardHeader className="pb-4">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-center">{user?.name || 'Customer'}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/account')}>
                                    <User className="w-4 h-4 mr-2" />
                                    Overview
                                </Button>
                                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/account/orders')}>
                                    <Package className="w-4 h-4 mr-2" />
                                    Orders
                                </Button>
                                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/account/addresses')}>
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Addresses
                                </Button>
                                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/account/payment')}>
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Payment Methods
                                </Button>
                                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/account/notifications')}>
                                    <Bell className="w-4 h-4 mr-2" />
                                    Notifications
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-3xl font-bold mb-6">Notification Preferences</h1>

                            {/* Email Notifications */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Mail className="w-5 h-5" />
                                        Email Notifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Order Updates</p>
                                            <p className="text-sm text-muted-foreground">Receive updates about your orders</p>
                                        </div>
                                        <Switch
                                            checked={notifications.orderUpdates}
                                            onCheckedChange={() => handleToggle('orderUpdates')}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Promotional Emails</p>
                                            <p className="text-sm text-muted-foreground">Receive promotional offers and discounts</p>
                                        </div>
                                        <Switch
                                            checked={notifications.promotionalEmails}
                                            onCheckedChange={() => handleToggle('promotionalEmails')}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Newsletter</p>
                                            <p className="text-sm text-muted-foreground">Subscribe to our newsletter</p>
                                        </div>
                                        <Switch
                                            checked={notifications.newsletter}
                                            onCheckedChange={() => handleToggle('newsletter')}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">New Products</p>
                                            <p className="text-sm text-muted-foreground">Get notified about new product arrivals</p>
                                        </div>
                                        <Switch
                                            checked={notifications.newProducts}
                                            onCheckedChange={() => handleToggle('newProducts')}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Price Alerts</p>
                                            <p className="text-sm text-muted-foreground">Get notified when prices drop</p>
                                        </div>
                                        <Switch
                                            checked={notifications.priceAlerts}
                                            onCheckedChange={() => handleToggle('priceAlerts')}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* SMS Notifications */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5" />
                                        SMS Notifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">SMS Notifications</p>
                                            <p className="text-sm text-muted-foreground">Receive important updates via SMS</p>
                                        </div>
                                        <Switch
                                            checked={notifications.smsNotifications}
                                            onCheckedChange={() => handleToggle('smsNotifications')}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Push Notifications */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="w-5 h-5" />
                                        Push Notifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Push Notifications</p>
                                            <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                                        </div>
                                        <Switch
                                            checked={notifications.pushNotifications}
                                            onCheckedChange={() => handleToggle('pushNotifications')}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
