import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
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
    console.log("WebSocketProvider");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const {
        loading: authLoading,
        error: authError
    } = useAuth();
    const [connected, setConnected] = useState(false);

    const connect = useCallback(() => {
        console.log("Running connect()", socket, authLoading, authError);
        if (socket === null && !authLoading && !authError) {
            console.log("Checks passed, continuing connection.");
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
                setSocket(null);
                setConnected(false);
                connect();
            }

            setSocket(newSocket);
        }
    }, [socket, authLoading, authError]);

    useEffect(() => {
        console.log("Running effect.");
        connect();

        return () => {
            socket?.close();
        };
    }, [authLoading, authError]);

    return (
        <WebSocketContext.Provider value={{
            send: (message) => {
                if (socket) {
                    socket.send(JSON.stringify(message));
                }
            },
            setMessageCallback: (messageCallback: (message: MessageEvent) => void) => {
                if (socket) {
                    socket.onmessage = messageCallback
                }
            },
            connected
        }}>
            {children}
        </WebSocketContext.Provider >
    )
}

export default WebSocketProvider;
