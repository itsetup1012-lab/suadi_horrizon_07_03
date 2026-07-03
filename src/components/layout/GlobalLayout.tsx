'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface GlobalLayoutProps {
    children: ReactNode;
    title: string;
    showSidebar?: boolean;
    isAdmin?: boolean;
}

export default function GlobalLayout({
    children,
    title,
    showSidebar = false,
    isAdmin = false,
}: GlobalLayoutProps) {
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/login');
    };

    const adminSidebar = [
        { name: 'Dashboard', href: '/admin', icon: '📊' },
        { name: 'Products', href: '/admin/products', icon: '📦' },
        { name: 'Orders', href: '/admin/orders', icon: '📋' },
        { name: 'Users', href: '/admin/users', icon: '👥' },
        { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
        { name: 'Banners', href: '/admin/banners', icon: '🎯' },
        { name: 'Inventory', href: '/admin/inventory', icon: '🏭' },
        { name: 'Shipping', href: '/admin/shipping', icon: '🚚' },
        { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link href="/" className="text-xl font-bold text-gray-900">
                                Saudi Fresh
                            </Link>
                            <span className="ml-2 text-sm text-gray-500">| {title}</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLogout}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                {showSidebar && isAdmin && (
                    <aside className="w-64 bg-white shadow-sm border-r min-h-screen">
                        <nav className="mt-5 px-2">
                            <div className="space-y-1">
                                {adminSidebar.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </nav>
                    </aside>
                )}

                {/* Main Content */}
                <main className={`flex-1 ${showSidebar ? 'ml-0' : ''}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}