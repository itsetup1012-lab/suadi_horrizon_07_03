"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Filter,
    Plus,
    Eye,
    Shield,
    Mail,
    Calendar,
    X,
    Trash2,
    UserCheck,
    UserX
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
    _id: string;
    email: string;
    name?: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    lastLoginAt?: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [viewUser, setViewUser] = useState<User | null>(null);
    const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'user' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const getHeaders = (): HeadersInit => {
        const token = localStorage.getItem('accessToken');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    };

    const loadUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await fetch('/api/users', { headers });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || 'Failed to load users');
            }
            const data = await response.json();
            setUsers(data.users || []);
        } catch (err: any) {
            console.error('Failed to load users:', err);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const updateUserRole = async (userId: string, newRole: string) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({ role: newRole })
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || 'Failed to update user role');
            }

            toast.success('User role updated');
            loadUsers();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update user role');
        }
    };

    const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({ isActive: !currentStatus })
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || 'Failed to update user status');
            }

            toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
            loadUsers();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update user status');
        }
    };

    const deleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || 'Failed to delete user');
            }

            toast.success('User deleted');
            if (viewUser?._id === userId) setViewUser(null);
            loadUsers();
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete user');
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addForm.name || !addForm.email || !addForm.password) {
            toast.error('Please fill all required fields');
            return;
        }
        setSubmitting(true);
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(addForm)
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Failed to create user');
            }

            toast.success('User created successfully');
            setShowAddModal(false);
            setAddForm({ name: '', email: '', password: '', role: 'user' });
            loadUsers();
        } catch (err: any) {
            toast.error(err.message || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <AdminLayout
            title="Users"
            description="Manage user accounts"
            onRefresh={loadUsers}
        >
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300"
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            {roleFilter === 'all' ? 'Filter' : `Role: ${roleFilter}`}
                        </Button>
                        {showFilterDropdown && (
                            <div className="absolute top-full mt-1 right-0 z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden min-w-[150px]">
                                {['all', 'admin', 'manager', 'user', 'customer'].map(role => (
                                    <button
                                        key={role}
                                        onClick={() => { setRoleFilter(role); setShowFilterDropdown(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 ${roleFilter === role ? 'text-gold bg-gold/10' : 'text-white'}`}
                                    >
                                        {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <Button
                        className="bg-gold hover:bg-gold/90 text-navy font-bold"
                        onClick={() => setShowAddModal(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                </div>
            </div>

            {/* Users Table */}
            <div className="glass rounded-xl border border-white/10 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-400">Loading users...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">Joined</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">Last Login</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider font-display">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center mr-3 border border-gold/20">
                                                        <span className="text-gold font-bold font-display">
                                                            {user.email.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium group-hover:text-gold transition-colors font-display">
                                                            {user.name || 'No name'}
                                                        </p>
                                                        <p className="text-slate-400 text-sm">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => updateUserRole(user._id, e.target.value)}
                                                    className="bg-navy border border-white/10 text-white text-sm rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="customer">Customer</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge className={user.isActive ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-slate-400">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    <span className="text-sm">{formatDate(user.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-slate-400 text-sm">
                                                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-slate-400 hover:text-white hover:bg-white/10"
                                                        title="View details"
                                                        onClick={() => setViewUser(user)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className={user.isActive ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'}
                                                        title={user.isActive ? 'Deactivate user' : 'Activate user'}
                                                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                                                    >
                                                        {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                        title="Delete user"
                                                        onClick={() => deleteUser(user._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View User Modal */}
            {viewUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewUser(null)}>
                    <div className="bg-gray-900 border border-white/10 rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white font-display">User Details</h3>
                            <Button variant="ghost" size="icon" onClick={() => setViewUser(null)} className="text-slate-400 hover:text-white">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center border-2 border-gold/30">
                                    <span className="text-gold text-2xl font-bold font-display">{viewUser.email.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <p className="text-white font-bold text-lg">{viewUser.name || 'No name set'}</p>
                                    <p className="text-slate-400 text-sm">{viewUser.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-xs text-slate-500 uppercase mb-1">Role</p>
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-gold" />
                                        <span className="text-white capitalize font-medium">{viewUser.role}</span>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-xs text-slate-500 uppercase mb-1">Status</p>
                                    <Badge className={viewUser.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}>
                                        {viewUser.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-xs text-slate-500 uppercase mb-1">Joined</p>
                                    <span className="text-white text-sm">{formatDate(viewUser.createdAt)}</span>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-xs text-slate-500 uppercase mb-1">Last Login</p>
                                    <span className="text-white text-sm">{viewUser.lastLoginAt ? formatDate(viewUser.lastLoginAt) : 'Never'}</span>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-xs text-slate-500 uppercase mb-1">User ID</p>
                                <code className="text-gold text-xs font-mono">{viewUser._id}</code>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
                    <div className="bg-gray-900 border border-white/10 rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white font-display">Add New User</h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-300">Full Name *</Label>
                                <Input
                                    value={addForm.name}
                                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Email *</Label>
                                <Input
                                    type="email"
                                    value={addForm.email}
                                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    placeholder="user@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Password *</Label>
                                <Input
                                    type="password"
                                    value={addForm.password}
                                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    placeholder="Minimum 6 characters"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-300">Role</Label>
                                <select
                                    value={addForm.role}
                                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="customer">Customer</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="border-gray-700 text-gray-300">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={submitting} className="bg-gold hover:bg-gold/90 text-navy font-bold">
                                    {submitting ? 'Creating...' : 'Create User'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
