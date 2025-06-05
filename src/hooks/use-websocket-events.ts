"use client";

import { useEffect } from 'react';
import { useWebSocket } from '@/contexts/websocket-context';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export function useWebSocketEvents() {
    const { isConnected, sendMessage, publishToTopic, sendToQueue } = useWebSocket();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Xử lý các events WebSocket
    useEffect(() => {
        if (!isConnected) return;

        // Listen for order updates
        const handleOrderUpdate = (data: any) => {
            // Invalidate order queries to refetch data
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order', data.orderId] });

            // Show notification
            toast({
                title: 'Cập nhật đơn hàng',
                description: `Đơn hàng #${data.orderCode} đã được cập nhật`,
            });
        };

        // Listen for payment updates
        const handlePaymentUpdate = (data: any) => {
            // Invalidate payment queries
            queryClient.invalidateQueries({ queryKey: ['payments'] });

            // Show notification based on payment status
            const message = data.status === 'success'
                ? 'Thanh toán thành công'
                : 'Thanh toán thất bại';

            toast({
                title: 'Cập nhật thanh toán',
                description: message,
                variant: data.status === 'success' ? 'default' : 'destructive',
            });
        };

        // Listen for review updates
        const handleReviewUpdate = (data: any) => {
            // Invalidate review queries
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            queryClient.invalidateQueries({ queryKey: ['review-order', data.orderId] });
        };

        // Listen for return request updates
        const handleReturnUpdate = (data: any) => {
            // Invalidate return queries
            queryClient.invalidateQueries({ queryKey: ['returned-orders'] });
            queryClient.invalidateQueries({ queryKey: ['returned-order', data.orderId] });

            toast({
                title: 'Cập nhật yêu cầu hoàn trả',
                description: `Yêu cầu hoàn trả #${data.orderCode} đã được ${data.status === 'approved' ? 'chấp nhận' : 'từ chối'}`,
            });
        };

        // You can add more event handlers here
        // Note: Actual event listening would be handled in the WebSocket context
        // This is just for demonstration of how to structure event handling

    }, [isConnected, toast]);

    // Helper functions to send messages using STOMP
    const sendOrderStatusRequest = (orderId: string) => {
        sendMessage('/app/order-status', {
            type: 'request_order_status',
            orderId,
        });
    };

    const sendJoinRoom = (roomId: string) => {
        sendMessage('/app/join-room', {
            type: 'join_room',
            roomId,
        });
    };

    const sendLeaveRoom = (roomId: string) => {
        sendMessage('/app/leave-room', {
            type: 'leave_room',
            roomId,
        });
    };

    // New STOMP-specific helper functions
    const subscribeToOrderUpdates = (userId: string) => {
        // This would be handled automatically by the context
        console.log(`Subscribed to order updates for user ${userId}`);
    };

    const publishSystemNotification = (message: any) => {
        publishToTopic('system-notifications', message);
    };

    const sendDirectMessage = (userId: string, message: any) => {
        sendToQueue(`notifications/${userId}`, message);
    };

    return {
        isConnected,
        sendOrderStatusRequest,
        sendJoinRoom,
        sendLeaveRoom,
        subscribeToOrderUpdates,
        publishSystemNotification,
        sendDirectMessage,
    };
} 