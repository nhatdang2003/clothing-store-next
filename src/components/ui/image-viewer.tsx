"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageViewerProps {
    images: string[];
    initialIndex?: number;
    isOpen: boolean;
    onClose: () => void;
    zIndex?: number;
}

// Simple z-index for ImageViewer - always higher than modals
const IMAGE_VIEWER_Z_INDEX = 100000;

export function ImageViewer({
    images,
    initialIndex = 0,
    isOpen,
    onClose,
    zIndex
}: ImageViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [mounted, setMounted] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const isClosingRef = useRef(false);

    // Memoized event handlers
    const handleClose = useCallback(() => {
        if (isClosingRef.current) return;
        isClosingRef.current = true;
        onClose();
        // Reset closing flag after animation
        setTimeout(() => {
            isClosingRef.current = false;
        }, 300);
    }, [onClose]);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    }, [images.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    }, [images.length]);

    // Mount/unmount management
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Index management
    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    // Keyboard and body scroll management
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    e.stopPropagation();
                    goToPrevious();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    e.stopPropagation();
                    goToNext();
                    break;
                case 'Escape':
                    e.preventDefault();
                    e.stopPropagation();
                    handleClose();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, goToPrevious, goToNext, handleClose]);

    const downloadImage = useCallback(async () => {
        try {
            const response = await fetch(images[currentIndex]);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `image-${currentIndex + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    }, [images, currentIndex]);

    // Handle backdrop click
    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
        // Only close when clicking on the backdrop (not on child elements)
        if (e.target === e.currentTarget) {
            e.preventDefault();
            e.stopPropagation();
            handleClose();
        }
    }, [handleClose]);

    // Handle content click to prevent propagation
    const handleContentClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    if (!mounted || !isOpen) return null;

    const overlay = (
        <div
            ref={overlayRef}
            data-image-viewer
            className="fixed inset-0 bg-black/95 flex items-center justify-center animate-in fade-in duration-200"
            style={{
                zIndex: zIndex || IMAGE_VIEWER_Z_INDEX,
                pointerEvents: 'auto'
            }}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
        >
            <div
                className="relative w-full h-full flex items-center justify-center"
                onClick={handleContentClick}
            >
                {/* Close Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                    }}
                    aria-label="Close image viewer"
                >
                    <X className="h-6 w-6" />
                </Button>

                {/* Download Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-16 z-10 text-white hover:bg-white/20 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        downloadImage();
                    }}
                    aria-label="Download image"
                >
                    <Download className="h-6 w-6" />
                </Button>

                {/* Navigation Buttons */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrevious();
                            }}
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-8 w-8" />
                        </Button>
                    </>
                )}

                {/* Image */}
                <div
                    className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-16"
                    onClick={handleContentClick}
                >
                    {images[currentIndex] && (
                        <div className="relative w-full h-full">
                            <Image
                                src={images[currentIndex]}
                                alt={`Hình ảnh ${currentIndex + 1} của ${images.length}`}
                                fill
                                className="object-contain"
                                quality={100}
                                priority
                                sizes="100vw"
                            />
                        </div>
                    )}
                </div>

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                        <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </div>
                )}

                {/* Thumbnail Strip */}
                {images.length > 1 && images.length <= 10 && (
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
                        <div className="flex gap-2 bg-black/70 p-2 rounded-lg max-w-[80vw] overflow-x-auto backdrop-blur-sm">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex(index);
                                    }}
                                    className={`relative w-12 h-12 rounded border-2 transition-all flex-shrink-0 ${index === currentIndex
                                        ? 'border-white'
                                        : 'border-transparent hover:border-white/50'
                                        }`}
                                    aria-label={`View image ${index + 1}`}
                                >
                                    <Image
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover rounded"
                                        sizes="48px"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading indicator for large image sets */}
                {images.length > 10 && (
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
                        <div className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                            Use arrow keys to navigate
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(overlay, document.body);
} 