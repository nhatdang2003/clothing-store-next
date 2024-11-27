"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[selectedImage]}
          alt={`${alt} - View ${selectedImage + 1}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex space-x-2 overflow-x-auto p-1">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 rounded-md overflow-hidden ${
              selectedImage === index
                ? "ring-2 ring-black"
                : "ring-1 ring-gray-200 hover:ring-gray-300"
            }`}
          >
            <div className="relative w-14 h-14">
              <Image
                src={image}
                alt={`${alt} - Thumbnail ${index + 1}`}
                fill
                className="object-cover rounded-sm"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
