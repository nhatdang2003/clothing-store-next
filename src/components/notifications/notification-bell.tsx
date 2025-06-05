"use client";

import { Bell, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWebSocket } from "@/contexts/websocket-context";
import { cn } from "@/lib/utils";

export function NotificationBell() {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        isConnected,
    } = useWebSocket();

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'order_status':
                return '📦';
            case 'payment':
                return '💳';
            case 'promotion':
                return '🎉';
            default:
                return '🔔';
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className={cn(
                        "h-5 w-5",
                        isConnected ? "text-foreground" : "text-muted-foreground"
                    )} />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                    {/* Connection status indicator */}
                    <Circle
                        className={cn(
                            "absolute -bottom-1 -right-1 h-2 w-2 fill-current",
                            isConnected ? "text-green-500" : "text-red-500"
                        )}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Thông báo</span>
                    {notifications.length > 0 && (
                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={markAllAsRead}
                                    className="h-6 px-2 text-xs"
                                >
                                    Đánh dấu đã đọc
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearNotifications}
                                className="h-6 px-2 text-xs text-destructive"
                            >
                                Xóa tất cả
                            </Button>
                        </div>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Chưa có thông báo nào</p>
                    </div>
                ) : (
                    <ScrollArea className="h-96">
                        {notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={cn(
                                    "flex items-start gap-3 p-3 cursor-pointer",
                                    !notification.read && "bg-muted/50"
                                )}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="text-lg flex-shrink-0 mt-0.5">
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-medium text-sm truncate">
                                            {notification.title}
                                        </p>
                                        {!notification.read && (
                                            <Circle className="h-2 w-2 fill-current text-blue-500 flex-shrink-0 ml-2" />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatTimeAgo(notification.createdAt)}
                                    </p>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </ScrollArea>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 