'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Package, MapPin, Bell, Mail, MessageSquare, Settings, Heart, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { getNotificationPreferences, updateNotificationPreferences, NotificationPreferences } from '@/api/user';

export default function NotificationsPage() {
    const router = useRouter();
    const { isAuthenticated, user, isInitialized } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotionalEmails: false,
        smsNotifications: true,
        pushNotifications: true,
        newsletter: false,
        newProducts: true,
        priceAlerts: true,
    });

    useEffect(() => {
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
                } finally {
                    setIsLoading(false);
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
            toast.success('Preferences updated');
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
        <div className="min-h-screen bg-navy text-white py-8 relative">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />
            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList className="text-slate-400">
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/')} className="hover:text-gold transition-colors">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-slate-600" />
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/account')} className="hover:text-gold transition-colors">Account</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-slate-600" />
                        <BreadcrumbPage className="text-gold font-medium">Notifications</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="glass border-white/5">
                            <CardHeader className="pb-4">
                                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-8 h-8 text-gold" />
                                </div>
                                <CardTitle className="text-center text-white font-display">{user?.name || 'Customer'}</CardTitle>
                                <p className="text-sm text-slate-400 text-center">{user?.email || 'customer@example.com'}</p>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account')}>
                                    <User className="w-4 h-4 mr-2" />
                                    Overview
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account/orders')}>
                                    <Package className="w-4 h-4 mr-2" />
                                    Orders
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account/wishlist')}>
                                    <Heart className="w-4 h-4 mr-2" />
                                    Wishlist
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account/returns')}>
                                    <Undo2 className="w-4 h-4 mr-2" />
                                    Returns
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account/addresses')}>
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Addresses
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account/settings')}>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-gold bg-white/5" onClick={() => router.push('/account/notifications')}>
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
                            className="space-y-6"
                        >
                            <h1 className="text-3xl font-bold font-display text-white">Notification Preferences</h1>

                            {/* Email Notifications */}
                            <Card className="glass border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-xl font-display flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-gold" />
                                        Email Notifications
                                    </CardTitle>
                                    <CardDescription className="text-slate-400">Manage what updates you receive via email</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <PreferenceItem
                                        title="Order Updates"
                                        description="Receive updates about your orders and tracking information"
                                        checked={notifications.orderUpdates}
                                        onCheckedChange={() => handleToggle('orderUpdates')}
                                    />
                                    <PreferenceItem
                                        title="Promotional Emails"
                                        description="Receive promotional offers, discounts, and exclusive deals"
                                        checked={notifications.promotionalEmails}
                                        onCheckedChange={() => handleToggle('promotionalEmails')}
                                    />
                                    <PreferenceItem
                                        title="Newsletter"
                                        description="Subscribe to our regular newsletter for industry news and updates"
                                        checked={notifications.newsletter}
                                        onCheckedChange={() => handleToggle('newsletter')}
                                    />
                                    <PreferenceItem
                                        title="New Products"
                                        description="Get notified when we add new products to our catalog"
                                        checked={notifications.newProducts}
                                        onCheckedChange={() => handleToggle('newProducts')}
                                    />
                                    <PreferenceItem
                                        title="Price Alerts"
                                        description="Get notified when prices drop on items in your wishlist"
                                        checked={notifications.priceAlerts}
                                        onCheckedChange={() => handleToggle('priceAlerts')}
                                    />
                                </CardContent>
                            </Card>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {/* SMS Notifications */}
                                <Card className="glass border-white/5">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-display flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-gold" />
                                            SMS Alerts
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <PreferenceItem
                                            title="Order SMS"
                                            description="Receive critical order status updates via SMS"
                                            checked={notifications.smsNotifications}
                                            onCheckedChange={() => handleToggle('smsNotifications')}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Push Notifications */}
                                <Card className="glass border-white/5">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-display flex items-center gap-2">
                                            <Bell className="w-5 h-5 text-gold" />
                                            Push Notifications
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <PreferenceItem
                                            title="Enable Push"
                                            description="Receive instant alerts on your mobile device"
                                            checked={notifications.pushNotifications}
                                            onCheckedChange={() => handleToggle('pushNotifications')}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PreferenceItem({ title, description, checked, onCheckedChange }: {
    title: string;
    description: string;
    checked: boolean;
    onCheckedChange: () => void
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
                <p className="font-medium text-white">{title}</p>
                <p className="text-sm text-slate-400">{description}</p>
            </div>
            <Switch
                checked={checked}
                onCheckedChange={onCheckedChange}
                className="data-[state=checked]:bg-gold"
            />
        </div>
    );
}
