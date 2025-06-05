"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import SockJS from 'sockjs-client';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';

export interface Notification {
    id: string;
    type: 'order_status' | 'payment' | 'promotion' | 'system';
    title: string;
    message: string;
    data?: any;
    createdAt: string;
    read: boolean;
}

interface WebSocketContextType {
    isConnected: boolean;
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (notificationId: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
    sendMessage: (destination: string, message: any, headers?: any) => void;
    publishToTopic: (topic: string, message: any) => void;
    sendToQueue: (queue: string, message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
    children: React.ReactNode;
    userId?: string;
}

export function WebSocketProvider({ children, userId }: WebSocketProviderProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const stompClient = useRef<Client | null>(null);
    const subscriptions = useRef<Map<string, StompSubscription>>(new Map());
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
    const { toast } = useToast();

    const connectWebSocket = () => {
        if (!userId) return;

        try {
            // Create STOMP client with SockJS
            const baseUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080';
            const sockJSUrl = `${baseUrl}/sockjs`;

            stompClient.current = new Client({
                webSocketFactory: () => new SockJS(sockJSUrl),
                connectHeaders: {
                    userId: userId,
                },
                debug: (str) => {
                    console.log('STOMP: ' + str);
                },
                reconnectDelay: 3000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });

            // Set up connection handlers
            stompClient.current.onConnect = (frame) => {
                console.log('STOMP connected:', frame);
                setIsConnected(true);

                // Clear any existing reconnect timeout
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                }

                // Subscribe to user-specific notifications
                subscribeToNotifications();
            };

            stompClient.current.onDisconnect = (frame) => {
                console.log('STOMP disconnected:', frame);
                setIsConnected(false);

                // Clear subscriptions
                subscriptions.current.clear();
            };

            stompClient.current.onStompError = (frame) => {
                console.error('STOMP error:', frame.headers['message'], frame.body);
                setIsConnected(false);
            };

            // Activate the client
            stompClient.current.activate();

        } catch (error) {
            console.error('Error connecting to STOMP:', error);
        }
    };

    const subscribeToNotifications = () => {
        if (!stompClient.current || !userId) return;

        // Subscribe to user-specific notification queue
        const notificationSubscription = stompClient.current.subscribe(
            `/queue/notifications/${userId}`,
            (message: IMessage) => {
                try {
                    const data = JSON.parse(message.body);
                    handleIncomingMessage(data);
                } catch (error) {
                    console.error('Error parsing notification message:', error);
                }
            }
        );
        subscriptions.current.set('notifications', notificationSubscription);

        // Subscribe to general topic notifications
        const topicSubscription = stompClient.current.subscribe(
            `/topic/notifications`,
            (message: IMessage) => {
                try {
                    const data = JSON.parse(message.body);
                    handleIncomingMessage(data);
                } catch (error) {
                    console.error('Error parsing topic message:', error);
                }
            }
        );
        subscriptions.current.set('topic', topicSubscription);

        // Subscribe to order updates for this user
        const orderSubscription = stompClient.current.subscribe(
            `/queue/orders/${userId}`,
            (message: IMessage) => {
                try {
                    const data = JSON.parse(message.body);
                    handleIncomingMessage(data);
                } catch (error) {
                    console.error('Error parsing order message:', error);
                }
            }
        );
        subscriptions.current.set('orders', orderSubscription);
    };

    const handleIncomingMessage = (data: any) => {
        switch (data.type) {
            case 'notification':
                const newNotification: Notification = {
                    id: data.id || Date.now().toString(),
                    type: data.notificationType || 'system',
                    title: data.title,
                    message: data.message,
                    data: data.data,
                    createdAt: data.createdAt || new Date().toISOString(),
                    read: false,
                };

                setNotifications(prev => [newNotification, ...prev]);

                // Show toast notification
                toast({
                    title: newNotification.title,
                    description: newNotification.message,
                    duration: 5000,
                });
                break;

            case 'order_update':
                // Xử lý cập nhật đơn hàng
                console.log('Order update:', data);
                break;

            case 'payment_update':
                // Xử lý cập nhật thanh toán
                console.log('Payment update:', data);
                break;

            default:
                console.log('Unknown message type:', data);
        }
    };

    const sendMessage = (destination: string, message: any, headers: any = {}) => {
        if (stompClient.current && stompClient.current.connected) {
            stompClient.current.publish({
                destination,
                body: JSON.stringify(message),
                headers,
            });
        } else {
            console.warn('STOMP client is not connected');
        }
    };

    const publishToTopic = (topic: string, message: any) => {
        sendMessage(`/topic/${topic}`, message);
    };

    const sendToQueue = (queue: string, message: any) => {
        sendMessage(`/queue/${queue}`, message);
    };

    const markAsRead = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId ? { ...notif, read: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(notif => !notif.read).length;

    useEffect(() => {
        if (userId) {
            connectWebSocket();
        }

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (stompClient.current) {
                // Unsubscribe from all subscriptions
                subscriptions.current.forEach((subscription) => {
                    subscription.unsubscribe();
                });
                subscriptions.current.clear();

                // Deactivate STOMP client
                stompClient.current.deactivate();
            }
        };
    }, [userId]);

    const value: WebSocketContextType = {
        isConnected,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        sendMessage,
        publishToTopic,
        sendToQueue,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
} 