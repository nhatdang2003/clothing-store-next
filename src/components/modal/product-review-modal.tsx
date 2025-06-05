"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Upload, Trash2, ImageIcon, VideoIcon, Play, User } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { ImageViewer } from "@/components/ui/image-viewer";
import {
    useCreateReview,
    useReview,
    useUpdateReview,
} from "@/hooks/use-review-query";
import { reviewApi } from "@/services/review.api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getColorText } from "@/lib/utils";

interface StarRatingProps {
    rating: number;
    onRatingChange: (rating: number) => void;
    disabled?: boolean;
}

interface ProductReviewModalProps {
    orderId: string;
    type: "create" | "update";
}

function StarRating({ rating, onRatingChange, disabled }: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={cn(
                        "w-6 h-6 cursor-pointer transition-colors",
                        (hoverRating || rating) >= star
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300",
                        disabled && "cursor-not-allowed opacity-50"
                    )}
                    onMouseEnter={() => !disabled && setHoverRating(star)}
                    onMouseLeave={() => !disabled && setHoverRating(0)}
                    onClick={() => !disabled && onRatingChange(star)}
                />
            ))}
        </div>
    );
}

function ReviewSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Skeleton className="w-24 h-24 sm:w-16 sm:h-16 rounded" />
                <div className="space-y-2 text-center sm:text-left">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
        </div>
    );
}

