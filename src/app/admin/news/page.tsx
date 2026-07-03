"use client";

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Plus,
    Trash2,
    Edit,
    Save,
    X,
    Search,
    FileText,
    Eye,
    Clock,
    User as UserIcon,
    Newspaper,
    CheckCircle2,
    AlertCircle,
    LayoutGrid,
    MessageSquare,
    Send
} from 'lucide-react';
import { getAllAdminNews, createNews, updateNews, deleteNews, NewsItem } from '@/api/news';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminNewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        category: '',
        author: '',
        isPublished: false
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const data = await getAllAdminNews();
            setNews(data);
        } catch (error) {
            console.error('Failed to fetch news:', error);
            toast.error('Failed to load news');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            image: '',
            category: '',
            author: '',
            isPublished: false
        });
        setCurrentId(null);
        setIsEditing(false);
    };

    const handleEdit = (item: NewsItem) => {
        setFormData({
            title: item.title,
            slug: item.slug,
            excerpt: item.excerpt,
            content: item.content,
            image: item.image,
            category: item.category,
            author: item.author,
            isPublished: item.isPublished
        });
        setCurrentId(item._id);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;
        try {
            await deleteNews(id);
            setNews(prev => prev.filter(item => item._id !== id));
            toast.success('Article deleted');
        } catch (error) {
            toast.error('Failed to delete article');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading(currentId ? 'Updating article...' : 'Creating article...');
        try {
            if (currentId) {
                await updateNews(currentId, formData);
                toast.success('Article updated', { id: toastId });
            } else {
                await createNews(formData);
                toast.success('Article published', { id: toastId });
            }
            fetchNews();
            resetForm();
        } catch (error: any) {
            toast.error(error.message || 'Operation failed', { id: toastId });
        }
    };

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: news.length,
        published: news.filter(n => n.isPublished).length,
        drafts: news.filter(n => !n.isPublished).length,
        categories: Array.from(new Set(news.map(n => n.category))).length
    };

    return (
        <AdminLayout
            title="News Management"
            description="Create and manage news articles and store updates"
            onRefresh={fetchNews}
            actions={
                <Button
                    onClick={() => { resetForm(); setIsEditing(true); }}
                    className="bg-gold hover:bg-gold/90 text-navy font-bold rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.2)] tracking-widest uppercase text-xs"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add News
                </Button>
            }
        >
            <div className="relative z-10 space-y-10">
                {/* Statistics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Articles', value: stats.total, icon: Newspaper, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                        { label: 'Published', value: stats.published, icon: Send, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                        { label: 'Drafts', value: stats.drafts, icon: FileText, color: 'text-gold', bg: 'bg-gold/10' },
                        { label: 'Categories', value: stats.categories, icon: LayoutGrid, color: 'text-purple-400', bg: 'bg-purple-500/10' }
                    ].map((s, idx) => (
                        <div key={idx} className="glass-premium p-6 rounded-[2rem] border border-white/5 group hover:border-gold/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform`}>
                                    <s.icon className={`w-6 h-6 ${s.color}`} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{s.label}</p>
                                    <h3 className="text-2xl font-black text-white font-display">{s.value}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div
                            key="edit-view"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="glass-premium rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                                <div className="p-10 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">
                                            {currentId ? 'Edit Article' : 'Write News Article'}
                                        </h2>
                                        <p className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mt-1">Article Editor</p>
                                    </div>
                                    <Button variant="ghost" onClick={resetForm} className="text-white/40 hover:text-white rounded-full h-12 w-12 bg-white/5">
                                        <X className="w-6 h-6" />
                                    </Button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Article Title</Label>
                                            <Input
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="Enter news title..."
                                                className="glass border-white/10 h-14 rounded-2xl focus:border-gold/50"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">URL Slug</Label>
                                            <Input
                                                value={formData.slug}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                placeholder="news-article-slug"
                                                className="glass border-white/10 h-14 rounded-2xl focus:border-gold/50"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Category</Label>
                                            <Input
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                placeholder="e.g., Updates, Company News"
                                                className="glass border-white/10 h-14 rounded-2xl focus:border-gold/50"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Author Name</Label>
                                            <Input
                                                value={formData.author}
                                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                placeholder="Name"
                                                className="glass border-white/10 h-14 rounded-2xl focus:border-gold/50"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Featured Image URL</Label>
                                        <Input
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="https://assets.saudihorizon.com/..."
                                            className="glass border-white/10 h-14 rounded-2xl focus:border-gold/50"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Short Summary</Label>
                                        <Textarea
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                            placeholder="Brief overview of the article..."
                                            className="glass border-white/10 rounded-3xl min-h-[100px] focus:border-gold/50"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Article Content</Label>
                                        <Textarea
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            placeholder="Detailed news content..."
                                            className="glass border-white/10 rounded-3xl min-h-[250px] focus:border-gold/50"
                                            required
                                        />
                                        <div className="flex items-center gap-2 text-[9px] text-white/20 font-black uppercase ml-1">
                                            <AlertCircle className="w-3 h-3" />
                                            Markdown supported
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] group hover:border-gold/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${formData.isPublished ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gold/20 text-gold'}`}>
                                                {formData.isPublished ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-white uppercase tracking-widest">Article Status</p>
                                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                                                    {formData.isPublished ? 'Published' : 'Draft'}
                                                </p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={formData.isPublished}
                                            onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                                            className="data-[state=checked]:bg-gold"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-5 pt-6">
                                        <Button type="button" variant="ghost" onClick={resetForm} className="px-8 text-white/40 hover:text-white uppercase text-[10px] font-black tracking-widest">
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="px-10 bg-gold hover:bg-gold/90 text-navy font-black rounded-2xl h-14 shadow-xl tracking-[0.2em] uppercase text-xs">
                                            <Save className="mr-3 h-4 w-4" /> Save Article
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-10"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-6 px-4">
                                <div>
                                    <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">Article List</h3>
                                    <p className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mt-1">All Articles • {news.length}</p>
                                </div>
                                <div className="flex w-full max-w-md items-center relative group">
                                    <Search className="absolute left-6 w-4 h-4 text-white/20 group-hover:text-gold transition-colors" />
                                    <Input
                                        type="text"
                                        placeholder="SEARCH NEWS BY TITLE OR CATEGORY..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="glass border-white/10 pl-14 h-14 rounded-2xl focus:border-gold/50 uppercase text-[10px] font-black tracking-widest placeholder:text-white/10"
                                    />
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-40">
                                    <div className="w-16 h-16 border-4 border-gold/10 border-t-gold rounded-full animate-spin" />
                                </div>
                            ) : filteredNews.length === 0 ? (
                                <div className="glass-premium p-40 rounded-[4rem] border border-white/5 text-center">
                                    <AlertCircle className="w-16 h-16 text-white/10 mx-auto mb-6" />
                                    <h4 className="text-xl font-black text-white/40 uppercase tracking-widest">No articles found</h4>
                                    <p className="text-[10px] text-white/10 font-bold uppercase tracking-[0.3em] mt-2">Start by creating your first news article.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {filteredNews.map((item, idx) => (
                                        <motion.div
                                            key={item._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="glass-premium rounded-[3rem] border border-white/5 overflow-hidden group hover:border-gold/30 hover:scale-[1.01] transition-all flex flex-col h-full"
                                        >
                                            <div className="aspect-[21/9] overflow-hidden relative">
                                                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-80 z-10" />
                                                <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
                                                    <Badge className={`bg-navy/80 border-white/10 text-[9px] font-black uppercase px-3 py-1 backdrop-blur-md ${item.isPublished ? 'text-emerald-400' : 'text-gold'}`}>
                                                        {item.isPublished ? 'Published' : 'Draft'}
                                                    </Badge>
                                                    <Badge className="bg-navy/80 border-white/10 text-blue-400 text-[9px] font-black uppercase px-3 py-1 backdrop-blur-md">
                                                        {item.category}
                                                    </Badge>
                                                </div>
                                                {item.image ? (
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                                ) : (
                                                    <div className="w-full h-full bg-navy flex items-center justify-center">
                                                        <FileText className="w-12 h-12 text-white/10" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-8 flex-1 flex flex-col">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-black text-white font-display mb-3 group-hover:text-gold transition-colors">{item.title}</h3>
                                                    <p className="text-[11px] text-white/40 line-clamp-3 leading-relaxed mb-6 italic">"{item.excerpt}"</p>
                                                </div>

                                                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5">
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center gap-2">
                                                            <UserIcon className="w-3.5 h-3.5 text-gold" />
                                                            <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">{item.author}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-3.5 h-3.5 text-white/30" />
                                                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{new Date(item.date).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                                                            className="h-10 w-10 bg-white/5 hover:bg-gold/20 hover:text-gold rounded-xl transition-all"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                                                            className="h-10 w-10 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AdminLayout>
    );
}
