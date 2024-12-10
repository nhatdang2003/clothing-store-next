"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface UploadedImage {
  file?: File;
  preview: string;
  url?: string;
}

interface ImageUploadProps {
  onImagesUploaded: (newImages: UploadedImage[]) => void;
  existingImages: string[];
}

export function ImageUpload({
  onImagesUploaded,
  existingImages = [],
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(() =>
    existingImages.map((url) => ({ preview: url, url }))
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      console.log(newImages);
      const updatedImages = [...uploadedImages, ...newImages];
      setUploadedImages(updatedImages);
      onImagesUploaded(updatedImages);
    },
    [uploadedImages, onImagesUploaded]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
  });

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    // Revoke object URL if it's a new image (has file but no url)
    if (newImages[index].file && !newImages[index].url) {
      URL.revokeObjectURL(newImages[index].preview);
    }
    newImages.splice(index, 1);
    setUploadedImages(newImages);
    onImagesUploaded(newImages);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        <p>Kéo thả ảnh vào đây, hoặc nhấp để chọn ảnh</p>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-4">
        {uploadedImages.map((image, index) => {
          console.log(image);
          return (
            <div key={index} className="relative">
              <img
                src={image.preview}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-0 right-0"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
