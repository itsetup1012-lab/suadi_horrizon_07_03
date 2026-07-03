"use client";

import { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Filter,
    Download,
    Eye,
    X,
    Upload,
    Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
    _id: string;
    name: string;
    sku: string;
    price: number;
    category?: string;
    stock: number;
    image?: string;
    isActive: boolean;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    // Product form state
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: 0,
        category: '',
        stock: 0,
        description: '',
        image: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await fetch('/api/products?limit=1000', { headers });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || 'Failed to load products');
            }
            const data = await response.json();
            setProducts(data.products || []);
        } catch (err: any) {
            console.error('Failed to load products:', err);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = localStorage.getItem('accessToken');
            const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
                headers,
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            toast.success('Product deleted successfully');
            loadProducts();
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete product');
        }
    };

    const openAddForm = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            sku: '',
            price: 0,
            category: '',
            stock: 0,
            description: '',
            image: '',
        });
        setShowProductForm(true);
    };

    const openEditForm = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            sku: product.sku || '',
            price: product.price || 0,
            category: product.category || '',
            stock: product.stock || 0,
            description: '',
            image: product.image || '',
        });
        setShowProductForm(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create a preview URL
        const previewUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, image: previewUrl }));

        // Upload to server
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });

            if (response.ok) {
                const data = await response.json();
                setFormData(prev => ({ ...prev, image: data.url || previewUrl }));
                toast.success('Image uploaded successfully');
            } else {
                // Keep the preview URL if upload fails
                setFormData(prev => ({ ...prev, image: previewUrl }));
                toast.success('Image preview set (upload endpoint not configured)');
            }
        } catch (err) {
            // Keep the preview URL
            setFormData(prev => ({ ...prev, image: previewUrl }));
            toast.success('Image preview set');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('accessToken');
            const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
            headers['Content-Type'] = 'application/json';

            const url = editingProduct
                ? `/api/products/${editingProduct._id}`
                : '/api/products';
            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify({
                    ...formData,
                    isActive: true,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save product');
            }

            toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
            setShowProductForm(false);
            loadProducts();
        } catch (err: any) {
            toast.error(err.message || 'Failed to save product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    return (
        <AdminLayout
            title="Products"
            description="Manage your product catalog"
            onRefresh={loadProducts}
            onExport={() => {
                const csv = [
                    ['Name', 'SKU', 'Price', 'Category', 'Stock', 'Status'].join(','),
                    ...filteredProducts.map(p => [p.name, p.sku, p.price, p.category, p.stock, p.isActive ? 'Active' : 'Inactive'].join(','))
                ].join('\n');

                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'products.csv';
                a.click();
                toast.success('Products exported successfully');
            }}
        >
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-gray-700 text-gray-300">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90" onClick={openAddForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </div>
            </div>

            {/* Products Table */}
            <div className="glass rounded-xl border border-white/10 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-400">Loading products...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">
                                        Product
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">
                                        SKU
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">
                                        Price
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">
                                        Category
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">
                                        Stock
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider font-display">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider font-display">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {paginatedProducts.length > 0 ? (
                                    paginatedProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {product.image && (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="h-10 w-10 rounded-lg object-cover mr-3 border border-white/10"
                                                        />
                                                    )}
                                                    <span className="text-white font-medium group-hover:text-gold transition-colors font-display">
                                                        {product.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-slate-400">{product.sku}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-white font-display">
                                                    ${product.price?.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant="secondary" className="glass border-white/10 text-slate-300">
                                                    {product.category || 'Uncategorized'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`${product.stock < 10 ? 'text-red-400' : 'text-white'} font-mono`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge className={product.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}>
                                                    {product.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10" onClick={() => openEditForm(product)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                        onClick={() => handleDelete(product._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                            No products found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-400">
                        Showing {((currentPage - 1) * productsPerPage) + 1} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="border-gray-700 text-gray-300"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="border-gray-700 text-gray-300"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Product Form Dialog */}
            {showProductForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowProductForm(false)}
                    />

                    {/* Dialog */}
                    <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-white/10 rounded-2xl shadow-2xl">
                        {/* Header */}
                        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-gray-900">
                            <h2 className="text-xl font-bold text-white font-display">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowProductForm(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Product Image</label>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-24 h-24 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden bg-gray-800">
                                        {formData.image ? (
                                            <img
                                                src={formData.image}
                                                alt="Product"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-gray-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload Image
                                        </Button>
                                        <p className="mt-2 text-xs text-gray-500">
                                            Supports JPG, PNG, WebP. Max 5MB.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Name & SKU */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Product Name *</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter product name"
                                        required
                                        className="bg-gray-800 border-gray-700 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">SKU *</label>
                                    <Input
                                        value={formData.sku}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                                        placeholder="Enter SKU"
                                        required
                                        className="bg-gray-800 border-gray-700 text-white"
                                    />
                                </div>
                            </div>

                            {/* Price & Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Price ($) *</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                        placeholder="0.00"
                                        required
                                        className="bg-gray-800 border-gray-700 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Stock *</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                                        placeholder="0"
                                        required
                                        className="bg-gray-800 border-gray-700 text-white"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Category *</label>
                                <Input
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    placeholder="e.g., Engine, Hydraulics, Transmission"
                                    required
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter product description..."
                                    rows={4}
                                    className="bg-gray-800 border-gray-700 text-white resize-none"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowProductForm(false)}
                                    className="border-gray-700 text-gray-300"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Saving...
                                        </>
                                    ) : editingProduct ? 'Update Product' : 'Create Product'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
