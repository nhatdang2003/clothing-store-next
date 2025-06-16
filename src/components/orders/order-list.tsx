"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Pagination } from "@/components/shared/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    formatPrice,
    getColorText,
    getStatusCashBackColor,
    getStatusCashBackText,
    getStatusColor,
    getStatusReturnColor,
    getStatusReturnText,
    getStatusText,
} from "@/lib/utils";
import { orderApi } from "@/services/order.api";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, RotateCcw, Star, X, Upload, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { ProductReviewModal } from "../modal/product-review-modal";
import { useOrders, useCancelOrder, useReturnOrder } from "@/hooks/use-order-query";
import { ReturnedOrderDialog } from "../modal/returned-order-dialog";
import { OrderDetailModal } from "../modal/detail-order-dialog";
import { format, addDays, isAfter, isBefore } from "date-fns";

interface LineItem {
    id: number;
    productName: string;
    color: string;
    size: string;
    variantImage: string;
    quantity: number;
    unitPrice: number;
    discount: number;
}

interface Order {
    id: number;
    code: string;
    orderDate: string;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    lineItems: LineItem[];
    total: number;
    shippingFee: number;
    discount: number;
    finalTotal: number;
    canReview: boolean;
    isReviewed: boolean;
    statusUpdateTimestamp: Date;
    returnRequestStatus: string;
    cashBackStatus: string;
}

interface ApiResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: {
        meta: {
            page: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        data: Order[];
    };
}

