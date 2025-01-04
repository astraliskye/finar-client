import { createContext, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import useAuth from "./useAuth";

const websocketUrl = import.meta.env.PROD
    ? "wss://skyegibney.com"
    : "";

type WebSocketContext = {
    send: (message: { gameId?: number, lobbyId?: number, type: string, data?: any }) => void,
    setMessageCallback: (messageCallback: (message: MessageEvent) => void) => void,
    connected: boolean
}

export const WebSocketContext = createContext<WebSocketContext>({
    send: () => { },
    setMessageCallback: () => { },
    connected: false
});

type WebSocketProviderProps = {
    children: ReactNode
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
    const socketRef = useRef<WebSocket | null>(null);
    const {
        loading: authLoading,
        error: authError
    } = useAuth();
    const [connected, setConnected] = useState(false);

    const connect = useCallback(() => {
        if (socketRef.current === null && !authLoading && !authError) {
            let intervalId = 0;

            const newSocket = new WebSocket(`${websocketUrl}/api/ws`);

            newSocket.onopen = () => {
                setInterval(() => {
                    newSocket.send(JSON.stringify({ type: "heartbeat" }));
                }, 2000);
                setConnected(true);
            }

            newSocket.onclose = () => {
                clearInterval(intervalId);
                setConnected(false);
                connect();
            }

            newSocket.onerror = (error) => {
                console.error(error);
            }

            socketRef.current = newSocket;
        }
    }, [authLoading, authError]);

    useEffect(() => {
        connect();

        return () => {
            socketRef.current?.close();
        };
    }, [authLoading, authError]);

    return (
        <WebSocketContext.Provider value={{
            send: (message) => {
                if (socketRef.current) {
                    socketRef.current.send(JSON.stringify(message));
                }
            },
            setMessageCallback: (messageCallback: (message: MessageEvent) => void) => {
                if (socketRef.current) {
                    socketRef.current.onmessage = messageCallback
                }
            },
            connected
        }}>
            {children}
        </WebSocketContext.Provider >
    )
}

export default WebSocketProvider;
