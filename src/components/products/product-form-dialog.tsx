"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Image, Loader2 } from "lucide-react";
import { ImageUpload } from "./image-upload";
import { imageApi } from "@/services/image.api";
import { ProductData } from "@/types/product";
import { toast, useToast } from "@/hooks/use-toast";
import { Size, COLOR } from "@/constants/product";
import { categoryApi } from "@/services/category.api";

interface Category {
  id: number;
  name: string;
}

interface Variant {
  id?: number;
  color: string;
  size: string;
  quantity: number;
  differencePrice: number;
  images: string[];
}

interface ProductFormData {
  id?: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  isFeatured: boolean;
  images: string[];
  variants: Variant[];
}

// Assume we have a list of categories from an API or context
const categories: Category[] = [
  {
    id: 1,
    name: "Áo Cardigan & Áo len",
  },
  {
    id: 2,
    name: "Áo khoác & Áo khoác dài",
  },
  {
    id: 3,
    name: "Áo sơ mi & Áo kiểu",
  },
  {
    id: 4,
    name: "Quần Jeans",
  },
  {
    id: 5,
    name: "Chân váy",
  },
  {
    id: 6,
    name: "Áo nỉ & Áo hoodie",
  },
  {
    id: 7,
    name: "Blazer & Áo Ghile Nữ",
  },
  {
    id: 8,
    name: "Quần Short",
  },
  {
    id: 9,
    name: "Quần áo Basic",
  },
  {
    id: 10,
    name: "Đồ ngủ",
  },
];

// Chuyển đổi enum Size thành array options
const sizeOptions = Object.keys(Size)
  .filter((key) => isNaN(Number(key))) // Lọc bỏ các key là số
  .map((key) => ({
    value: key,
    label: key,
  }));

interface ProductFormDialogProps {
  mode: "add" | "edit";
  product?: ProductData;
  onSubmit: (data: ProductData) => Promise<void>;
  addProductMutation: any;
  updateProductMutation: any;
}

// Thêm interface cho uploaded image
interface UploadedImage {
  file?: File;
  preview: string;
  url?: string;
}

