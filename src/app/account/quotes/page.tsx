'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    ChevronRight,
    ArrowLeft,
    Clock,
    CheckCircle2,
    XCircle,
    Building2,
    MessageSquare,
    Loader2,
    Calendar,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function MyQuotesPage() {
    const router = useRouter();
    const { isAuthenticated, isInitialized } = useAuth();
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push('/login?redirect=/account/quotes');
            return;
        }

        if (isAuthenticated) {
            fetchQuotes();
        }
    }, [isAuthenticated, isInitialized]);

    const fetchQuotes = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch('/api/user/quotes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setQuotes(data.quotes || []);
            }
        } catch (error) {
            toast.error("Failed to fetch your quotes");
        } finally {
            setLoading(false);
        }
    };

    const [replyText, setReplyText] = useState<Record<string, string>>({});

    const handleSendMessage = async (quoteId: string) => {
        const text = replyText[quoteId]?.trim();
        if (!text) return;

        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch('/api/user/quotes/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quoteId, text })
            });

            if (res.ok) {
                setReplyText(prev => ({ ...prev, [quoteId]: "" }));
                fetchQuotes();
            }
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    const handleAcceptQuote = async (quoteId: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch('/api/user/quotes/accept', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quoteId })
            });

            if (res.ok) {
                toast.success("Quote accepted! Preparing your order...");
                fetchQuotes();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to accept quote");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleDeclineQuote = async (quoteId: string) => {
        if (!confirm("Are you sure you want to decline this quote?")) return;
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch('/api/user/quotes/accept', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quoteId })
            });

            if (res.ok) {
                toast.success("Quote declined");
                fetchQuotes();
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'reviewed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'responded': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'accepted': return 'bg-gold/10 text-gold border-gold/20';
            case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const filteredQuotes = quotes.filter(q =>
        q.items.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isInitialized || !isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-navy text-white py-12 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/account')}
                    className="mb-8 text-slate-400 hover:text-gold hover:bg-white/5 -ml-2"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Account
                </Button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight text-white font-display">My Quote Requests</h1>
                        <p className="text-slate-400">Track and manage your bulk product inquiries</p>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            placeholder="Search requests..."
                            className="pl-11 bg-white/5 border-white/10 rounded-2xl h-12 text-sm focus:ring-gold/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6 mb-8 px-2 overflow-x-auto no-scrollbar">
                    {['all', 'pending', 'responded', 'accepted'].map(f => (
                        <button
                            key={f}
                            className={`text-[10px] whitespace-nowrap font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${(f === 'all' && !searchTerm) ? 'text-gold border-gold' : 'text-slate-500 border-transparent hover:text-slate-300'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-4 opacity-30">
                        <Loader2 className="w-10 h-10 animate-spin text-gold" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Syncing Quotes...</p>
                    </div>
                ) : filteredQuotes.length === 0 ? (
                    <Card className="bg-white/5 border-white/10 rounded-[2.5rem] p-16 text-center">
                        <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gold">
                            <FileText className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">No quotes found</h2>
                        <p className="text-slate-400 mb-8 max-w-sm mx-auto">You haven't submitted any bulk quote requests yet.</p>
                        <Button
                            onClick={() => router.push('/bulk-quote')}
                            className="bg-gold hover:bg-gold/90 text-navy font-black uppercase text-[10px] tracking-widest px-8 h-12 rounded-2xl"
                        >
                            Request a Quote
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {filteredQuotes.map((quote, idx) => (
                            <motion.div
                                key={quote._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden group hover:border-gold/30 transition-all shadow-2xl">
                                    <div className="p-8">
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                            <div className="space-y-4 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <Badge className={`${getStatusStyle(quote.status)} px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest`}>
                                                        {quote.status}
                                                    </Badge>
                                                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(quote.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">{quote.companyName}</h3>
                                                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{quote.items}</p>
                                                </div>

                                                {quote.status === 'responded' && quote.quotedPrice && (
                                                    <div className="mt-6 flex flex-wrap gap-4">
                                                        <div className="bg-gold/10 border border-gold/20 p-4 rounded-2xl flex-1 min-w-[200px]">
                                                            <p className="text-[9px] font-black uppercase text-gold tracking-widest mb-1">Quoted Price</p>
                                                            <p className="text-2xl font-bold text-white">{quote.quotedPrice.toLocaleString()} <span className="text-sm font-normal text-slate-400">SAR</span></p>
                                                        </div>
                                                        {quote.validUntil && (
                                                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex-1 min-w-[200px]">
                                                                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Valid Until</p>
                                                                <p className="text-sm font-bold text-slate-200">
                                                                    {new Date(quote.validUntil).toLocaleDateString()}
                                                                    {new Date(quote.validUntil) < new Date() && (
                                                                        <span className="ml-2 text-red-500 text-[10px] uppercase font-black">Expired</span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {quote.messages && quote.messages.length > 0 && (
                                                    <div className="mt-8 space-y-4">
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gold/40 border-b border-white/5 pb-2">Conversation History</h4>
                                                        <div className="space-y-3 max-h-[300px] overflow-y-auto px-2 custom-scrollbar">
                                                            {quote.messages.map((msg: any, mIdx: number) => (
                                                                <div
                                                                    key={mIdx}
                                                                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                                                >
                                                                    <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user'
                                                                        ? 'bg-gold/10 border border-gold/20 text-gold rounded-tr-none'
                                                                        : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'
                                                                        }`}>
                                                                        <p>{msg.text}</p>
                                                                        <span className="text-[8px] opacity-40 mt-2 block font-medium uppercase tracking-tighter">
                                                                            {new Date(msg.createdAt).toLocaleString()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Reply Input */}
                                                        {quote.status !== 'cancelled' && quote.status !== 'accepted' && (
                                                            <div className="flex gap-2 mt-4 bg-white/5 p-2 rounded-2xl border border-white/10">
                                                                <Input
                                                                    placeholder="Type your message..."
                                                                    className="bg-transparent border-none focus:ring-0 text-xs h-10 px-4"
                                                                    value={replyText[quote._id] || ""}
                                                                    onChange={(e) => setReplyText(prev => ({ ...prev, [quote._id]: e.target.value }))}
                                                                />
                                                                <Button
                                                                    size="icon"
                                                                    className="bg-gold text-navy rounded-xl h-10 w-10 shrink-0 shadow-lg shadow-gold/10"
                                                                    onClick={() => handleSendMessage(quote._id)}
                                                                >
                                                                    <ChevronRight className="w-5 h-5" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {quote.status === 'responded' && (
                                                    <div className="mt-8 flex gap-3">
                                                        <Button
                                                            className="flex-1 bg-gold hover:bg-gold/90 text-navy font-black uppercase text-xs tracking-widest h-14 rounded-2xl shadow-lg shadow-gold/10"
                                                            onClick={() => handleAcceptQuote(quote._id)}
                                                            disabled={quote.validUntil && new Date(quote.validUntil) < new Date()}
                                                        >
                                                            Accept & Place Order
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5 h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                                                            onClick={() => handleDeclineQuote(quote._id)}
                                                        >
                                                            Decline
                                                        </Button>
                                                    </div>
                                                )}

                                                {quote.status === 'accepted' && (
                                                    <div className="mt-6 flex items-center gap-3 text-gold">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                        <span className="text-sm font-bold">Quote Accepted — Our logistics team will contact you.</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-end gap-4 min-w-[120px]">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest mb-1">Request ID</p>
                                                    <p className="text-[10px] font-mono text-slate-400">#{quote._id.slice(-8).toUpperCase()}</p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="border-white/10 text-white hover:bg-white/5 rounded-xl h-10 px-4 text-xs font-bold"
                                                    onClick={() => router.push(`/bulk-quote`)}
                                                >
                                                    New Request
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center space-y-4">
                    <p className="text-xs text-slate-500 font-medium">Have questions about your quote?</p>
                    <div className="flex items-center justify-center gap-6">
                        <button className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-white transition-colors">Contact Support</button>
                        <div className="w-1 h-1 rounded-full bg-slate-800" />
                        <button className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-white transition-colors">Bulk Guidelines</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
