'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, User, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

type Review = {
    id: string;
    author: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    helpful: number;
    verified: boolean;
};

const mockReviews: Review[] = [
    {
        id: '1',
        author: 'Ahmed K.',
        rating: 5,
        title: 'Excellent quality product',
        content: 'Perfect fit for my CAT equipment. Fast shipping and well packaged. Would definitely recommend to other contractors.',
        date: '2024-01-15',
        helpful: 24,
        verified: true,
    },
    {
        id: '2',
        author: 'Mohammed A.',
        rating: 4,
        title: 'Good value for money',
        content: 'Good quality filter at a reasonable price. Delivery was a bit delayed but overall satisfied with the purchase.',
        date: '2024-01-10',
        helpful: 12,
        verified: true,
    },
    {
        id: '3',
        author: 'Saad B.',
        rating: 5,
        title: 'Perfect replacement part',
        content: 'Found exactly what I needed for my machinery. Original equipment quality at aftermarket price. Very happy!',
        date: '2024-01-05',
        helpful: 8,
        verified: true,
    },
];

interface ProductReviewsProps {
    productId: string;
    productName: string;
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
    const [reviews, setReviews] = React.useState(mockReviews);
    const [showForm, setShowForm] = React.useState(false);
    const [newReview, setNewReview] = React.useState({ rating: 5, title: '', content: '' });
    const [hoveredRating, setHoveredRating] = React.useState(0);

    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const ratingCounts = [5, 4, 3, 2, 1].map(star =>
        reviews.filter(r => r.rating === star).length
    );

    const submitReview = () => {
        if (!newReview.title.trim() || !newReview.content.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        const review: Review = {
            id: Date.now().toString(),
            author: 'You',
            rating: newReview.rating,
            title: newReview.title,
            content: newReview.content,
            date: new Date().toISOString().split('T')[0],
            helpful: 0,
            verified: false,
        };

        setReviews([review, ...reviews]);
        setShowForm(false);
        setNewReview({ rating: 5, title: '', content: '' });
        toast.success('Review submitted successfully!');
    };

    const helpful = (id: string) => {
        setReviews(reviews.map(r =>
            r.id === id ? { ...r, helpful: r.helpful + 1 } : r
        ));
        toast.success('Thanks for your feedback!');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>

            {/* Rating Summary */}
            <Card className="glass-light dark:glass-dark">
                <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Average Rating */}
                        <div className="text-center">
                            <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                            <div className="flex justify-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-muted-foreground">{reviews.length} reviews</p>
                        </div>

                        {/* Rating Breakdown */}
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((star, index) => (
                                <div key={star} className="flex items-center gap-2">
                                    <span className="text-sm w-8">{star} star</span>
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-500 rounded-full"
                                            style={{ width: `${(ratingCounts[index] / reviews.length) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-muted-foreground w-8">{ratingCounts[index]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Write Review Button */}
            <div className="flex justify-end">
                <Button onClick={() => setShowForm(!showForm)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {showForm ? 'Cancel' : 'Write a Review'}
                </Button>
            </div>

            {/* Review Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                >
                    <Card className="glass-light dark:glass-dark">
                        <CardHeader>
                            <CardTitle>Write Your Review</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Rating Selection */}
                            <div className="space-y-2">
                                <Label>Your Rating</Label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            className="p-1"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= (hoveredRating || newReview.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="review-title">Review Title</Label>
                                <input
                                    id="review-title"
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                    placeholder="Summarize your experience"
                                    value={newReview.title}
                                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="review-content">Your Review</Label>
                                <Textarea
                                    id="review-content"
                                    placeholder="Share your experience with this product..."
                                    value={newReview.content}
                                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                                    rows={4}
                                />
                            </div>

                            <Button onClick={submitReview}>Submit Review</Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review, index) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="glass-light dark:glass-dark">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Avatar>
                                        <AvatarFallback>
                                            <User className="w-4 h-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold">{review.author}</span>
                                            {review.verified && (
                                                <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-500 rounded-full">
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-muted-foreground">{review.date}</span>
                                        </div>
                                        <h4 className="font-medium mb-1">{review.title}</h4>
                                        <p className="text-muted-foreground mb-4">{review.content}</p>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => helpful(review.id)}
                                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                                            >
                                                <ThumbsUp className="w-4 h-4" />
                                                Helpful ({review.helpful})
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
