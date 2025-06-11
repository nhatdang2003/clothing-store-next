"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface MediaItem {
    url: string;
    type: "image" | "video";
    thumbnail?: string;
}

interface ReviewMediaProps {
    media: MediaItem[];
    reviewId: number;
}

export default function ReviewMedia({ media, reviewId }: ReviewMediaProps) {
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedMedia) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedMedia]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!selectedMedia) return;

        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            navigateMedia('prev');
        } else if (e.key === 'ArrowRight') {
            navigateMedia('next');
        }
    }, [selectedMedia, selectedIndex]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!media || media.length === 0) {
        return null;
    }

    const openModal = (item: MediaItem, index: number) => {
        setSelectedMedia(item);
        setSelectedIndex(index);
    };

    const closeModal = () => {
        setSelectedMedia(null);
    };

    const navigateMedia = (direction: 'prev' | 'next') => {
        const newIndex = direction === 'prev'
            ? Math.max(0, selectedIndex - 1)
            : Math.min(media.length - 1, selectedIndex + 1);

        if (newIndex !== selectedIndex) {
            setSelectedIndex(newIndex);
            setSelectedMedia(media[newIndex]);
        }
    };

    const handleImageError = (url: string) => {
        setImageErrors(prev => new Set(prev).add(url));
    };

    const isImageError = (url: string) => imageErrors.has(url);

    return (
        <>
            <div className="mt-3 mb-2">
                <div className="flex flex-wrap gap-2">
                    {media.slice(0, 6).map((item, index) => (
                        <div
                            key={`${reviewId}-${index}`}
                            className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden cursor-pointer group bg-gray-100 border"
                            onClick={() => openModal(item, index)}
                        >
                            {item.type === "image" ? (
                                !isImageError(item.url) ? (
                                    <Image
                                        src={item.url}
                                        alt={`Review image ${index + 1}`}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                        sizes="(max-width: 768px) 64px, 80px"
                                        onError={() => handleImageError(item.url)}
                                        quality={75}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <ZoomIn className="w-6 h-6 text-gray-400" />
                                    </div>
                                )
                            ) : (
                                <div className="relative w-full h-full">
                                    {item.thumbnail && !isImageError(item.thumbnail) ? (
                                        <Image
                                            src={item.thumbnail}
                                            alt={`Video thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 64px, 80px"
                                            onError={() => handleImageError(item.thumbnail!)}
                                            quality={75}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <Play className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                        <Play className="w-4 h-4 text-white fill-white" />
                                    </div>
                                </div>
                            )}

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Show count if more than 6 items */}
                            {index === 5 && media.length > 6 && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">
                                        +{media.length - 6}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                >
                    <div
                        className="relative max-w-4xl max-h-full w-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 z-20"
                            aria-label="Đóng"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Navigation arrows */}
                        {media.length > 1 && (
                            <>
                                <button
                                    onClick={() => navigateMedia('prev')}
                                    disabled={selectedIndex === 0}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed z-20 bg-black bg-opacity-50 rounded-full p-2 transition-opacity"
                                    aria-label="Ảnh trước"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => navigateMedia('next')}
                                    disabled={selectedIndex === media.length - 1}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed z-20 bg-black bg-opacity-50 rounded-full p-2 transition-opacity"
                                    aria-label="Ảnh tiếp theo"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Media content */}
                        <div className="w-full h-full flex items-center justify-center">
                            {selectedMedia.type === "image" ? (
                                !isImageError(selectedMedia.url) ? (
                                    <div className="relative max-w-full max-h-[80vh]">
                                        <Image
                                            src={selectedMedia.url}
                                            alt="Review image"
                                            width={800}
                                            height={600}
                                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                                            sizes="(max-width: 768px) 100vw, 800px"
                                            onError={() => handleImageError(selectedMedia.url)}
                                            priority
                                            quality={90}
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-gray-200 rounded-lg p-8 text-center">
                                        <ZoomIn className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">Không thể tải ảnh</p>
                                    </div>
                                )
                            ) : (
                                <div className="w-full max-w-4xl">
                                    <video
                                        src={selectedMedia.url}
                                        controls
                                        autoPlay
                                        className="w-full h-auto max-h-[80vh] rounded-lg"
                                        onError={(e) => {
                                            console.error("Video load error:", e);
                                        }}
                                    >
                                        Trình duyệt của bạn không hỗ trợ video.
                                    </video>
                                </div>
                            )}
                        </div>

                        {/* Media indicators */}
                        {media.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                                <div className="flex items-center space-x-2 bg-black bg-opacity-60 px-4 py-2 rounded-full">
                                    {media.length <= 10 ? (
                                        // Show dots for small number of items
                                        media.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setSelectedIndex(index);
                                                    setSelectedMedia(media[index]);
                                                }}
                                                className={`w-3 h-3 rounded-full transition-colors ${index === selectedIndex
                                                    ? "bg-white"
                                                    : "bg-white bg-opacity-50"
                                                    }`}
                                                aria-label={`Xem media ${index + 1}`}
                                            />
                                        ))
                                    ) : (
                                        // Show only counter for large number of items
                                        <span className="text-white text-sm font-medium">
                                            {selectedIndex + 1} / {media.length}
                                        </span>
                                    )}

                                    {media.length <= 10 && (
                                        <span className="text-white text-sm ml-2">
                                            {selectedIndex + 1} / {media.length}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
} 