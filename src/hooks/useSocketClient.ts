import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const websocketUrl = import.meta.env.PROD
    ? "wss://skyegibney.com"
    : ""

export default function useSocketClient(endpoint: string,
    messageCallback: (message: MessageEvent) => void) {
    const [connected, setConnected] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const clientRef = useRef<WebSocket | null>(null);
    const navigate = useNavigate();

    const connect = useCallback(() => {
        if (clientRef.current === null) {
            let intervalId = -1;

            clientRef.current = new WebSocket(`${websocketUrl}/api${endpoint}`);

            clientRef.current.onopen = () => {
                console.log("socket open");
                setConnected(true);

                intervalId = setInterval(() => {
                    clientRef.current?.send(JSON.stringify({
                        type: "heartbeat"
                    }));
                }, 2000);
            }


            clientRef.current.onclose = () => {
                console.log("socket close");
                clearInterval(intervalId);
                setConnected(false);
            };

            clientRef.current.onerror = (event: Event) => {
                console.error("socket error: ", event.type);
                console.error(event);
                setError(true);
            };

            clientRef.current.onmessage = messageCallback;
        }

    }, []);

    useEffect(() => {
        (async () => {
            const meResponse = await fetch("/api/me");
            if (meResponse.status === 401) {
                if (window.location.pathname !== "/login") {
                    navigate(`/login?redirectTo=${window.location.pathname}`, {
                        replace: true
                    });
                }
            }
        })();
        connect();
    }, []);

    return {
        connected,
        send: (data: any) => {
            if (clientRef.current !== null) {
                console.log("Sending data: ", data);
                clientRef.current.send(JSON.stringify(data));
            }
        },
        error
    }
}
