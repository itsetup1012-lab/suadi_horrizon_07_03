"use client";

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Edit, Save, X, Search, FileText } from 'lucide-react';
import { getAllAdminNews, createNews, updateNews, deleteNews, NewsItem } from '@/api/news';
import { toast } from 'sonner';

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
            toast.error('Failed to fetch news articles');
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
        if (!confirm('Are you sure you want to delete this article?')) return;
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
        try {
            if (currentId) {
                await updateNews(currentId, formData);
                toast.success('Article updated');
            } else {
                await createNews(formData);
                toast.success('Article created');
            }
            fetchNews();
            resetForm();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save article');
        }
    };

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout
            title="Content Management"
            description="Manage news articles and blog posts"
            actions={
                <Button onClick={() => { resetForm(); setIsEditing(true); }} className="bg-gold hover:bg-gold/90 text-navy font-bold">
                    <Plus className="mr-2 h-4 w-4" /> Create Article
                </Button>
            }
        >

            {isEditing ? (
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>{currentId ? 'Edit Article' : 'Create New Article'}</CardTitle>
                        <CardDescription>Fill in the details for the news article.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (URL)</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="auto-generated-from-title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="author">Author</Label>
                                    <Input
                                        id="author"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Image URL</Label>
                                <Input
                                    id="image"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Excerpt / Short Description</Label>
                                <Textarea
                                    id="excerpt"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content (Markdown supported)</Label>
                                <Textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={10}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">You can use Markdown for formatting.</p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="published"
                                    checked={formData.isPublished}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                                />
                                <Label htmlFor="published">Publish immediately</Label>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Article</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>All Articles</CardTitle>
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button type="submit" size="icon" variant="ghost">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8">Loading articles...</div>
                        ) : filteredNews.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">No articles found. Create one to get started.</div>
                        ) : (
                            <div className="space-y-4">
                                {filteredNews.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="h-16 w-24 bg-muted rounded overflow-hidden flex-shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-secondary">
                                                        <FileText className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{item.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant={item.isPublished ? "default" : "secondary"}>
                                                        {item.isPublished ? "Published" : "Draft"}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">{item.category}</span>
                                                    <span className="text-xs text-muted-foreground">• {new Date(item.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item._id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </AdminLayout>
    );
}
