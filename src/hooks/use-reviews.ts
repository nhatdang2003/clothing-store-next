import { useState, useEffect } from "react";
import { reviewApi } from "@/services/review.api";

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

interface UseReviewsOptions {
    slug: string;
    initialData?: ReviewResponse;
    itemsPerPage?: number;
}

export function useReviews({
    slug,
    initialData,
    itemsPerPage = 10
}: UseReviewsOptions) {
    const [reviews, setReviews] = useState<ReviewResponse>(
        initialData || { data: [] }
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = async (page: number) => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const response = await reviewApi.getReviewByProduct(slug, page, itemsPerPage);
            console.log(response);
            setReviews(response);
        } catch (err) {
            setError("Đã có lỗi xảy ra khi tải đánh giá");
            console.error("Error fetching reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // if (!initialData) {
        fetchReviews(currentPage);
        // }
    }, [currentPage]);

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const retry = () => {
        fetchReviews(currentPage);
    };

    return {
        reviews: reviews.data || [],
        pagination: reviews.meta,
        currentPage,
        loading,
        error,
        goToPage,
        retry
    };
} 