export function ProductReviewModal({ orderId, type }: ProductReviewModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [ratings, setRatings] = useState<{ [key: number]: number }>({});
    const [descriptions, setDescriptions] = useState<{ [key: number]: string }>(
        {}
    );
    // Existing media states (URLs from server)
    const [existingImages, setExistingImages] = useState<{ [key: number]: string[] }>({});
    const [existingVideo, setExistingVideo] = useState<{ [key: number]: string | null }>({});

    // New media states (Files selected by user)
    const [newImageFiles, setNewImageFiles] = useState<{ [key: number]: File[] }>({});
    const [newVideoFile, setNewVideoFile] = useState<{ [key: number]: File | null }>({});
    const [newImagePreviews, setNewImagePreviews] = useState<{ [key: number]: string[] }>({});
    const [newVideoPreview, setNewVideoPreview] = useState<{ [key: number]: string | null }>({});
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [viewerImages, setViewerImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const { data: reviews, isLoading } = useReview(orderId);

    // Initialize existing media when reviews data loads or modal opens
    useEffect(() => {
        if (reviews && reviews.length > 0 && isOpen) {
            const existingImagesData: { [key: number]: string[] } = {};
            const existingVideoData: { [key: number]: string | null } = {};

            reviews.forEach((review: any, index: number) => {
                existingImagesData[index] = review.imageUrls || [];
                existingVideoData[index] = review.videoUrl || null;
            });

            setExistingImages(existingImagesData);
            setExistingVideo(existingVideoData);

            // Handle editing mode based on type
            if (type === "create") {
                // For create mode, no specific editing index - all are in input mode
                setEditingIndex(null);
            } else {
                // For update mode, automatically enter edit mode for the first unreviewed item
                let firstUnreviewedIndex = -1;
                reviews.forEach((review: any, index: number) => {
                    if (firstUnreviewedIndex === -1 && (review.rating === null || review.description === null)) {
                        firstUnreviewedIndex = index;
                    }
                });

                if (firstUnreviewedIndex !== -1) {
                    setEditingIndex(firstUnreviewedIndex);
                }
            }
        }
    }, [reviews, isOpen, type]);
    const { mutate: createReview } = useCreateReview();
    const { mutate: updateReview } = useUpdateReview();
    const { toast } = useToast();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? "Invalid Date"
            : date.toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });
    };

    const resetAllStates = () => {
        // Reset form states
        setRatings({});
        setDescriptions({});

        // Clean up object URLs to prevent memory leaks
        Object.values(newImagePreviews).forEach(previews => {
            previews.forEach(url => URL.revokeObjectURL(url));
        });
        Object.values(newVideoPreview).forEach(url => {
            if (url) URL.revokeObjectURL(url);
        });

        // Don't reset existing media states - they should persist
        // Only reset new media states
        setNewImageFiles({});
        setNewVideoFile({});
        setNewImagePreviews({});
        setNewVideoPreview({});

        // Reset viewer states
        setIsImageViewerOpen(false);
        setSelectedImageIndex(0);
        setViewerImages([]);

        // Reset upload state
        setIsUploading(false);

        // Reset editing state
        setEditingIndex(null);
    };

    // Helper functions for media management
    const getTotalImages = (index: number) => {
        const existing = existingImages[index] || [];
        const newImages = newImagePreviews[index] || [];
        return [...existing, ...newImages];
    };

    const getTotalVideo = (index: number) => {
        return existingVideo[index] || newVideoPreview[index];
    };

    const removeExistingImage = (index: number, imageUrl: string) => {
        const currentExisting = existingImages[index] || [];
        const updatedExisting = currentExisting.filter(url => url !== imageUrl);
        setExistingImages({
            ...existingImages,
            [index]: updatedExisting
        });
    };

    const removeNewImage = (index: number, imageIndex: number) => {
        const currentFiles = newImageFiles[index] || [];
        const currentPreviews = newImagePreviews[index] || [];

        // Revoke object URL
        URL.revokeObjectURL(currentPreviews[imageIndex]);

        const newFiles = currentFiles.filter((_, i) => i !== imageIndex);
        const newPreviews = currentPreviews.filter((_, i) => i !== imageIndex);

        setNewImageFiles({ ...newImageFiles, [index]: newFiles });
        setNewImagePreviews({ ...newImagePreviews, [index]: newPreviews });
    };

    const removeExistingVideo = (index: number) => {
        setExistingVideo({
            ...existingVideo,
            [index]: null
        });
    };

    const removeNewVideo = (index: number) => {
        const existingPreview = newVideoPreview[index];
        if (existingPreview) {
            URL.revokeObjectURL(existingPreview);
        }

        const newFiles = { ...newVideoFile };
        delete newFiles[index];
        const newPreviews = { ...newVideoPreview };
        delete newPreviews[index];

        setNewVideoFile(newFiles);
        setNewVideoPreview(newPreviews);
    };

    const handleImageClick = (images: string[], index: number) => {
        setViewerImages(images);
        setSelectedImageIndex(index);
        setIsImageViewerOpen(true);
    };

    const handleImageViewerClose = useCallback(() => {
        setIsImageViewerOpen(false);
        setViewerImages([]);
        setSelectedImageIndex(0);
    }, []);

    // Check if all reviews can be submitted (for create mode)
    const canSubmitAllReviews = () => {
        if (!reviews) return false;

        return reviews.every((review: any, index: number) => {
            const hasRating = ratings[index] || review.rating;
            const hasDescription = descriptions[index] || review.description;
            return hasRating && hasDescription;
        });
    };

    // Handle submit all reviews (for create mode)
    const handleSubmitAll = async () => {
        if (!reviews) return;

        try {
            setIsUploading(true);

            // Submit each review sequentially
            for (let index = 0; index < reviews.length; index++) {
                const review = reviews[index];

                // Prepare review data similar to handleSubmit but without individual logic
                let imageUrls: string[] = [];
                let videoUrl: string | null = null;

                // Collect all files to upload for this review
                const images = newImageFiles[index] || [];
                const video = newVideoFile[index];
                const allFiles: File[] = [...images];
                if (video) allFiles.push(video);

                // Upload media files if any
                if (allFiles.length > 0) {
                    const fileNames = allFiles.map(file => {
                        const [name, extension] = file.name.split(".");
                        return `${name}-${Date.now()}.${extension}`;
                    });

                    const response = await reviewApi.getSignedUrls({ fileNames });
                    const { signedUrls } = response;

                    // Upload each file
                    await Promise.all(
                        allFiles.map(async (file, fileIndex) => {
                            const urlData = signedUrls[fileIndex];
                            const { signedUrl } = urlData;

                            const uploadResponse = await reviewApi.uploadMedia(signedUrl, file);

                            if (!uploadResponse.ok) {
                                throw new Error(`Failed to upload ${file.name}`);
                            }

                            // Get the final URL (without query params)
                            const finalUrl = signedUrl.split("?")[0];

                            // Categorize uploaded files
                            if (file.type.startsWith('image/')) {
                                imageUrls.push(finalUrl);
                            } else if (file.type.startsWith('video/')) {
                                videoUrl = finalUrl;
                            }
                        })
                    );
                }

                // Combine existing URLs with new uploaded URLs
                const existingImageUrls = existingImages[index] || [];
                const finalImageUrls = [...existingImageUrls, ...imageUrls];
                const finalVideoUrl = existingVideo[index] || videoUrl;

                const reviewData = {
                    orderId: parseInt(orderId),
                    reviewItem: {
                        lineItemId: review.lineItemId,
                        rating: ratings[index] || review.rating,
                        description: descriptions[index] || review.description,
                        imageUrls: finalImageUrls,
                        videoUrl: finalVideoUrl,
                    },
                };

                // Create the review
                createReview(reviewData);
            }

            toast({
                title: "Thành công",
                description: "Đã gửi tất cả đánh giá thành công",
            });

            // Close modal after successful submission
            setIsOpen(false);
        } catch (error) {
            console.error("Error submitting all reviews:", error);
            toast({
                title: "Lỗi",
                description: "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageUpload = (index: number, files: FileList) => {
        const newFiles = Array.from(files);

        // Validate file types
        const validImageFiles = newFiles.filter(file => {
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "Lỗi",
                    description: `File "${file.name}" không phải là hình ảnh`,
                    variant: "destructive",
                });
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Lỗi",
                    description: `File "${file.name}" vượt quá 5MB`,
                    variant: "destructive",
                });
                return false;
            }
            return true;
        });

        // Check total images limit (5 max total)
        const currentTotal = getTotalImages(index).length;
        const totalImages = currentTotal + validImageFiles.length;
        if (totalImages > 5) {
            const remaining = 5 - currentTotal;
            toast({
                title: "Lỗi",
                description: `Tối đa 5 hình ảnh được phép. Bạn chỉ có thể thêm ${remaining} ảnh nữa.`,
                variant: "destructive",
            });
            return;
        }

        // Add new files
        const currentFiles = newImageFiles[index] || [];
        const updatedFiles = [...currentFiles, ...validImageFiles];
        setNewImageFiles({ ...newImageFiles, [index]: updatedFiles });

        // Create previews
        const newPreviews = validImageFiles.map(file => URL.createObjectURL(file));
        const currentPreviews = newImagePreviews[index] || [];
        setNewImagePreviews({ ...newImagePreviews, [index]: [...currentPreviews, ...newPreviews] });
    };

    const handleVideoUpload = (index: number, file: File) => {
        // Check if there's already a video (existing or new)
        const currentVideo = getTotalVideo(index);
        if (currentVideo) {
            toast({
                title: "Lỗi",
                description: "Đã có video cho đánh giá này. Chỉ được phép 1 video per review.",
                variant: "destructive",
            });
            return;
        }

        // Validate video file
        if (!file.type.startsWith('video/')) {
            toast({
                title: "Lỗi",
                description: "File không phải là video",
                variant: "destructive",
            });
            return;
        }

        if (file.size > 50 * 1024 * 1024) { // 50MB limit for video
            toast({
                title: "Lỗi",
                description: "Video không được vượt quá 50MB",
                variant: "destructive",
            });
            return;
        }

        // Remove existing video preview if any
        const existingPreview = newVideoPreview[index];
        if (existingPreview) {
            URL.revokeObjectURL(existingPreview);
        }

        setNewVideoFile({ ...newVideoFile, [index]: file });
        const videoPreview = URL.createObjectURL(file);
        setNewVideoPreview({ ...newVideoPreview, [index]: videoPreview });
    };



    const handleSubmit = async (index: number, review: any) => {
        try {
            setIsUploading(true);

            let imageUrls: string[] = [];
            let videoUrl: string | null = null;

            // Collect all new files to upload
            const images = newImageFiles[index] || [];
            const video = newVideoFile[index];
            const allFiles: File[] = [...images];
            if (video) allFiles.push(video);

            // Upload media files if any
            if (allFiles.length > 0) {
                try {
                    // Get signed URLs for all files
                    const fileNames = allFiles.map(file => {
                        const [name, extension] = file.name.split(".");
                        return `${name}-${Date.now()}.${extension}`;
                    });

                    const response = await reviewApi.getSignedUrls({ fileNames });
                    const { signedUrls } = response;

                    // Upload each file
                    await Promise.all(
                        allFiles.map(async (file, fileIndex) => {
                            const urlData = signedUrls[fileIndex];
                            const { signedUrl } = urlData;

                            const uploadResponse = await reviewApi.uploadMedia(signedUrl, file);

                            if (!uploadResponse.ok) {
                                throw new Error(`Failed to upload ${file.name}`);
                            }

                            // Get the final URL (without query params)
                            const finalUrl = signedUrl.split("?")[0];

                            // Categorize uploaded files
                            if (file.type.startsWith('image/')) {
                                imageUrls.push(finalUrl);
                            } else if (file.type.startsWith('video/')) {
                                videoUrl = finalUrl;
                            }
                        })
                    );

                    toast({
                        title: "Thành công",
                        description: "Upload media thành công",
                    });

                } catch (uploadError) {
                    console.error("Upload error:", uploadError);
                    toast({
                        title: "Lỗi upload",
                        description: "Có lỗi xảy ra khi upload media. Vui lòng thử lại.",
                        variant: "destructive",
                    });
                    return;
                }
            }

            // Combine existing URLs with new uploaded URLs
            const existingImageUrls = existingImages[index] || [];
            const finalImageUrls = [...existingImageUrls, ...imageUrls];
            const finalVideoUrl = existingVideo[index] || videoUrl;

            const reviewData = {
                orderId: parseInt(orderId),
                reviewItem: {
                    lineItemId: review.lineItemId,
                    rating: ratings[index] || review.rating,
                    description: descriptions[index] || review.description,
                    imageUrls: finalImageUrls,
                    videoUrl: finalVideoUrl,
                },
            };
            console.log(reviewData);
            if (review.rating !== null && review.description !== null) {
                // Update existing review
                updateReview(reviewData);
            } else {
                // Create new review
                createReview(reviewData);
            }

            const newRatings = { ...ratings };
            delete newRatings[index];
            setRatings(newRatings);

            const newDescriptions = { ...descriptions };
            delete newDescriptions[index];
            setDescriptions(newDescriptions);

            // Clean up new media for this review
            const reviewImagePreviews = newImagePreviews[index] || [];
            reviewImagePreviews.forEach(url => URL.revokeObjectURL(url));

            const reviewVideoPreview = newVideoPreview[index];
            if (reviewVideoPreview) {
                URL.revokeObjectURL(reviewVideoPreview);
            }

            // Remove new media files and previews for this review
            const updatedImageFiles = { ...newImageFiles };
            const updatedVideoFiles = { ...newVideoFile };
            const updatedImagePreviews = { ...newImagePreviews };
            const updatedVideoPreviews = { ...newVideoPreview };

            delete updatedImageFiles[index];
            delete updatedVideoFiles[index];
            delete updatedImagePreviews[index];
            delete updatedVideoPreviews[index];

            setNewImageFiles(updatedImageFiles);
            setNewVideoFile(updatedVideoFiles);
            setNewImagePreviews(updatedImagePreviews);
            setNewVideoPreview(updatedVideoPreviews);

            const isUpdate = review.rating !== null && review.description !== null;

            toast({
                title: "Thành công",
                description: isUpdate
                    ? "Cập nhật đánh giá thành công"
                    : "Gửi đánh giá thành công",
            });

            // If it's an update, don't close modal - just refresh data
            if (isUpdate) {
                // Update existing images and video with the new combined data
                setExistingImages({
                    ...existingImages,
                    [index]: finalImageUrls
                });
                setExistingVideo({
                    ...existingVideo,
                    [index]: finalVideoUrl
                });

                // Exit editing mode
                setEditingIndex(null);

                return;
            }

            // Close modal if no more items to review (only for new reviews)
            const hasMoreReviews = Object.keys(newRatings).length > 0;
            if (!hasMoreReviews) {
                setIsOpen(false);
            } else {
                // Exit editing mode after creating a new review
                setEditingIndex(null);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast({
                title: "Lỗi",
                description: "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => {
                // Prevent closing if ImageViewer is open
                if (!open && isImageViewerOpen) {
                    return; // Don't close the modal if ImageViewer is open
                }

                setIsOpen(open);
                // Reset tất cả state khi đóng modal
                if (!open) {
                    resetAllStates();
                }
            }}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                        <Star className="h-4 w-4 mr-2" />
                        {type === "create" ? "Đánh giá" : "Xem đánh giá"}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3/4 max-h-[90vh] flex flex-col p-0">
                    <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
                        <DialogTitle className="text-lg sm:text-xl">
                            Đánh giá sản phẩm
                        </DialogTitle>
                    </DialogHeader>

                    {isLoading ? (
                        <div className="p-6">
                            <ReviewSkeleton />
                        </div>
                    ) : reviews && reviews.length > 0 ? (
                        <div className="flex-1 overflow-y-auto">
                            {reviews.map((review: any, index: number) => {
                                const isEditing = type === "create" ? true : editingIndex === index;
                                const hasReview = review.rating !== null && review.description !== null;

                                return (
                                    <div
                                        key={review.lineItemId}
                                        className="p-6 border-b last:border-b-0"
                                    >
                                        <div className="flex flex-col sm:flex-row items-center md:items-start space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                                            <img
                                                src={review.variantImage || "/placeholder-product.png"}
                                                alt={review.productName}
                                                className="aspect-[2/3] w-24 sm:w-16 object-cover rounded"
                                            />
                                            <div className="flex-1 text-center sm:text-left">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-semibold">{review.productName}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {getColorText(review.color)} - {review.size}
                                                        </p>
                                                    </div>

                                                    {/* Edit button - only show if has review and not currently editing and not in create mode */}
                                                    {type === "update" && hasReview && !isEditing && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setEditingIndex(index)}
                                                            className="ml-2"
                                                        >
                                                            Sửa
                                                        </Button>
                                                    )}

                                                    {/* Cancel button - only show when editing in update mode */}
                                                    {type === "update" && isEditing && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setEditingIndex(null)}
                                                            className="ml-2"
                                                        >
                                                            Hủy
                                                        </Button>
                                                    )}
                                                </div>

                                                {/* Reviewer Info - only show if review exists */}
                                                {hasReview && (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        {review.avatar ? (
                                                            <Image
                                                                src={review.avatar || "/placeholder-avatar.png"}
                                                                alt={`${review.firstName} ${review.lastName}`}
                                                                width={24}
                                                                height={24}
                                                                className="rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                                                <User className="w-4 h-4 text-gray-500" />
                                                            </div>
                                                        )}
                                                        <div className="text-left">
                                                            <p className="text-sm font-medium">
                                                                {review.firstName} {review.lastName}
                                                            </p>
                                                            {review.createdAt && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    {formatDate(review.createdAt)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>



                                        {/* View Mode - Display existing review (only in update mode) */}
                                        {type === "update" && !isEditing && hasReview && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Đánh giá</Label>
                                                    <StarRating
                                                        rating={review.rating || 0}
                                                        onRatingChange={() => { }} // Read-only
                                                        disabled={true}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Nhận xét</Label>
                                                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                                                        {review.description || "Không có nhận xét"}
                                                    </div>
                                                </div>

                                                {/* Display existing media in view mode */}
                                                {((existingImages[index] && existingImages[index].length > 0) || existingVideo[index]) && (
                                                    <div className="space-y-3">
                                                        <Label className="text-sm font-medium">Hình ảnh và video</Label>

                                                        {/* Existing Images Display */}
                                                        {existingImages[index] && existingImages[index].length > 0 && (
                                                            <div className="grid grid-cols-5 gap-2">
                                                                {existingImages[index].map((imageUrl, imgIndex) => (
                                                                    <Image
                                                                        key={imgIndex}
                                                                        src={imageUrl || "/placeholder-image.png"}
                                                                        alt={`Review ${imgIndex + 1}`}
                                                                        width={80}
                                                                        height={80}
                                                                        className="rounded-md object-cover w-20 h-20 border cursor-pointer"
                                                                        onClick={() => handleImageClick(existingImages[index], imgIndex)}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Existing Video Display */}
                                                        {existingVideo[index] && (
                                                            <div className="relative w-full">
                                                                <video
                                                                    src={existingVideo[index] || ""}
                                                                    className="w-full h-64 object-cover rounded-md border"
                                                                    controls
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Edit Mode or Create Mode */}
                                        {(type === "create" || isEditing || !hasReview) && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`rating-${index}`}
                                                        className="text-sm font-medium"
                                                    >
                                                        Đánh giá của bạn <span className="text-red-500">*</span>
                                                    </Label>
                                                    <StarRating
                                                        rating={ratings[index] || review.rating || 0}
                                                        onRatingChange={(rating) =>
                                                            setRatings({ ...ratings, [index]: rating })
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`description-${index}`}
                                                        className="text-sm font-medium"
                                                    >
                                                        Nhận xét của bạn <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Textarea
                                                        id={`description-${index}`}
                                                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                                                        value={descriptions[index] || review.description || ""}
                                                        onChange={(e) =>
                                                            setDescriptions({
                                                                ...descriptions,
                                                                [index]: e.target.value,
                                                            })
                                                        }
                                                        rows={4}
                                                        className="resize-none"
                                                    />
                                                </div>

                                                {/* Media Upload Section */}
                                                <div className="space-y-4">
                                                    <Label className="text-sm font-medium">
                                                        Hình ảnh và video (tuỳ chọn)
                                                    </Label>

                                                    {/* Image Upload */}
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-muted-foreground">
                                                                Hình ảnh (tối đa 5 ảnh)
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {getTotalImages(index).length}/5
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-5 gap-2">
                                                            {/* Existing Images */}
                                                            {(existingImages[index] || []).map((imageUrl, imgIndex) => (
                                                                <div key={`existing-${imgIndex}`} className="relative group">
                                                                    <Image
                                                                        src={imageUrl || "/placeholder-image.png"}
                                                                        alt={`Existing ${imgIndex + 1}`}
                                                                        width={100}
                                                                        height={100}
                                                                        className="rounded-md object-cover w-20 h-20 border cursor-pointer"
                                                                        onClick={() => handleImageClick(getTotalImages(index), imgIndex)}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeExistingImage(index, imageUrl)}
                                                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            ))}

                                                            {/* New Images */}
                                                            {(newImagePreviews[index] || []).map((imageUrl, imgIndex) => (
                                                                <div key={`new-${imgIndex}`} className="relative group">
                                                                    <Image
                                                                        src={imageUrl || "/placeholder-image.png"}
                                                                        alt={`New ${imgIndex + 1}`}
                                                                        width={100}
                                                                        height={100}
                                                                        className="rounded-md object-cover w-20 h-20 border cursor-pointer"
                                                                        onClick={() => handleImageClick(getTotalImages(index), (existingImages[index] || []).length + imgIndex)}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeNewImage(index, imgIndex)}
                                                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            ))}

                                                            {/* Upload Image Button */}
                                                            {getTotalImages(index).length < 5 && (
                                                                <label
                                                                    htmlFor={`image-upload-${index}`}
                                                                    className="flex flex-col items-center justify-center w-20 h-20 border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <ImageIcon className="w-6 h-6 text-gray-500" />
                                                                    <p className="text-xs text-gray-500 text-center">Thêm ảnh</p>
                                                                    <input
                                                                        id={`image-upload-${index}`}
                                                                        type="file"
                                                                        className="hidden"
                                                                        multiple
                                                                        accept="image/*"
                                                                        onChange={(e) => {
                                                                            if (e.target.files) {
                                                                                handleImageUpload(index, e.target.files);
                                                                                e.target.value = '';
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Video Upload */}
                                                    <div className="space-y-3">
                                                        <span className="text-sm text-muted-foreground">
                                                            Video (tối đa 1 video)
                                                        </span>

                                                        {/* Existing Video */}
                                                        {existingVideo[index] && (
                                                            <div className="relative group w-full">
                                                                <video
                                                                    src={existingVideo[index] || ""}
                                                                    className="w-full h-64 object-cover rounded-md border"
                                                                    controls
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeExistingVideo(index)}
                                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100 z-10"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* New Video */}
                                                        {newVideoPreview[index] && !existingVideo[index] && (
                                                            <div className="relative group w-full">
                                                                <video
                                                                    src={newVideoPreview[index] || ""}
                                                                    className="w-full h-64 object-cover rounded-md border"
                                                                    controls
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeNewVideo(index)}
                                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* Upload Video Button */}
                                                        {!getTotalVideo(index) && (
                                                            <label
                                                                htmlFor={`video-upload-${index}`}
                                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                                            >
                                                                <VideoIcon className="w-8 h-8 text-gray-500 mb-2" />
                                                                <p className="text-sm text-gray-500 text-center font-medium">Thêm video</p>
                                                                <p className="text-xs text-gray-500 text-center">MP4, MOV (MAX. 50MB)</p>
                                                                <input
                                                                    id={`video-upload-${index}`}
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="video/*"
                                                                    onChange={(e) => {
                                                                        if (e.target.files?.[0]) {
                                                                            handleVideoUpload(index, e.target.files[0]);
                                                                            e.target.value = '';
                                                                        }
                                                                    }}
                                                                />
                                                            </label>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Individual submit button - only show in update mode */}
                                                {type === "update" && (
                                                    <Button
                                                        type="button"
                                                        disabled={
                                                            isUploading ||
                                                            (!ratings[index] && (review.rating === null || review.rating === 0)) ||
                                                            (ratings[index] === 0 && (review.rating === null || review.rating === 0)) ||
                                                            (!descriptions[index] && !review.description)
                                                        }
                                                        className="w-full"
                                                        onClick={() => handleSubmit(index, review)}
                                                    >
                                                        {isUploading
                                                            ? "Đang xử lý..."
                                                            : review.rating !== null && review.description !== null
                                                                ? "Cập nhật đánh giá"
                                                                : "Gửi đánh giá"}
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Global submit button for create mode */}
                            {type === "create" && (
                                <div className="p-6 border-t bg-gray-50">
                                    <Button
                                        type="button"
                                        disabled={isUploading || !canSubmitAllReviews()}
                                        className="w-full"
                                        onClick={handleSubmitAll}
                                    >
                                        {isUploading ? "Đang xử lý..." : "Gửi tất cả đánh giá"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-6 text-center text-muted-foreground">
                            Không tìm thấy thông tin sản phẩm
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Image Viewer - Now with automatic z-index management */}
            <ImageViewer
                images={viewerImages}
                initialIndex={selectedImageIndex}
                isOpen={isImageViewerOpen}
                onClose={handleImageViewerClose}
            />
        </>
    );
}
