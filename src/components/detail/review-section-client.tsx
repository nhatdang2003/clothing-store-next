"use client";

import { Star } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useReviews } from "@/hooks/use-reviews";
import Pagination from "@/components/ui/pagination";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ReviewMedia from "./review-media";
import { getColorText } from "@/lib/utils";

interface MediaItem {
    url: string;
    type: "image" | "video";
    thumbnail?: string;
}

interface Review {
    reviewId: number;
    rating: number;
    description: string;
    createdAt: string;
    firstName: string | null;
    lastName: string | null;
    variant: {
        color: string;
        size: string;
        variantId: number;
    };
    imageUrls: string[];
    videoUrl: string;
}

interface ReviewResponse {
    data: Review[];
    meta?: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    };
}

interface ReviewSectionClientProps {
    slug: string;
    initialReviews?: ReviewResponse;
}

export default function ReviewSectionClient({
    slug,
    initialReviews
}: ReviewSectionClientProps) {
    const {
        reviews,
        pagination,
        loading,
        error,
        goToPage,
        retry
    } = useReviews({
        slug,
        initialData: initialReviews,
        itemsPerPage: 10
    });

    // Helper function to convert review data to MediaItem format
    const getReviewMedia = (review: Review): MediaItem[] => {
        const media: MediaItem[] = [];

        // Add images
        if (review.imageUrls && review.imageUrls.length > 0) {
            review.imageUrls.forEach(url => {
                media.push({
                    url,
                    type: "image"
                });
            });
        }

        // Add video
        if (review.videoUrl) {
            media.push({
                url: review.videoUrl,
                type: "video"
            });
        }

        return media;
    };

    const handlePageChange = (page: number) => {
        goToPage(page);
        // Scroll to reviews section
        document.getElementById("reviews-section")?.scrollIntoView({
            behavior: "instant",
        });
    };

    if (error) {
        return (
            <section className="mt-8 md:mt-12" id="reviews-section">
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                    Đánh giá của khách hàng
                </h2>
                <div className="text-center py-8 text-red-500">
                    <p>{error}</p>
                    <button
                        onClick={retry}
                        className="mt-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="mt-8 md:mt-12" id="reviews-section">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold">
                    Đánh giá của khách hàng
                </h2>
            </div>

            {loading && (
                <div className="flex justify-center py-8">
                    <LoadingSpinner />
                </div>
            )}

            <div className={`space-y-6 ${loading ? 'opacity-50' : ''}`}>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.reviewId} className="border-b border-gray-100 pb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 mb-3">
                                <div className="flex items-center">
                                    <div className="flex mr-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 md:w-5 md:h-5 ${i < review.rating
                                                    ? "text-yellow-500 fill-yellow-500"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-semibold text-sm md:text-base text-gray-800">
                                        {review.firstName || review.lastName
                                            ? `${review.firstName || ""} ${review.lastName || ""}`.trim()
                                            : "Khách hàng ẩn danh"}
                                    </span>
                                </div>
                                <div className="flex items-center sm:ml-auto">
                                    <span className="text-gray-500 text-sm">
                                        {format(new Date(review.createdAt), "dd MMMM, yyyy", {
                                            locale: vi,
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-3 text-xs md:text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-md inline-block">
                                Phiên bản: {getColorText(review.variant.color)} - {review.variant.size}
                            </div>

                            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3">
                                {review.description}
                            </p>

                            {/* Media section */}
                            <ReviewMedia
                                media={getReviewMedia(review)}
                                reviewId={review.reviewId}
                            />
                        </div>
                    ))
                ) : (
                    !loading && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-2">
                                <Star className="w-12 h-12 mx-auto" />
                            </div>
                            <p className="text-gray-500 text-lg">Chưa có đánh giá nào</p>
                            <p className="text-gray-400 text-sm mt-1">
                                Hãy là người đầu tiên đánh giá sản phẩm này
                            </p>
                        </div>
                    )
                )}
            </div>

            {pagination && pagination.pages > 1 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={pagination.page + 1}
                        totalPages={pagination.pages}
                        onPageChange={handlePageChange}
                        loading={loading}
                        showInfo={true}
                        totalItems={pagination.total}
                        itemsPerPage={pagination.pageSize}
                        className="mt-4"
                    />
                </div>
            )}
        </section>
    );
} 