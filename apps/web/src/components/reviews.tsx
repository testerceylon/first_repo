"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getClient } from "@/lib/rpc/client";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Review {
    id: string;
    userName: string | null;
    content: string;
    rating: number;
    createdAt: string;
}

export function ReviewsSection() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const client = await getClient();
            const res = await client.api.reviews.$get();

            if (res.ok) {
                const data = await res.json();
                setReviews(data as any);
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <section className="py-20 bg-background relative overflow-hidden">
            <div className="container relative px-4 mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">What Our Users Say</h2>
                    <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                        Trusted reviews from our community of creators and developers.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-40 bg-muted/20 animate-pulse rounded-2xl border border-border" />
                            ))
                        ) : reviews.length > 0 ? (
                            reviews.map((review, idx) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-card border border-border/50 p-5 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200"
                                >
                                    <div className="flex items-center gap-0.5 mb-2.5 text-amber-500">
                                        {Array(5).fill(0).map((_, i) => (
                                            <Star key={i} className={cn("size-4", i < review.rating ? "fill-current" : "text-muted/20")} />
                                        ))}
                                    </div>
                                    <p className="text-[15px] font-medium text-foreground/90 leading-relaxed mb-4 line-clamp-4 tracking-tight">
                                        &ldquo;{review.content}&rdquo;
                                    </p>
                                    <div className="flex items-center gap-2.5">
                                        <div className="size-9 rounded-full bg-linear-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center text-violet-600 font-bold text-sm border border-violet-100 dark:border-violet-900/30">
                                            {review.userName?.[0]?.toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">{review.userName || "Verified User"}</h4>
                                            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                                                {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                            ))
                        ) : (
                            <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
                                No reviews yet.
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

export function ReviewForm() {
    const { data: session } = authClient.useSession();
    const [submitting, setSubmitting] = useState(false);
    const [newReview, setNewReview] = useState({ content: "", rating: 5 });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;
        setSubmitting(true);
        try {
            const client = await getClient();
            const res = await client.api.reviews.$post({
                json: newReview,
            });

            if (res.ok) {
                toast.success("Review submitted! It will appear after admin approval.");
                setSubmitted(true);
                setNewReview({ content: "", rating: 5 });
            } else {
                toast.error("Failed to submit review");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    if (!session) return null;

    return (
        <div className="max-w-md mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-card border border-border/60 p-5 rounded-2xl shadow-xs"
            >

                {submitted ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-4"
                    >
                        <div className="size-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="size-6 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-1">Thank you!</h3>
                        <p className="text-sm text-muted-foreground mb-6">Your review is awaiting approval.</p>
                        <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setSubmitted(false)}>Submit another</Button>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="size-4 text-violet-500" />
                                <h3 className="text-base font-bold tracking-tight">Leave a Review</h3>
                            </div>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setNewReview({ ...newReview, rating: s })}
                                        className={cn(
                                            "p-0.5 transition-all outline-none",
                                            s <= newReview.rating ? "text-amber-500" : "text-muted/20 hover:text-amber-300"
                                        )}
                                    >
                                        <Star className={cn("size-5", s <= newReview.rating ? "fill-current" : "")} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <textarea
                                placeholder="Tell us what you think..."
                                value={newReview.content}
                                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                                required
                                className="w-full min-h-[90px] p-4 rounded-xl bg-muted/30 border border-border focus:border-violet-500/30 focus:ring-4 focus:ring-violet-500/5 transition-all outline-none text-[15px] resize-none"
                            />
                        </div>


                        <Button
                            disabled={submitting}
                            className="w-full h-11 bg-linear-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white rounded-xl shadow-sm text-sm font-bold transition-all"
                        >
                            {submitting ? (
                                <Loader2 className="size-4 mr-2 animate-spin" />
                            ) : (
                                "Submit Review"
                            )}
                        </Button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
