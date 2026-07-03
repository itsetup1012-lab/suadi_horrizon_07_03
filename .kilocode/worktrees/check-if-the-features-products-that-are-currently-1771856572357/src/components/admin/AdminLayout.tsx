"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    Menu,
    X,
    Bell,
    Search,
    Download,
    RefreshCw,
    Truck,
    LogOut,
    User,
    BarChart3,
    Box,
    Cookie,
    Image,
    FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    onRefresh?: () => void;
    onExport?: () => void;
    actions?: React.ReactNode;
}

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Cookie Consent', href: '/admin/cookie-consent', icon: Cookie },
    { name: 'Banners', href: '/admin/banners', icon: Image },
    { name: 'News', href: '/admin/news', icon: FileText },
    { name: 'Inventory', href: '/admin/inventory', icon: Box },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Shipping', href: '/admin/shipping', icon: Truck },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout({ children, title, description, onRefresh, onExport, actions }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    // Update current navigation based on pathname
    const currentNav = navigation.map(item => ({
        ...item,
        current: item.href === pathname || (item.href !== '/admin' && pathname.startsWith(item.href))
    }));

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="flex h-screen bg-navy text-white overflow-hidden">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden" onClick={() => setSidebarOpen(false)}>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </div>
            )}

            {/* Mobile sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-y-0 left-0 w-64 bg-navy/95 backdrop-blur-xl border-r border-white/10 flex flex-col">
                    <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
                        <div className="flex items-center space-x-3 w-full">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                <LayoutDashboard className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-lg font-bold text-white break-words leading-tight">Admin Panel</span>
                                <p className="text-xs text-gray-400 break-words leading-tight">Management</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-400 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
                        {currentNav.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${item.current
                                    ? 'bg-gold/10 text-gold border border-gold/20 shadow-[0_0_15px_rgba(255,215,0,0.1)]'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${item.current ? 'text-gold' : 'text-slate-500'}`} />
                                <span className="break-words leading-tight">{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-gray-700 text-white">
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.email || 'admin@example.com'}</p>
                                <p className="text-xs text-gray-400">Administrator</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-white"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-navy border-r border-white/10 flex-shrink-0 z-20 relative">
                {/* Gold Glow Effect Behind Sidebar */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gold/5 blur-[100px] pointer-events-none" />

                <div className="flex flex-col flex-grow overflow-y-auto relative z-10">
                    <div className="flex items-center h-16 px-6 border-b border-white/10 flex-shrink-0">
                        <div className="flex items-center space-x-3 w-full">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                <LayoutDashboard className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-lg font-bold text-white break-words leading-tight">Admin Panel</span>
                                <p className="text-xs text-gray-400 break-words leading-tight">Management System</p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
                        {currentNav.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group ${item.current
                                    ? 'bg-gradient-to-r from-gold/20 to-gold/5 text-gold border border-gold/20 shadow-[0_0_20px_rgba(197,160,89,0.15)] translate-x-1'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                                    }`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${item.current ? 'text-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]' : 'text-slate-500 group-hover:text-white'}`} />
                                <span className={`break-words leading-tight ${item.current ? 'font-bold' : ''}`}>{item.name}</span>
                                {item.current && (
                                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_#C5A059]" />
                                )}
                            </Link>
                        ))}
                    </nav>
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-9 w-9 border border-white/10">
                                <AvatarFallback className="bg-white/5 text-white">
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.email || 'admin@example.com'}</p>
                                <p className="text-xs text-slate-400">Administrator</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="text-slate-400 hover:text-white hover:bg-white/5"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-40 bg-navy/80 backdrop-blur-md border-b border-white/10">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden mr-2 text-gray-300 hover:text-white"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-white">{title || 'Dashboard'}</h1>
                                {description && (
                                    <p className="text-sm text-gray-400 mt-0.5">{description}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="hidden md:block">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search..."
                                        className="pl-10 w-64 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-gold/50 focus:ring-gold/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                                {onExport && (
                                    <Button variant="outline" size="sm" onClick={onExport} className="border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-primary">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                    </Button>
                                )}

                                {onRefresh && (
                                    <Button variant="outline" size="sm" onClick={onRefresh} className="glass border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-gold/30">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Refresh
                                    </Button>
                                )}

                                {actions}

                                {/* Notifications */}
                                <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-white">
                                    <Bell className="h-5 w-5" />
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-gold text-navy font-bold border-0">
                                        3
                                    </Badge>
                                </Button>

                                <div className="hidden lg:flex flex-col items-end border-l border-white/10 pl-4 ml-4">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Node Sync</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] text-white font-mono">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden bg-navy relative w-full">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />
                    <div className="py-6 relative z-10">
                        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div >
    );
}
