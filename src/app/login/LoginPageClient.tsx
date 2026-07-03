"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import type { ReadonlyURLSearchParams } from "next/navigation";

declare module "next/navigation" {
    interface ReadonlyURLSearchParams {
        get(name: string): string | null;
    }
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    LogIn,
    Chrome
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type LoginForm = {
    email: string
    password: string
};

export default function LoginPageClient() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams() as ReadonlyURLSearchParams;
    const { login, loginWithOAuth, authStrategy, authConfig, setAuthData, isAuthenticated, isInitialized } = useAuth();
    const { register, handleSubmit, formState } = useForm<LoginForm>();
    const exchangeInProgress = useRef(false);

    // Handle OAuth callback with authorization code
    useEffect(() => {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
            toast.error(`Authentication Failed: ${error}`);
            return;
        }

        if (code && !exchangeInProgress.current) {
            exchangeInProgress.current = true;
            const exchangeCode = async () => {
                try {
                    setLoading(true);
                    const redirectUri = `${window.location.origin}/login`;

                    // Extract provider from state if present (format: "provider:randomState")
                    let provider = 'default';
                    if (state && state.includes(':')) {
                        provider = state.split(':')[0];
                    }

                    const response = await fetch('/api/auth/oauth/exchange', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code, redirectUri, provider })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Token exchange failed');
                    }

                    const data = await response.json();
                    const { accessToken, refreshToken, ...userData } = data;

                    setAuthData(accessToken, refreshToken, userData);
                    toast.success("Logged in successfully");
                    window.location.href = "/";
                } catch (err: any) {
                    console.error('Failed to exchange code:', err);
                    toast.error(err.message || 'Authentication failed');
                    window.location.href = "/login";
                } finally {
                    setLoading(false);
                }
            };
            exchangeCode();
        }
    }, [searchParams, toast, setAuthData]);

    const onSubmit = async (data: LoginForm) => {
        try {
            setLoading(true);
            // Get redirect URL from query params or default to /account
            const redirect = searchParams.get('redirect') || '/account';
            await login(data.email, data.password);
            toast.success("Logged in successfully");
            window.location.href = redirect;
        } catch (error: any) {
            console.error("Login error:", error.message);
            toast.error(error?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (authStrategy === 'pythagora_oauth' && !code && !error && !isAuthenticated) {
            try {
                loginWithOAuth();
            } catch (error: any) {
                console.error("OAuth login error:", error.message);
                toast.error(error?.message || 'OAuth login failed');
            }
        }
    }, [authStrategy, searchParams, isAuthenticated, loginWithOAuth, toast]);

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            // Get redirect URL from query params or default to /account
            const redirect = searchParams.get('redirect') || '/account';
            window.location.href = redirect;
        }
    }, [isAuthenticated, isInitialized, searchParams]);

    if (authStrategy === null || (authStrategy === 'pythagora_oauth' && !isAuthenticated)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex items-center justify-center py-8">
                        <div className="text-muted-foreground">
                            {authStrategy === 'pythagora_oauth' ? 'Redirecting to Pythagora...' : 'Loading...'}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription>Enter your credentials to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {formState.errors.email && (
                                <p className="text-sm text-red-500">{formState.errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                {...register("password", { required: true })}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                "Loading..."
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Sign In
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Social Login Section */}
                    {(authStrategy === 'multi_oauth' || authStrategy === 'google_oauth') && authConfig?.oauth && (
                        <>
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {(authStrategy === 'google_oauth' || authConfig.oauth.google) && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full border-gray-300 hover:bg-gray-50 transition-all duration-200"
                                        onClick={() => {
                                            try {
                                                loginWithOAuth('google');
                                            } catch (error) {
                                                console.error("Google OAuth error:", error);
                                                toast.error("Google login is not configured");
                                            }
                                        }}
                                        disabled={loading}
                                    >
                                        <Chrome className="mr-2 h-4 w-4 text-red-500" />
                                        Continue with Google
                                    </Button>
                                )}

                                {authStrategy === 'multi_oauth' && authConfig.oauth.pythagora && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full border-gray-300 hover:bg-gray-50 transition-all duration-200"
                                        onClick={() => {
                                            try {
                                                loginWithOAuth('pythagora');
                                            } catch (error) {
                                                console.error("Pythagora OAuth error:", error);
                                                toast.error("Pythagora login is not configured");
                                            }
                                        }}
                                        disabled={loading}
                                    >
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Continue with Pythagora
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        variant="link"
                        className="text-sm text-muted-foreground"
                        onClick={() => window.location.href = "/register"}
                    >
                        Don't have an account? Sign up
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
