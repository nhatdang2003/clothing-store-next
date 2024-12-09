"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, X, ImageIcon } from "lucide-react";
import ProductPreview from "./product-preview";
import { ProductData, Variant } from "@/types/product";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageSelectionModal } from "./image-selection-modal";

interface ProductDialogProps {
  mode: "add" | "edit";
  initialData?: ProductData;
  onSubmit: (product: ProductData) => void;
}

export default function ProductDialog({
  mode,
  initialData,
  onSubmit,
}: ProductDialogProps) {
  const [product, setProduct] = useState<ProductData>({
    id: 0,
    name: "",
    description: "",
    price: 0,
    categoryId: 0,
    isFeatured: false,
    colorDefault: "",
    images: [],
    variants: [],
  });

  const [open, setOpen] = useState(false);
  const [imageSelectionOpen, setImageSelectionOpen] = useState(false);
  const [currentVariantIndex, setCurrentVariantIndex] = useState<number | null>(
    null
  );
  const [productImages, setProductImages] = useState<File[]>([]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setProduct(initialData);
    }
  }, [mode, initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setProduct((prev) => ({ ...prev, isFeatured: checked }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const addVariant = () => {
    const newVariant: Variant = {
      id: product.variants.length,
      color: "",
      size: "",
      quantity: 0,
      differencePrice: 0,
      images: [],
    };
    setProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));
  };

  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string | number
  ) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      ),
    }));
  };

  const removeVariant = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const removeImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    // Cập nhật lại mảng productImages nếu đang trong chế độ thêm mới
    if (mode === "add") {
      setProductImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(product);
    setOpen(false);
  };

  const openImageSelection = (variantIndex: number) => {
    setCurrentVariantIndex(variantIndex);
    setImageSelectionOpen(true);
  };

  const handleVariantImageSelect = (imageUrl: string) => {
    if (currentVariantIndex !== null) {
      updateVariant(currentVariantIndex, "images", imageUrl);
      setImageSelectionOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{mode === "add" ? "Thêm sản phẩm" : "Chỉnh sửa"}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="h-full max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {mode === "add" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-8 mt-6">
              {/* Thông tin cơ bản */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Tên sản phẩm</Label>
                    <Input
                      id="name"
                      name="name"
                      value={product.name}
                      onChange={handleInputChange}
                      className="h-10"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={product.description}
                      onChange={handleInputChange}
                      className="min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Giá (VNĐ)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={product.price}
                        onChange={handleInputChange}
                        className="h-10"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="categoryId">Danh mục</Label>
                      <Input
                        id="categoryId"
                        name="categoryId"
                        type="number"
                        value={product.categoryId}
                        onChange={handleInputChange}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="colorDefault">Màu mặc định</Label>
                      <Input
                        id="colorDefault"
                        name="colorDefault"
                        value={product.colorDefault}
                        onChange={handleInputChange}
                        className="h-10"
                      />
                    </div>

                    <div className="flex items-center space-x-2 self-end">
                      <Switch
                        id="isFeatured"
                        checked={product.isFeatured}
                        onCheckedChange={handleSwitchChange}
                      />
                      <Label htmlFor="isFeatured">Sản phẩm nổi bật</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hình ảnh sản phẩm */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hình ảnh sản phẩm</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="images">Tải lên hình ảnh</Label>
                    <Input
                      id="images"
                      name="images"
                      type="file"
                      multiple
                      onChange={handleImageUpload}
                      className="h-10"
                    />
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={image}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:text-white"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Biến thể sản phẩm */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Biến thể sản phẩm</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addVariant}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Thêm biến thể
                  </Button>
                </div>

                <div className="space-y-4">
                  {product.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Biến thể {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeVariant(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`color-${index}`}>Màu sắc</Label>
                          <Input
                            id={`color-${index}`}
                            value={variant.color}
                            onChange={(e) =>
                              updateVariant(index, "color", e.target.value)
                            }
                            className="h-10"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor={`size-${index}`}>Kích cỡ</Label>
                          <Input
                            id={`size-${index}`}
                            value={variant.size}
                            onChange={(e) =>
                              updateVariant(index, "size", e.target.value)
                            }
                            className="h-10"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor={`quantity-${index}`}>Số lượng</Label>
                          <Input
                            id={`quantity-${index}`}
                            type="number"
                            value={variant.quantity}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                            className="h-10"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor={`price-${index}`}>
                            Chênh lệch giá
                          </Label>
                          <Input
                            id={`price-${index}`}
                            type="number"
                            value={variant.differencePrice}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "differencePrice",
                                Number(e.target.value)
                              )
                            }
                            className="h-10"
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => openImageSelection(index)}
                        className="w-full mt-2"
                      >
                        {variant.images[0] ? (
                          <img
                            src={variant.images[0]}
                            alt="Selected"
                            className="w-6 h-6 object-cover rounded mr-2"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 mr-2" />
                        )}
                        Chọn hình ảnh
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                {mode === "add" ? "Tạo sản phẩm" : "Cập nhật"}
              </Button>
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
