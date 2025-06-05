"use client";

import { useEffect } from 'react';
import { useWebSocketEvents } from '@/hooks/use-websocket-events';

export function WebSocketEvents() {
    // This component just initializes the WebSocket events
    useWebSocketEvents();

    return null; // This component doesn't render anything
} 