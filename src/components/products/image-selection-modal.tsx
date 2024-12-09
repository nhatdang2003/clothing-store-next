import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  onSelect: (imageUrl: string) => void;
  selectedImage?: string;
}

export function ImageSelectionModal({
  isOpen,
  onClose,
  images,
  onSelect,
  selectedImage,
}: ImageSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Image for Variant</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="grid grid-cols-3 gap-2">
            {images.map((image, index) => (
              <Button
                key={index}
                variant="outline"
                className={`p-0 w-full aspect-square ${
                  image === selectedImage ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => onSelect(image)}
              >
                <img
                  src={image}
                  alt={`Variant ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
