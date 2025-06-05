"use client";

import { useEffect, useState } from 'react';
import { WebSocketProvider } from '@/contexts/websocket-context';
import { WebSocketEvents } from './websocket-events';

interface ClientWebSocketProviderProps {
    children: React.ReactNode;
}

export function ClientWebSocketProvider({ children }: ClientWebSocketProviderProps) {
    const [userId, setUserId] = useState<string | undefined>();

    useEffect(() => {
        // Lấy userId từ localStorage, cookies, hoặc authentication context
        const getUserId = () => {
            try {
                // Ví dụ: lấy từ localStorage
                const token = localStorage.getItem('token');
                if (token) {
                    // Decode JWT token để lấy userId
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    return payload.userId || payload.sub;
                }

                // Hoặc lấy từ cookie
                // const cookies = document.cookie.split(';');
                // const userIdCookie = cookies.find(cookie => cookie.trim().startsWith('userId='));
                // return userIdCookie?.split('=')[1];

                return undefined;
            } catch (error) {
                console.error('Error getting userId:', error);
                return undefined;
            }
        };

        setUserId(getUserId());

        // Listen for auth changes
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token') {
                setUserId(getUserId());
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <WebSocketProvider userId={userId}>
            <WebSocketEvents />
            {children}
        </WebSocketProvider>
    );
} 