export function ProductFormDialog({
  mode,
  product,
  onSubmit,
  addProductMutation,
  updateProductMutation,
}: ProductFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    product?.images.map((url) => ({ preview: url, url })) || []
  );
  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ProductData>({
    defaultValues: product || {
      id: 0,
      name: "",
      description: "",
      price: 0,
      categoryId: 0,
      isFeatured: false,
      images: [],
      variants: [
        { color: "", size: "", quantity: 0, differencePrice: 0, images: [] },
      ],
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const handleImagesUploaded = (newImages: UploadedImage[]) => {
    setUploadedImages(newImages);
    // Chỉ lấy URL hoặc preview string
    setValue(
      "images",
      newImages.map((img) => img.url || img.preview)
    );
  };

  const handleFormSubmit = async (data: ProductData) => {
    try {
      // Upload new images if they have file property
      const newImageUrls = await Promise.all(
        uploadedImages
          .filter((img) => img.file) // Chỉ lấy những ảnh mới (có file)
          .map(async (img) => {
            const fileName = `${img.file!.name}`;
            const { signedUrl } = await imageApi.getPresignedUrl(fileName);
            const uploadResponse = await imageApi.uploadImage(
              signedUrl,
              img.file!
            );
            return uploadResponse.url.split("?")[0];
          })
      );

      // Combine existing URLs with new URLs
      const finalImages = [
        ...uploadedImages.filter((img) => img.url).map((img) => img.url!),
        ...newImageUrls,
      ];
      console.log(finalImages);

      const finalProductData = {
        ...data,
        id: mode === "add" ? 0 : data.id,
        images: finalImages,
        variants: data.variants.map((variant) => ({
          ...variant,
          id: mode === "add" ? 0 : variant.id,
          // Lọc images từ finalImages dựa trên những ảnh đã chọn trong variant
          images: variant.images.map((img: any) => {
            // Tìm ảnh tương ứng trong finalImages
            console.log(img.file?.name?.split(".")[0]);
            const finalImage = finalImages.find((final) =>
              final.includes(img.file?.name?.split(".")[0])
            );
            return finalImage || "";
          }),
        })),
      };

      await onSubmit(finalProductData);
      setIsOpen(false);
      reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error?.message || "Đã có lỗi xảy ra",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={mode === "add" ? "default" : "outline"}>
          {mode === "add" ? "Thêm sản phẩm" : "Chỉnh sửa"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          <div>
            <Label htmlFor="name">Tên sản phẩm</Label>
            <Input
              id="name"
              {...register("name", { required: "Vui lòng nhập tên sản phẩm" })}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...register("description", {
                required: "Vui lòng nhập mô tả sản phẩm",
              })}
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Giá</Label>
            <Input
              id="price"
              type="number"
              {...register("price", { required: "Vui lòng nhập giá", min: 0 })}
            />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Danh mục</Label>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "Vui lòng chọn danh mục" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-red-500">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isFeatured" {...register("isFeatured")} />
            <Label htmlFor="isFeatured">Sản phẩm nổi bật</Label>
          </div>

          <div>
            <Label>Hình ảnh sản phẩm</Label>
            <ImageUpload
              onImagesUploaded={handleImagesUploaded}
              existingImages={product?.images || []}
            />
          </div>

          <div className="flex flex-col">
            <Label>Biến thể</Label>
            {variantFields.map((field, index) => (
              <div key={field.id} className="border p-4 mt-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`variants.${index}.color`}>Màu sắc</Label>
                    <Controller
                      name={`variants.${index}.color`}
                      control={control}
                      rules={{ required: "Vui lòng chọn màu sắc" }}
                      render={({ field: { onChange, value } }) => (
                        <Select value={value || ""} onValueChange={onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn màu sắc" />
                          </SelectTrigger>
                          <SelectContent>
                            {COLOR.map((color) => (
                              <SelectItem key={color.id} value={color.id}>
                                <div className="flex items-center">
                                  <div
                                    className="w-4 h-4 rounded-full mr-2"
                                    style={{ backgroundColor: color.hex }}
                                  />
                                  {color.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.variants?.[index]?.color && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.variants[index]?.color?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`variants.${index}.size`}>Kích thước</Label>
                    <Controller
                      name={`variants.${index}.size`}
                      control={control}
                      rules={{ required: "Vui lòng chọn kích thước" }}
                      render={({ field: { onChange, value } }) => (
                        <Select value={value || ""} onValueChange={onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn kích thước" />
                          </SelectTrigger>
                          <SelectContent>
                            {sizeOptions.map((size) => (
                              <SelectItem key={size.value} value={size.value}>
                                {size.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.variants?.[index]?.size && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.variants[index]?.size?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`variants.${index}.quantity`}>
                      Số lượng
                    </Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.quantity`, {
                        required: "Vui lòng nhập số lượng",
                        min: { value: 0, message: "Số lượng không được âm" },
                      })}
                    />
                    {errors.variants?.[index]?.quantity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.variants[index]?.quantity?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`variants.${index}.differencePrice`}>
                      Chênh lệch giá
                    </Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.differencePrice`, {
                        required: "Vui lòng nhập chênh lệch giá",
                      })}
                    />
                    {errors.variants?.[index]?.differencePrice && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.variants[index]?.differencePrice?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <Label>Hình ảnh</Label>
                  <Controller
                    name={`variants.${index}.images`}
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <Image className="mr-2 h-4 w-4" />
                            {field.value.length > 0
                              ? `Đã chọn ${field.value.length} ảnh`
                              : "Chọn ảnh"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid grid-cols-3 gap-2">
                            {uploadedImages.map((image: any, imgIndex) => {
                              console.log(image);
                              return (
                                <div
                                  key={imgIndex}
                                  className={`cursor-pointer border p-1 ${
                                    field.value.includes(image)
                                      ? "border-primary"
                                      : "border-gray-200"
                                  }`}
                                  onClick={() => {
                                    const newImages = field.value.includes(
                                      image
                                    )
                                      ? field.value.filter(
                                          (img: string) => img !== image
                                        )
                                      : [...field.value, image];
                                    field.onChange(newImages);
                                  }}
                                >
                                  <img
                                    src={image.preview}
                                    alt={`Ảnh biến thể ${imgIndex + 1}`}
                                    className="w-full h-20 object-cover"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeVariant(index)}
                  className="mt-4"
                >
                  Xóa
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                appendVariant({
                  id: 0,
                  color: "",
                  size: "",
                  quantity: 0,
                  differencePrice: 0,
                  images: [],
                })
              }
              className="mt-4"
            >
              Thêm
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              addProductMutation.isPending || updateProductMutation.isPending
            }
          >
            {addProductMutation.isPending || updateProductMutation.isPending ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </span>
            ) : mode === "add" ? (
              "Tạo sản phẩm"
            ) : (
              "Cập nhật"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
