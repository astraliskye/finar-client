import { useState } from "react";
import useSocketClient from "../hooks/useSocketClient";
import { useNavigate } from "react-router-dom";

function Matchmaking() {
    const navigate = useNavigate();
    const [searching, setSearching] = useState(false);

    const { connected, send } = useSocketClient("/matchmaking", (message: MessageEvent) => {
        const body = JSON.parse(message.data) as { type: string, data: any };

        if (body.type === "join") {
            navigate(`/play`);
        } else if (body.type === "ack") {
            setSearching(true);
        }
    });

    if (!connected) {
        return <div className="w-screen h-screen flex items-center justify-center">
            <svg width="64" height="64" stroke="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" strokeLinecap="round"><animate attributeName="stroke-dasharray" dur="1.5s" calcMode="spline" values="0 150;42 150;42 150;42 150" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite" /><animate attributeName="stroke-dashoffset" dur="1.5s" calcMode="spline" values="0;-16;-59;-59" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite" /></circle><animateTransform attributeName="transform" type="rotate" dur="2s" values="0 12 12;360 12 12" repeatCount="indefinite" /></g></svg>
        </div>
    }

    if (searching) {
        return <div className="w-screen h-screen flex flex-col gap-8 items-center justify-center">
            <svg width="64" height="64" stroke="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" strokeLinecap="round"><animate attributeName="stroke-dasharray" dur="1.5s" calcMode="spline" values="0 150;42 150;42 150;42 150" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite" /><animate attributeName="stroke-dashoffset" dur="1.5s" calcMode="spline" values="0;-16;-59;-59" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite" /></circle><animateTransform attributeName="transform" type="rotate" dur="2s" values="0 12 12;360 12 12" repeatCount="indefinite" /></g></svg>
        </div>
    }

    if (connected) {
        return (
            <div className="py-4 flex flex-col items-center">
                <button onClick={() => { send({ type: "join" }) }}>Join Game</button>
            </div >
        );
    }
}

export default Matchmaking;
