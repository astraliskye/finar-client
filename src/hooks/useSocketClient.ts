import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const websocketUrl = import.meta.env.PROD
    ? "wss://skyegibney.com"
    : ""

export default function useSocketClient(
    endpoint: string,
    messageCallback: (message: MessageEvent) => void
) {
    const [connected, setConnected] = useState<boolean>(false);
    const wsRef = useRef<WebSocket | null>(null);
    const navigate = useNavigate();
    const { loading: authLoading, error: authError } = useAuth();

    useEffect(() => {
        if (!authLoading) {
            if (authError
                && window.location.pathname !== "/login"
                && window.location.pathname !== "/") {
                navigate(`/login?redirectTo=${window.location.pathname}`, {
                    replace: true
                });
            }

            if (wsRef.current === null) {
                let intervalId = 0;

                wsRef.current = new WebSocket(`${websocketUrl}/api${endpoint}`);

                wsRef.current.onopen = () => {
                    setInterval(() => {
                        wsRef.current?.send(JSON.stringify({type: "heartbeat"}));
                    }, 2000);

                    setConnected(true);
                }

                wsRef.current.onclose = () => {
                    clearInterval(intervalId);
                    setConnected(false);
                }

                wsRef.current.onmessage = messageCallback;
            }
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        }
    }, [authLoading]);

    return {
        connected,
        send: (data: any) => {
            if (wsRef.current && connected) {
                wsRef.current.send(JSON.stringify(data));
            }
        }
    }
}
