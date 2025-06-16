"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, Printer, Truck, CreditCard, MessageSquare, ImageIcon, MapPin, Package } from "lucide-react";
import { ImageViewer } from "@/components/ui/image-viewer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    getStatusColor,
    getStatusText,
    getPaymentMethodText,
    getPaymentStatusText,
    getColorText,
    formatPrice,
    getShippingMethodText,
    getStatusCashBackText,
    getStatusReturnText,
    getStatusCashBackColor,
    getStatusReturnColor,
} from "@/lib/utils";
import { useGetReturnedOrderById } from "@/hooks/use-order-query";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { STATUS_ORDER } from "@/constants/order";

interface ReturnedOrderDialogProps {
    orderId: string;
}

export function ReturnedOrderDialog({
    orderId,
}: ReturnedOrderDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const { data: order, isLoading } = useGetReturnedOrderById(orderId);

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

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setIsImageViewerOpen(true);
    };

    const OrderSkeleton = () => (
        <div className="space-y-6 p-4 sm:p-6">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-24" />
            </div>

            <div className="grid sm:grid-cols-2 gap-6 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-4">
                    <Skeleton className="h-5 w-40" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-5 w-40" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            </div>

            {[1, 2].map((item) => (
                <div key={item} className="flex gap-4 py-4 border-t">
                    <Skeleton className="h-20 w-20 rounded-md" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="w-24 space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            ))}

            <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <div className="space-y-2 text-right">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-40" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            // Prevent closing if ImageViewer is open
            if (!open && isImageViewerOpen) {
                return; // Don't close the modal if ImageViewer is open
            }
            setIsOpen(open);
        }}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                >
                    <Eye className="h-6 w-6 mr-2" />
                    Xem chi tiết
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-4 py-2 sm:px-6 sm:py-4 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg sm:text-xl">
                            Chi tiết yêu cầu hoàn trả
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 max-h-[90vh] overflow-auto">
                    {isLoading ? (
                        <OrderSkeleton />
                    ) : order ? (
                        <div className="p-4 sm:p-6 space-y-6">
                            {/* Return Request Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div>
                                    <div className="font-semibold text-lg">Yêu cầu hoàn trả #{order.orderCode}</div>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <div>Ngày tạo yêu cầu: {formatDate(order.createdAt)}</div>
                                        {order.orderDetails && (
                                            <div>Ngày đặt hàng: {formatDate(order.orderDetails.orderDate)}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Badge
                                        variant="secondary"
                                        className={`rounded-full justify-center ${order.status === "APPROVED"
                                            ? getStatusCashBackColor(order.cashBackStatus)
                                            : getStatusReturnColor(order.status)}`}
                                    >
                                        {order.status === "APPROVED"
                                            ? getStatusCashBackText(order.cashBackStatus)
                                            : getStatusReturnText(order.status)}
                                    </Badge>
                                </div>
                            </div>

                            {/* Order Details Grid */}
                            <div className="grid sm:grid-cols-2 gap-6 p-4 bg-muted/50 rounded-lg">
                                <div>
                                    <h3 className="font-semibold mb-2">Thông tin đơn hàng</h3>
                                    <div className="space-y-1 text-sm">
                                        <p>
                                            Phương thức thanh toán:{" "}
                                            {getPaymentMethodText(order.orderDetails.paymentMethod)}
                                        </p>
                                        <p>
                                            Trạng thái thanh toán:{" "}
                                            {getPaymentStatusText(order.orderDetails.paymentStatus)}
                                        </p>
                                        {order.orderDetails.paymentDate && (
                                            <p>Ngày thanh toán: {formatDate(order.orderDetails.paymentDate)}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Thông tin giao hàng</h3>
                                    <div className="space-y-1 text-sm">
                                        <p className="font-medium">
                                            {order.orderDetails.shippingProfile.lastName}{" "}
                                            {order.orderDetails.shippingProfile.firstName}
                                        </p>
                                        <p>Số điện thoại: {order.orderDetails.shippingProfile.phoneNumber}</p>
                                        <p>
                                            Địa chỉ:{" "}
                                            {`${order.orderDetails.shippingProfile.address}, ${order.orderDetails.shippingProfile.ward}, ${order.orderDetails.shippingProfile.district}, ${order.orderDetails.shippingProfile.province}`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Return Request Details Grid */}
                            <div className="grid sm:grid-cols-2 gap-6 p-4 bg-muted/50 rounded-lg">
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Thông tin hoàn trả
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="font-medium">Lý do hoàn trả:</span>
                                            <div className="mt-1 text-muted-foreground bg-white p-2 rounded border">
                                                {order.reason}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        Thông tin hoàn tiền
                                    </h3>
                                    <div className="space-y-1 text-sm">
                                        <div>
                                            <span className="font-medium">Ngân hàng:</span> {order.bankName}
                                        </div>
                                        <div>
                                            <span className="font-medium">Số tài khoản:</span> {order.accountNumber}
                                        </div>
                                        <div>
                                            <span className="font-medium">Chủ tài khoản:</span> {order.accountHolderName}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Comment */}
                            {order.adminComment && (
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="font-semibold mb-2 text-blue-800">Phản hồi của cửa hàng</h3>
                                    <div className="text-sm text-blue-700">{order.adminComment}</div>
                                </div>
                            )}

                            {/* Images */}
                            {order.imageUrls && order.imageUrls.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4" />
                                        Hình ảnh đính kèm ({order.imageUrls.length})
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {order.imageUrls.map((imageUrl: string, index: number) => (
                                            <div
                                                key={index}
                                                className="relative group cursor-pointer"
                                                onClick={() => handleImageClick(index)}
                                            >
                                                <Image
                                                    src={imageUrl}
                                                    alt={`Hình ảnh ${index + 1}`}
                                                    width={150}
                                                    height={150}
                                                    className="rounded-md object-cover w-full h-24 sm:h-32 border transition-transform duration-200 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-md flex items-center justify-center">
                                                    <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Order Items */}
                            <div>
                                <div className="space-y-4">
                                    {order.orderDetails?.lineItems?.map((item: any) => (
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
                                                <h4 className="font-medium mb-1">{item.productName}</h4>
                                                <div className="text-sm text-muted-foreground mb-2">
                                                    Màu: {getColorText(item.color)}, Kích thước: {item.size}
                                                </div>
                                                <div className="text-sm">x{item.quantity}</div>
                                            </div>
                                            <div className="text-center sm:text-right">
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
                                                        Tiết kiệm:{" "}
                                                        {formatPrice(item.discount * item.quantity)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t pt-4">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-muted-foreground">
                                        {order.orderDetails.lineItems.length} sản phẩm
                                    </div>
                                    <div className="text-center sm:text-right">
                                        <div className="text-sm text-muted-foreground">
                                            Tổng tiền hàng: {formatPrice(order.orderDetails.total)}
                                        </div>
                                        {order.orderDetails.discount > 0 && (
                                            <div className="text-sm text-green-600">
                                                Tiết kiệm: -{formatPrice(order.orderDetails.discount)}
                                            </div>
                                        )}
                                        {order.orderDetails.shippingFee > 0 && (
                                            <div className="text-sm text-muted-foreground">
                                                Phí vận chuyển: {formatPrice(order.orderDetails.shippingFee)}
                                            </div>
                                        )}
                                        <div className="text-lg font-medium mt-1">
                                            Tổng tiền hoàn trả: {formatPrice(order.orderDetails.finalTotal)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 text-center text-muted-foreground">
                            Không tìm thấy thông tin đơn hàng
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>

            {/* Image Viewer - Rendered outside dialog */}
            {order?.imageUrls && order.imageUrls.length > 0 && (
                <ImageViewer
                    images={order.imageUrls}
                    initialIndex={selectedImageIndex}
                    isOpen={isImageViewerOpen}
                    onClose={() => setIsImageViewerOpen(false)}
                />
            )}
        </Dialog>
    );
}
