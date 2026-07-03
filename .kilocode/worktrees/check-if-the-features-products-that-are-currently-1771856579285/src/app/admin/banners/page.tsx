"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
    Plus,
    Image as ImageIcon,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    Upload,
    X
} from 'lucide-react';

interface Banner {
    _id: string;
    title: string;
    subtitle?: string;
    image: string;
    link?: string;
    ctaText?: string;
    position: string;
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    createdAt: string;
}

export default function AdminBannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        image: '',
        link: '',
        ctaText: 'Shop Now',
        position: 'homepage',
        isActive: true,
        startDate: '',
        endDate: ''
    });

    const getHeaders = (): HeadersInit => {
        const token = localStorage.getItem('accessToken');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    };

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/banners', { headers: getHeaders() });
            if (!response.ok) throw new Error('Failed to load banners');
            const data = await response.json();
            setBanners(data);
        } catch (error) {
            console.error('Error loading banners:', error);
            toast.error('Failed to load banners');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingBanner
                ? `/api/admin/banners/${editingBanner._id}`
                : '/api/admin/banners';
            const method = editingBanner ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save banner');

            toast.success(editingBanner ? 'Banner updated successfully' : 'Banner created successfully');
            setShowModal(false);
            resetForm();
            loadBanners();
        } catch (error) {
            console.error('Error saving banner:', error);
            toast.error('Failed to save banner');
        }
    };

    const handleEdit = (banner: Banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title,
            subtitle: banner.subtitle || '',
            image: banner.image,
            link: banner.link || '',
            ctaText: banner.ctaText || 'Shop Now',
            position: banner.position,
            isActive: banner.isActive,
            startDate: banner.startDate || '',
            endDate: banner.endDate || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;

        try {
            const response = await fetch(`/api/admin/banners/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (!response.ok) throw new Error('Failed to delete banner');

            toast.success('Banner deleted successfully');
            loadBanners();
        } catch (error) {
            console.error('Error deleting banner:', error);
            toast.error('Failed to delete banner');
        }
    };

    const handleToggleActive = async (banner: Banner) => {
        try {
            const response = await fetch(`/api/admin/banners/${banner._id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({ isActive: !banner.isActive })
            });

            if (!response.ok) throw new Error('Failed to update banner');

            toast.success(banner.isActive ? 'Banner deactivated' : 'Banner activated');
            loadBanners();
        } catch (error) {
            console.error('Error toggling banner:', error);
            toast.error('Failed to update banner');
        }
    };

    const resetForm = () => {
        setEditingBanner(null);
        setFormData({
            title: '',
            subtitle: '',
            image: '',
            link: '',
            ctaText: 'Shop Now',
            position: 'homepage',
            isActive: true,
            startDate: '',
            endDate: ''
        });
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    return (
        <AdminLayout title="Banners" description="Manage website banners and hero images" onRefresh={loadBanners}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Banner Management</h2>
                        <p className="text-gray-400">Manage homepage banners and promotional images</p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Banner
                    </Button>
                </div>

                {/* Banner Grid */}
                {loading ? (
                    <div className="text-center py-12 text-gray-400">Loading banners...</div>
                ) : banners.length === 0 ? (
                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="py-12 text-center">
                            <ImageIcon className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                            <p className="text-gray-400 mb-4">No banners yet</p>
                            <Button onClick={openCreateModal} variant="outline" className="border-gray-600 text-gray-300">
                                <Plus className="h-4 w-4 mr-2" />
                                Create First Banner
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {banners.map((banner) => (
                            <Card key={banner._id} className="bg-gray-800 border-gray-700 overflow-hidden">
                                <div className="relative h-48 bg-gray-700">
                                    {banner.image ? (
                                        <img
                                            src={banner.image}
                                            alt={banner.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="h-12 w-12 text-gray-500" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            onClick={() => handleToggleActive(banner)}
                                            className={`p-2 rounded-lg ${banner.isActive
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : 'bg-gray-600 hover:bg-gray-700'
                                                }`}
                                        >
                                            {banner.isActive ? (
                                                <Eye className="h-4 w-4 text-white" />
                                            ) : (
                                                <EyeOff className="h-4 w-4 text-white" />
                                            )}
                                        </button>
                                    </div>
                                    {!banner.isActive && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="text-gray-400 font-medium">Inactive</span>
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-white mb-1">{banner.title}</h3>
                                    {banner.subtitle && (
                                        <p className="text-sm text-gray-400 mb-2">{banner.subtitle}</p>
                                    )}
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                        <span>Position: {banner.position}</span>
                                        <span>{banner.ctaText}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleEdit(banner)}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                                        >
                                            <Pencil className="h-3 w-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(banner._id)}
                                            variant="outline"
                                            size="sm"
                                            className="border-gray-600 text-gray-300 hover:bg-red-900 hover:text-red-400"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-white">
                                {editingBanner ? 'Edit Banner' : 'Create Banner'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="title" className="text-gray-300">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="subtitle" className="text-gray-300">Subtitle</Label>
                                    <Textarea
                                        id="subtitle"
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="image" className="text-gray-300">Image URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="image"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="bg-gray-700 border-gray-600 text-white flex-1"
                                            placeholder="https://..."
                                        />
                                        <Button type="button" variant="outline" className="border-gray-600 text-gray-300">
                                            <Upload className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {formData.image && (
                                        <div className="mt-2 relative h-32 w-full bg-gray-700 rounded-lg overflow-hidden">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ctaText" className="text-gray-300">CTA Button Text</Label>
                                    <Input
                                        id="ctaText"
                                        value={formData.ctaText}
                                        onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="link" className="text-gray-300">Link URL</Label>
                                    <Input
                                        id="link"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        placeholder="/products"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="position" className="text-gray-300">Position</Label>
                                    <select
                                        id="position"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 w-full"
                                    >
                                        <option value="homepage">Homepage Hero</option>
                                        <option value="homepage-secondary">Homepage Secondary</option>
                                        <option value="category">Category Page</option>
                                        <option value="promotional">Promotional</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Status</Label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="h-4 w-4 text-primary"
                                        />
                                        <Label htmlFor="isActive" className="text-gray-300">Active</Label>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="startDate" className="text-gray-300">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate" className="text-gray-300">End Date</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                    className="border-gray-600 text-gray-300"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-primary hover:bg-primary/90">
                                    {editingBanner ? 'Update Banner' : 'Create Banner'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