export default function OrderList() {
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "6";
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";
    const { data: orders, isLoading, error: ordersError } = useOrders({
        page: parseInt(page),
        size: parseInt(size),
        status,
        search,
    });
    console.log(orders);
    const { mutate: cancelOrder } = useCancelOrder();

    // State for cancel order dialog
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string>("");
    const [cancelReason, setCancelReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [showReturnDialog, setShowReturnDialog] = useState(false);
    const [returnReason, setReturnReason] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountHolderName, setAccountHolderName] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

    const { mutate: returnOrder } = useReturnOrder();

    // Predefined cancel reasons
    const cancelReasons = [
        "Thay đổi ý định mua hàng",
        "Tìm được sản phẩm tốt hơn với giá rẻ hơn",
        "Đặt nhầm sản phẩm",
        "Không còn nhu cầu sử dụng",
        "Thời gian giao hàng quá lâu",
        "Muốn thay đổi địa chỉ giao hàng",
        "Khác"
    ];

    // Handle opening cancel dialog
    const handleOpenCancelDialog = (orderId: string) => {
        setSelectedOrderId(orderId);
        setCancelReason("");
        setCustomReason("");
        setShowCancelDialog(true);
    };

    const handleOpenReturnDialog = (orderId: string) => {
        setSelectedOrderId(orderId);
        setReturnReason("");
        setBankName("");
        setAccountNumber("");
        setAccountHolderName("");
        setImageUrls([]);
        setSelectedFiles([]);
        setShowReturnDialog(true);
    };

    const handleConfirmReturn = async () => {
        try {
            setIsUploading(true);

            // Upload images first if any files are selected
            let uploadedImageUrls: string[] = [];

            if (selectedFiles.length > 0) {

                // Upload each file
                uploadedImageUrls = await Promise.all(
                    selectedFiles.map(async (file) => {
                        try {
                            // Get presigned URL
                            const { signedUrl } = await orderApi.getPresignedUrl(file.name);

                            // Upload file to Google Storage
                            await orderApi.uploadImage(signedUrl, file);

                            // Return the final URL (without query params)
                            return signedUrl.split("?")[0];
                        } catch (error) {
                            console.error(`Error uploading ${file.name}:`, error);
                            throw new Error(`Không thể upload ảnh ${file.name}`);
                        }
                    })
                );
            }

            const returnData = {
                orderId: parseInt(selectedOrderId),
                reason: returnReason,
                bankName: bankName,
                accountNumber: accountNumber,
                accountHolderName: accountHolderName,
                imageUrls: uploadedImageUrls
            };

            // Call return order API
            returnOrder(returnData);

            // Reset form and close dialog
            setShowReturnDialog(false);
            setReturnReason("");
            setBankName("");
            setAccountNumber("");
            setAccountHolderName("");

            // Clean up object URLs to prevent memory leaks
            imageUrls.forEach(url => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });

            setImageUrls([]);
            setSelectedFiles([]);
            setSelectedOrderId("");

        } catch (error: any) {
            console.error("Return order error:", error);
            toast({
                title: "Lỗi",
                description: error.message || "Đã có lỗi xảy ra khi gửi yêu cầu hoàn trả",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    // Toggle expand/collapse order items
    const toggleOrderExpansion = (orderId: number) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    // Handle confirming cancel order
    const handleConfirmCancel = () => {
        const finalReason = cancelReason === "Khác" ? customReason : cancelReason;

        if (!finalReason.trim()) {
            toast({
                title: "Lỗi",
                description: "Vui lòng chọn hoặc nhập lý do hủy đơn hàng",
                variant: "destructive",
            });
            return;
        }

        cancelOrder({
            orderId: selectedOrderId,
            reason: finalReason
        });

        setShowCancelDialog(false);
        setCancelReason("");
        setCustomReason("");
        setSelectedOrderId("");
    };

    // Lấy thông tin pagination từ meta
    const currentPage = orders?.meta?.page + 1; // Vì API trả về page bắt đầu từ 0
    const totalPages = orders?.meta?.pages;

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

    const continuePayment = async (id: string) => {
        try {
            const response = await orderApi.continuePayment(id);
            router.push(response.paymentUrl);
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Đã có lỗi xảy ra, vui lòng thử lại",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                    <Card key={index} className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                            <div>
                                <Skeleton className="h-4 w-[200px] mb-2" />
                                <Skeleton className="h-4 w-[150px]" />
                            </div>
                            <Skeleton className="h-6 w-[100px] rounded-full" />
                        </div>
                        <Skeleton className="h-[100px] w-full mb-4" />
                        <Skeleton className="h-8 w-[200px]" />
                    </Card>
                ))}
            </div>
        );
    }

    if (ordersError) {
        return (
            <div className="text-center py-4 text-red-500">
                <p>{ordersError.message}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                    Thử lại
                </Button>
            </div>
        );
    }

    if (!orders?.data || orders?.data?.length === 0) {
        return <div className="text-center py-4">Không có đơn hàng nào.</div>;
    }

    return (
        <div className="space-y-4">
            {orders?.data?.map((order: Order) => (
                <Card key={order.id} className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                        <div>
                            <div className="font-semibold">Mã đơn hàng: {order.code}</div>
                            <div className="text-sm text-muted-foreground">
                                Ngày đặt: {formatDate(order.orderDate)}
                            </div>
                        </div>
                        <Badge
                            variant="secondary"
                            className={`rounded-full ${order.status === "RETURNED" && order.returnRequestStatus !== "APPROVED"
                                ? getStatusReturnColor(order.returnRequestStatus)
                                : order.returnRequestStatus === "APPROVED"
                                    ? getStatusCashBackColor(order.cashBackStatus)
                                    : getStatusColor(order.status)}`}
                        >
                            {order.status === "RETURNED" && order.returnRequestStatus !== "APPROVED"
                                ? getStatusReturnText(order.returnRequestStatus)
                                : order.returnRequestStatus === "APPROVED"
                                    ? getStatusCashBackText(order.cashBackStatus)
                                    : getStatusText(order.status)}
                        </Badge>
                    </div>
                    {(() => {
                        const isExpanded = expandedOrders.has(order.id);
                        const hasMultipleItems = order?.lineItems?.length > 1;
                        const itemsToShow = isExpanded ? order.lineItems : order.lineItems?.slice(0, 1) || [];

                        return (
                            <>
                                {itemsToShow.map((item: LineItem) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col sm:flex-row gap-4 py-4 border-t"
                                    >
                                        <Image
                                            src={item.variantImage}
                                            alt={item.productName}
                                            width={80}
                                            height={80}
                                            className="rounded-md object-cover self-center sm:self-start"
                                        />
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="font-medium mb-1">{item.productName}</h3>
                                            <div className="text-sm text-muted-foreground mb-2">
                                                Màu: {getColorText(item.color)}, Kích thước: {item.size}
                                            </div>
                                            <div className="text-sm">x{item.quantity}</div>
                                        </div>
                                        <div className="text-center sm:text-right mt-2 sm:mt-0">
                                            {item.discount > 0 ? (
                                                <>
                                                    <div className="font-medium text-red-600">
                                                        {formatPrice(item.unitPrice - item.discount)}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground line-through">
                                                        {formatPrice(item.unitPrice)}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="font-medium">
                                                    {formatPrice(item.unitPrice)}
                                                </div>
                                            )}
                                            <div className="text-sm font-semibold mt-1">
                                                Tổng:{" "}
                                                {formatPrice(
                                                    (item.unitPrice - item.discount) * item.quantity
                                                )}
                                            </div>
                                            {item.discount > 0 && (
                                                <div className="text-xs text-green-600">
                                                    Tiết kiệm: {formatPrice(item.discount * item.quantity)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {hasMultipleItems && (
                                    <div className="border-t">
                                        <Button
                                            variant="ghost"
                                            onClick={() => toggleOrderExpansion(order.id)}
                                            className="w-full text-sm text-gray-400 hover:text-black hover:bg-gray-100 flex items-center justify-center gap-2"
                                        >
                                            {isExpanded ? (
                                                <>
                                                    <ChevronUp className="h-4 w-4" />
                                                    Thu gọn
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="h-4 w-4" />
                                                    Xem thêm {order.lineItems.length - 1} sản phẩm khác
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                    <div className="border-t pt-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                            <div className="text-sm text-muted-foreground">
                                {order?.lineItems?.length} sản phẩm
                            </div>
                            <div className="text-center sm:text-right">
                                <div className="text-sm text-muted-foreground">
                                    Tổng tiền hàng: {formatPrice(order.total)}
                                </div>
                                {order.discount > 0 && (
                                    <div className="text-sm text-green-600">
                                        Tiết kiệm: -{formatPrice(order.discount)}
                                    </div>
                                )}
                                {order.shippingFee > 0 && (
                                    <div className="text-sm text-muted-foreground">
                                        Phí vận chuyển: {formatPrice(order.shippingFee)}
                                    </div>
                                )}
                                <div className="text-lg font-medium mt-1">
                                    Tổng số tiền: {formatPrice(order.finalTotal)}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm">
                                <span className="text-muted-foreground">
                                    Phương thức thanh toán:{" "}
                                </span>
                                <span>{order.paymentMethod}</span>
                            </div>
                            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                                {order.status === "PENDING" && (
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                        onClick={() => handleOpenCancelDialog(order.id.toString())}
                                    >
                                        <X className="h-6 w-6 mr-2" />
                                        Hủy đơn hàng
                                    </Button>
                                )}
                                {order.status === "DELIVERED" &&
                                    isBefore(new Date(), addDays(order.statusUpdateTimestamp, 29)) && (
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto"
                                            onClick={() => handleOpenReturnDialog(order.id.toString())}
                                        >
                                            <RotateCcw className="h-6 w-6 mr-2" />
                                            Hoàn trả
                                        </Button>
                                    )}
                                {order.status === "RETURNED"
                                    ? (
                                        <ReturnedOrderDialog orderId={order.id.toString()} />
                                    ) : (
                                        <OrderDetailModal orderId={order.id.toString()} />
                                    )}
                                {order.paymentMethod === "VNPAY" &&
                                    order.paymentStatus === "PENDING" && (
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto"
                                            onClick={() => continuePayment(order.id.toString())}
                                        >
                                            <CreditCard className="h-6 w-6 mr-2" />
                                            Tiếp tục thanh toán
                                        </Button>
                                    )}
                                {(order.canReview || order.isReviewed) && order.status !== "RETURNED" && (
                                    <ProductReviewModal orderId={order.id.toString()} type={order.isReviewed ? "update" : "create"} />
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                className="mt-8"
            />

            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Hủy đơn hàng</DialogTitle>
                        <DialogDescription>
                            Vui lòng chọn lý do hủy đơn hàng. Việc hủy đơn hàng sẽ không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Chọn lý do hủy đơn hàng</Label>
                            <RadioGroup
                                value={cancelReason}
                                onValueChange={setCancelReason}
                                className="space-y-2"
                            >
                                {cancelReasons.map((reason) => (
                                    <div key={reason} className="flex items-center space-x-2">
                                        <RadioGroupItem value={reason} id={reason} />
                                        <Label htmlFor={reason} className="cursor-pointer">{reason}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        {cancelReason === "Khác" && (
                            <div className="space-y-2">
                                <Label htmlFor="customReason" className="text-sm font-medium">
                                    Nhập lý do cụ thể
                                </Label>
                                <Textarea
                                    id="customReason"
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    placeholder="Vui lòng nhập lý do hủy đơn hàng..."
                                    className="min-h-[80px]"
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmCancel}
                            disabled={!cancelReason || (cancelReason === "Khác" && !customReason.trim())}
                        >
                            Xác nhận hủy đơn hàng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Hoàn trả đơn hàng</DialogTitle>
                        <DialogDescription>
                            Vui lòng điền đầy đủ thông tin để chúng tôi có thể xử lý yêu cầu hoàn trả của bạn.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Lý do hoàn trả */}
                        <div className="space-y-2">
                            <Label htmlFor="returnReason" className="text-sm font-medium">
                                Lý do hoàn trả <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="returnReason"
                                value={returnReason}
                                onChange={(e) => setReturnReason(e.target.value)}
                                placeholder="Vui lòng nhập lý do hoàn trả đơn hàng..."
                                className="min-h-[80px] resize-none"
                                rows={3}
                            />
                        </div>

                        {/* Thông tin ngân hàng */}
                        <div className="space-y-4 border-t pt-4">
                            <Label className="text-sm font-medium">Thông tin tài khoản hoàn tiền</Label>

                            <div className="space-y-2">
                                <Label htmlFor="bankName" className="text-sm font-medium">
                                    Tên ngân hàng <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="bankName"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    placeholder="VD: Vietcombank, Techcombank, VietinBank..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accountNumber" className="text-sm font-medium">
                                    Số tài khoản <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="accountNumber"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    placeholder="Nhập số tài khoản ngân hàng"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accountHolderName" className="text-sm font-medium">
                                    Tên chủ tài khoản <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="accountHolderName"
                                    value={accountHolderName}
                                    onChange={(e) => setAccountHolderName(e.target.value)}
                                    placeholder="Nhập tên chủ tài khoản (theo CMND/CCCD)"
                                />
                            </div>
                        </div>

                        {/* Upload hình ảnh */}
                        <div className="space-y-4 border-t pt-4">
                            <Label className="text-sm font-medium">
                                Hình ảnh sản phẩm (tuỳ chọn)
                            </Label>
                            <div className="space-y-2">
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click để upload</span>
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PNG, JPG hoặc JPEG (MAX. 5MB mỗi file)
                                            </p>
                                        </div>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            className="hidden"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                if (files.length > 0) {
                                                    // Validate file type and size
                                                    const validFiles = files.filter(file => {
                                                        // Check if file is an image
                                                        if (!file.type.startsWith('image/')) {
                                                            toast({
                                                                title: "Lỗi",
                                                                description: `File "${file.name}" không phải là hình ảnh. Vui lòng chọn file PNG, JPG hoặc JPEG.`,
                                                                variant: "destructive",
                                                            });
                                                            return false;
                                                        }

                                                        // Check file size (5MB max per file)
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

                                                    // Create preview URLs
                                                    const newUrls: string[] = [];
                                                    validFiles.forEach(file => {
                                                        const url = URL.createObjectURL(file);
                                                        newUrls.push(url);
                                                    });

                                                    // Update states
                                                    setSelectedFiles(prev => [...prev, ...validFiles]);
                                                    setImageUrls(prev => [...prev, ...newUrls]);
                                                }

                                                // Reset input value to allow selecting same files again
                                                e.target.value = '';
                                            }}
                                        />
                                    </label>
                                </div>

                                {imageUrls.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {imageUrls.map((url, index) => (
                                            <div key={index} className="relative group">
                                                <div className="relative w-full h-24 rounded-md overflow-hidden border border-gray-200">
                                                    <Image
                                                        src={url}
                                                        alt={`Upload ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        // Revoke object URL to prevent memory leaks
                                                        URL.revokeObjectURL(url);

                                                        // Remove from both arrays
                                                        setImageUrls(prev => prev.filter((_, i) => i !== index));
                                                        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                                <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                                    {selectedFiles[index]?.name.length > 15
                                                        ? selectedFiles[index]?.name.substring(0, 15) + '...'
                                                        : selectedFiles[index]?.name
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {imageUrls.length > 0 && (
                                    <div className="text-xs text-gray-500 mt-2">
                                        Đã chọn {imageUrls.length} ảnh
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowReturnDialog(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmReturn}
                            disabled={
                                isUploading ||
                                !returnReason.trim() ||
                                !bankName.trim() ||
                                !accountNumber.trim() ||
                                !accountHolderName.trim()
                            }
                        >
                            {isUploading ? "Đang xử lý..." : "Xác nhận hoàn trả đơn hàng"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
