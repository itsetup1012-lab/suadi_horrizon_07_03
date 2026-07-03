'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User, Package, MapPin, Settings, Bell, Heart, Undo2,
  Save, LogOut, Shield, Mail, Phone, Building, Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, updateUserProfile, UserProfile } from '@/api/user';
import { toast } from 'sonner';

export default function AccountSettingsPage() {
  const router = useRouter();
  const { isAuthenticated, user, isInitialized, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login?redirect=/account/settings');
      return;
    }

    const fetchProfile = async () => {
      if (isAuthenticated) {
        try {
          const data = await getUserProfile();
          setProfile({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            company: data.company || ''
          });
        } catch (error) {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile details');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
  }, [isInitialized, isAuthenticated, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile({
        name: profile.name,
        phone: profile.phone,
        company: profile.company
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

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
                <Button variant="ghost" className="w-full justify-start text-gold bg-white/5" onClick={() => router.push('/account/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <div className="pt-4 mt-4 border-t border-white/5">
                  <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
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
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-display text-white">Account Settings</h1>
              </div>

              {/* Profile Settings */}
              <Card className="glass border-white/5">
                <CardHeader>
                  <CardTitle className="text-xl font-display flex items-center gap-2">
                    <User className="w-5 h-5 text-gold" />
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-slate-400">Update your account details and contact information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="pl-10 bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                          <Input
                            id="email"
                            value={profile.email}
                            disabled
                            className="pl-10 bg-white/5 border-white/10 text-slate-500 cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                          <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="pl-10 bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-slate-300">Company Name</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                          <Input
                            id="company"
                            value={profile.company}
                            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                            className="pl-10 bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isSaving} className="bg-gold hover:bg-yellow text-navy font-bold">
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Password Settings */}
              <Card className="glass border-white/5">
                <CardHeader>
                  <CardTitle className="text-xl font-display flex items-center gap-2">
                    <Shield className="w-5 h-5 text-gold" />
                    Security
                  </CardTitle>
                  <CardDescription className="text-slate-400">Change your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-slate-300">Current Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwords.currentPassword}
                          onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                          className="pl-10 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                        <div className="relative">
                          <Key className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            className="pl-10 bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-slate-300">Confirm New Password</Label>
                        <div className="relative">
                          <Key className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            className="pl-10 bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isSaving} className="bg-gold hover:bg-yellow text-navy font-bold">
                        <Shield className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
