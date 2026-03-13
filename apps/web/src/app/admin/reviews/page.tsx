"use client";

import { useEffect, useState } from "react";
import { getClient } from "@/lib/rpc/client";
import { toast } from "sonner";
import { Check, X, Star, Clock, Mail, MessageSquareOff, MoreVertical, Filter, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


interface AdminReview {
    id: string;
    userName: string | null;
    userEmail: string;
    content: string;
    rating: number;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

    const fetchReviews = async () => {
        try {
            const client = await getClient();
            // @ts-expect-error - Type inference issue with nested admin routes
            const res = await client.api.admin.reviews.$get();

            if (res.ok) {
                const data = await res.json();
                setReviews(data as any);
            } else {
                toast.error("Failed to fetch reviews");
            }
        } catch (error) {
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
        try {
            const client = await getClient();
            // @ts-expect-error - Type inference issue with nested admin routes
            const res = await client.api.admin.reviews[":id"].$patch({
                param: { id },
                json: { status },
            });
            if (res.ok) {
                toast.success(`Review ${status}`);
                setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const filteredReviews = reviews.filter(r => filter === "all" ? true : r.status === filter);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground">User Reviews</h1>
                    <p className="text-muted-foreground text-xs font-medium">Moderate feedback from your users.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 gap-2 rounded-lg font-bold text-[10px] uppercase tracking-wider bg-background border-border/50">
                                <Filter className="size-3 text-muted-foreground" />
                                {filter === "all" ? "All Reviews" : `${filter} Reviews`}
                                <ChevronDown className="size-3 text-muted-foreground" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-1" align="end">
                            <div className="flex flex-col gap-0.5">
                                {(["all", "pending", "approved", "rejected"] as const).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={cn(
                                            "flex items-center px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all text-left",
                                            filter === f
                                                ? "bg-muted text-foreground"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider h-8">
                        {filteredReviews.length} / {reviews.length}
                    </Badge>
                </div>

            </div>

            <div className="border rounded-xl bg-card overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b bg-muted/30">
                                <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider w-[200px] text-[10px]">User</th>
                                <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Content</th>
                                <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider w-[80px] text-[10px]">Rating</th>
                                <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider w-[100px] text-[10px]">Status</th>
                                <th className="p-3 font-bold text-muted-foreground uppercase tracking-wider w-[120px] text-right text-[10px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y border-t-0">
                            {filteredReviews.length > 0 ? (
                                filteredReviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-muted/10 transition-colors">
                                        <td className="p-3 align-middle">
                                            <div className="font-bold text-sm text-foreground leading-tight">{review.userName || 'Anonymous'}</div>
                                            <div className="text-muted-foreground text-[11px] truncate max-w-[170px] font-medium leading-none mt-1.5">{review.userEmail}</div>
                                        </td>
                                        <td className="p-3 align-middle">
                                            <p className="text-foreground/90 font-medium leading-tight max-w-md line-clamp-2 text-[13px] tracking-tight">
                                                {review.content}
                                            </p>
                                        </td>
                                        <td className="p-3 align-middle">
                                            <div className="flex items-center gap-0.5 text-amber-600 font-bold text-[13px]">
                                                <Star className="size-3.5 fill-current" />
                                                <span>{review.rating}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 align-middle">
                                            <Badge
                                                variant={
                                                    review.status === 'approved' ? 'success' :
                                                        review.status === 'rejected' ? 'destructive' :
                                                            'secondary'
                                                }
                                                className="text-[10px] px-1.5 py-0 h-4 capitalize font-bold tracking-tight shadow-none border-0"
                                            >
                                                {review.status}
                                            </Badge>
                                        </td>
                                        <td className="p-3 align-middle text-right">
                                            <div className="flex justify-end gap-1">
                                                {review.status !== 'approved' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-7 rounded-md text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 active:scale-95 transition-transform"
                                                        onClick={() => handleUpdateStatus(review.id, 'approved')}
                                                        title="Approve"
                                                    >
                                                        <Check className="size-4" />
                                                    </Button>
                                                )}
                                                {review.status !== 'rejected' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-7 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 active:scale-95 transition-transform"
                                                        onClick={() => handleUpdateStatus(review.id, 'rejected')}
                                                        title="Reject"
                                                    >
                                                        <X className="size-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-16 text-center">
                                        <MessageSquareOff className="size-8 mx-auto text-muted-foreground/30 mb-3" />
                                        <p className="text-sm text-muted-foreground font-bold tracking-tight">No {filter !== 'all' ? filter : ''} reviews found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}
