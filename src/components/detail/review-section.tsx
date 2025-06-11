import { reviewApi } from "@/services/review.api";
import ReviewSectionClient from "./review-section-client";

export default async function ReviewSection({ slug }: { slug: string }) {
    let initialReviews = null;
    try {
        initialReviews = await reviewApi.getReviewByProduct(slug, 1, 10);
    } catch (error) {
        console.error("Server-side review fetch failed:", error);
    }

    return (
        <ReviewSectionClient
            slug={slug}
            initialReviews={initialReviews}
        />
    );
}
