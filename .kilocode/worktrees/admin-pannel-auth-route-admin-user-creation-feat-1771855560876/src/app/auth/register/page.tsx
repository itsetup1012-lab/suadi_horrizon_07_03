import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

// Form schema using Zod for validation
const registerSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
});

// Custom validation to check if passwords match
type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const { register, login } = useAuth();
    const [loading, setLoading] = useState(false);

    const {
        register: registerForm,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        criteriaMode: 'all',
    });

    const onSubmit = async (data: RegisterForm) => {
        if (data.password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Passwords do not match',
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success('Registration successful! Please log in.');
                router.push('/login');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>
                        Join our platform to access exclusive features
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                        <div>
                            <Label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                                Email
                            </Label>
                            <Input
                                id='email'
                                type='email'
                                placeholder='Enter your email'
                                {...registerForm('email')}
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && (
                                <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                                Password
                            </Label>
                            <Input
                                id='password'
                                type='password'
                                placeholder='Enter your password'
                                {...registerForm('password')}
                                className={errors.password ? 'border-red-500' : ''}
                            />
                            {errors.password && (
                                <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
                                Confirm Password
                            </Label>
                            <Input
                                id='confirmPassword'
                                type='password'
                                placeholder='Confirm your password'
                                {...registerForm('confirmPassword')}
                                className={errors.confirmPassword ? 'border-red-500' : ''}
                            />
                            {errors.confirmPassword && (
                                <p className='mt-1 text-sm text-red-600'>{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button
                            type='submit'
                            className='w-full bg-blue-600 hover:bg-blue-700'
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Create Account'}
                        </Button>
                    </form>

                    <div className='mt-6 text-center text-sm text-gray-600'>
                        Already have an account? '
                        <button
                            onClick={() => router.push('/login')}
                            className='font-medium text-blue-600 hover:text-blue-500'
                        >
                            Log in
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

// Form schema using Zod for validation
const registerSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
});

// Custom validation to check if passwords match
type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const { register, login } = useAuth();
    const [loading, setLoading] = useState(false);

    const {
        register: registerForm,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        criteriaMode: 'all',
    });

    const onSubmit = async (data: RegisterForm) => {
        if (data.password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Passwords do not match',
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success('Registration successful! Please log in.');
                router.push('/login');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>
                        Join our platform to access exclusive features
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                        <div>
                            <Label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                                Email
                            </Label>
                            <Input
                                id='email'
                                type='email'
                                placeholder='Enter your email'
                                {...registerForm('email')}
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && (
                                <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                                Password
                            </Label>
                            <Input
                                id='password'
                                type='password'
                                placeholder='Enter your password'
                                {...registerForm('password')}
                                className={errors.password ? 'border-red-500' : ''}
                            />
                            {errors.password && (
                                <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
                                Confirm Password
                            </Label>
                            <Input
                                id='confirmPassword'
                                type='password'
                                placeholder='Confirm your password'
                                {...registerForm('confirmPassword')}
                                className={errors.confirmPassword ? 'border-red-500' : ''}
                            />
                            {errors.confirmPassword && (
                                <p className='mt-1 text-sm text-red-600'>{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button
                            type='submit'
                            className='w-full bg-blue-600 hover:bg-blue-700'
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Create Account'}
                        </Button>
                    </form>

                    <div className='mt-6 text-center text-sm text-gray-600'>
                        Already have an account? '
                        <button
                            onClick={() => router.push('/login')}
                            className='font-medium text-blue-600 hover:text-blue-500'
                        >
                            Log in
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
