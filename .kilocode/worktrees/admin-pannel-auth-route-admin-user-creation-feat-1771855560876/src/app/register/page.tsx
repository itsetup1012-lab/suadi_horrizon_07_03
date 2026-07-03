'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Building, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

type RegisterForm = {
    name: string;
    email: string;
    phone: string;
    company: string;
    password: string;
    confirmPassword: string;
    agreedToTerms: boolean;
};

export default function RegisterPage() {
    const router = useRouter();
    const { register: registerUser, isAuthenticated } = useAuth();
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
    const password = watch('password', '');

    React.useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const onSubmit = async (data: RegisterForm) => {
        try {
            setLoading(true);
            // Note: AuthContext register only accepts email and password
            // Additional user data can be stored separately or updated after registration
            await registerUser(data.email, data.password);
            toast.success('Account created successfully!');
            router.push('/');
        } catch (error: any) {
            console.error('Registration error:', error);
            toast.error(error?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    // Password strength validation
    const getPasswordStrength = (pwd: string) => {
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[a-z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^A-Za-z0-9]/.test(pwd)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(password || '');
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg mx-auto"
            >
                <Card className="glass-light dark:glass-dark">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Create an Account</CardTitle>
                        <CardDescription>Join Saudi Horizon for exclusive access to machinery and parts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        placeholder="Enter your full name"
                                        className="pl-10"
                                        {...register('name', { required: 'Name is required' })}
                                    />
                                </div>
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="pl-10"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address'
                                            }
                                        })}
                                    />
                                </div>
                                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                            </div>

                            {/* Phone Field */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        className="pl-10"
                                        {...register('phone', {
                                            pattern: {
                                                value: /^[0-9+\-\s]{8,}$/,
                                                message: 'Invalid phone number'
                                            }
                                        })}
                                    />
                                </div>
                                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                            </div>

                            {/* Company Field */}
                            <div className="space-y-2">
                                <Label htmlFor="company">Company Name</Label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="company"
                                        placeholder="Enter your company name"
                                        className="pl-10"
                                        {...register('company')}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a password"
                                        className="pl-10 pr-10"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 8,
                                                message: 'Password must be at least 8 characters'
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                                message: 'Password must contain uppercase, lowercase, and number'
                                            }
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

                                {/* Password Strength Indicator */}
                                {password && password.length > 0 && (
                                    <div className="space-y-1">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-muted'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Password strength: <span className={strengthColors[passwordStrength - 1]}>{strengthLabels[passwordStrength - 1]}</span>
                                        </p>
                                    </div>
                                )}

                                {/* Password Requirements */}
                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <p className="flex items-center gap-2">
                                        <CheckCircle className={`w-3 h-3 ${password.length >= 8 ? 'text-green-500' : 'text-muted-foreground'}`} />
                                        At least 8 characters
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <CheckCircle className={`w-3 h-3 ${/[A-Z]/.test(password || '') ? 'text-green-500' : 'text-muted-foreground'}`} />
                                        One uppercase letter
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <CheckCircle className={`w-3 h-3 ${/[a-z]/.test(password || '') ? 'text-green-500' : 'text-muted-foreground'}`} />
                                        One lowercase letter
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <CheckCircle className={`w-3 h-3 ${/\d/.test(password || '') ? 'text-green-500' : 'text-muted-foreground'}`} />
                                        One number
                                    </p>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        className="pl-10 pr-10"
                                        {...register('confirmPassword', {
                                            required: 'Please confirm your password',
                                            validate: (value) => value === password || 'Passwords do not match'
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                            </div>

                            {/* Terms Agreement */}
                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="mt-1"
                                    {...register('agreedToTerms', { required: 'You must agree to the terms' })}
                                />
                                <Label htmlFor="terms" className="text-sm text-muted-foreground">
                                    I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and{' '}
                                    <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                                </Label>
                            </div>
                            {errors.agreedToTerms && <p className="text-sm text-red-500">{errors.agreedToTerms.message}</p>}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button
                            variant="link"
                            onClick={() => router.push('/login')}
                            className="text-sm text-muted-foreground"
                        >
                            Already have an account? Sign in
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
