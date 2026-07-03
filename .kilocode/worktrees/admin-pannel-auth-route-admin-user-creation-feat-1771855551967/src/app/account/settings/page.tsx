'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Package, MapPin, CreditCard, Bell, Settings, Lock, Eye, EyeOff, Shield, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getUserProfile, updateUserProfile } from '@/api/user';

export default function SettingsPage() {
    const router = useRouter();
    const { isAuthenticated, user, isInitialized } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Notification settings
    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotions: false,
        newsletter: true,
        sms: false,
    });

    React.useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push('/login?redirect=/account/settings');
        }
    }, [isAuthenticated, isInitialized, router]);

    // Fetch user profile from API
    useEffect(() => {
        const fetchProfile = async () => {
            if (isAuthenticated) {
                try {
                    const data = await getUserProfile();
                    setProfileData({
                        name: data.name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        company: data.company || '',
                    });
                } catch (error) {
                    console.error('Error fetching profile:', error);
                    setProfileData({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: '',
                        company: '',
                    });
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchProfile();
    }, [isAuthenticated, user]);

    if (!isInitialized || !isAuthenticated) {
        return null;
    }

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateUserProfile({
                name: profileData.name,
                phone: profileData.phone,
                company: profileData.company,
            });
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            await updateUserProfile({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success('Password updated successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error: any) {
            toast.error(error.message || 'Failed to update password');
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
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => router.push('/account')} className="hover:text-gold transition-colors">Account</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-slate-600" />
                        <BreadcrumbPage className="text-gold font-medium">Settings</BreadcrumbPage>
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
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account/addresses')}>
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Addresses
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account/payment')}>
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Payment Methods
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-gold hover:bg-white/5" onClick={() => router.push('/account/notifications')}>
                                    <Bell className="w-4 h-4 mr-2" />
                                    Notifications
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-gold bg-gold/10" onClick={() => router.push('/account/settings')}>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
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
                            <h1 className="text-3xl font-bold mb-6 font-display text-white">Account Settings</h1>

                            {/* Tabs */}
                            <div className="flex gap-2 mb-6 flex-wrap">
                                <Button
                                    variant={activeTab === 'profile' ? 'default' : 'outline'}
                                    onClick={() => setActiveTab('profile')}
                                    className={activeTab === 'profile' ? 'bg-gold text-navy hover:bg-gold/90' : 'border-white/10 text-slate-300 hover:text-gold hover:border-gold/30'}
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    Profile
                                </Button>
                                <Button
                                    variant={activeTab === 'security' ? 'default' : 'outline'}
                                    onClick={() => setActiveTab('security')}
                                    className={activeTab === 'security' ? 'bg-gold text-navy hover:bg-gold/90' : 'border-white/10 text-slate-300 hover:text-gold hover:border-gold/30'}
                                >
                                    <Lock className="w-4 h-4 mr-2" />
                                    Security
                                </Button>
                                <Button
                                    variant={activeTab === 'notifications' ? 'default' : 'outline'}
                                    onClick={() => setActiveTab('notifications')}
                                    className={activeTab === 'notifications' ? 'bg-gold text-navy hover:bg-gold/90' : 'border-white/10 text-slate-300 hover:text-gold hover:border-gold/30'}
                                >
                                    <Bell className="w-4 h-4 mr-2" />
                                    Notifications
                                </Button>
                            </div>

                            {/* Profile Settings */}
                            {activeTab === 'profile' && (
                                <Card className="glass border-white/5">
                                    <CardHeader>
                                        <CardTitle className="text-white font-display">Profile Information</CardTitle>
                                        <CardDescription className="text-slate-400">Update your account details</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                                                    <Input
                                                        id="name"
                                                        value={profileData.name}
                                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                        className="mt-1 bg-white/5 border-white/10 text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={profileData.email}
                                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                        className="mt-1 bg-white/5 border-white/10 text-white"
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                                                    <Input
                                                        id="phone"
                                                        value={profileData.phone}
                                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                        className="mt-1 bg-white/5 border-white/10 text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="company" className="text-slate-300">Company</Label>
                                                    <Input
                                                        id="company"
                                                        value={profileData.company}
                                                        onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                                                        className="mt-1 bg-white/5 border-white/10 text-white"
                                                    />
                                                </div>
                                            </div>
                                            <Button type="submit" className="bg-gold hover:bg-yellow text-navy font-bold">
                                                Save Changes
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Security Settings */}
                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <Card className="glass border-white/5">
                                        <CardHeader>
                                            <CardTitle className="text-white font-display flex items-center gap-2">
                                                <Lock className="w-5 h-5 text-gold" />
                                                Change Password
                                            </CardTitle>
                                            <CardDescription className="text-slate-400">Update your password regularly for security</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                                <div>
                                                    <Label htmlFor="currentPassword" className="text-slate-300">Current Password</Label>
                                                    <div className="relative mt-1">
                                                        <Input
                                                            id="currentPassword"
                                                            type={showCurrentPassword ? 'text' : 'password'}
                                                            value={passwordData.currentPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                            className="pr-10 bg-white/5 border-white/10 text-white"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                                        >
                                                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                                                    <div className="relative mt-1">
                                                        <Input
                                                            id="newPassword"
                                                            type={showNewPassword ? 'text' : 'password'}
                                                            value={passwordData.newPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                            className="pr-10 bg-white/5 border-white/10 text-white"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                                        >
                                                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor="confirmPassword" className="text-slate-300">Confirm New Password</Label>
                                                    <Input
                                                        id="confirmPassword"
                                                        type="password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                        className="mt-1 bg-white/5 border-white/10 text-white"
                                                    />
                                                </div>
                                                <Button type="submit" className="bg-gold hover:bg-yellow text-navy font-bold">
                                                    Update Password
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>

                                    <Card className="glass border-white/5">
                                        <CardHeader>
                                            <CardTitle className="text-white font-display flex items-center gap-2">
                                                <Shield className="w-5 h-5 text-gold" />
                                                Two-Factor Authentication
                                            </CardTitle>
                                            <CardDescription className="text-slate-400">Add an extra layer of security to your account</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                                                        <Smartphone className="w-6 h-6 text-gold" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">Authenticator App</p>
                                                        <p className="text-sm text-slate-400">Use an authenticator app to generate codes</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
                                                    Enable
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Notification Settings */}
                            {activeTab === 'notifications' && (
                                <Card className="glass border-white/5">
                                    <CardHeader>
                                        <CardTitle className="text-white font-display flex items-center gap-2">
                                            <Bell className="w-5 h-5 text-gold" />
                                            Notification Preferences
                                        </CardTitle>
                                        <CardDescription className="text-slate-400">Choose how you want to receive updates</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {[
                                            { key: 'orderUpdates', title: 'Order Updates', description: 'Get notified about order status changes' },
                                            { key: 'promotions', title: 'Promotions & Deals', description: 'Receive special offers and discounts' },
                                            { key: 'newsletter', title: 'Newsletter', description: 'Monthly digest of new products and updates' },
                                            { key: 'sms', title: 'SMS Notifications', description: 'Receive order updates via SMS' },
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-white">{item.title}</p>
                                                    <p className="text-sm text-slate-400">{item.description}</p>
                                                </div>
                                                <Switch
                                                    checked={notifications[item.key as keyof typeof notifications]}
                                                    onCheckedChange={(checked) =>
                                                        setNotifications({ ...notifications, [item.key]: checked })
                                                    }
                                                    className="data-[state=checked]:bg-gold"
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            className="bg-gold hover:bg-yellow text-navy font-bold"
                                            onClick={() => toast.success('Notification preferences saved')}
                                        >
                                            Save Preferences
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
