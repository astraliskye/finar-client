import { useContext, useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { WebSocketContext } from "../../contexts/WebSocketContext";

function Home() {
    const [searching, setSearching] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { username, setUsername, loading: authIsLoading } = useAuth();
    const { send, setMessageCallback } = useContext(WebSocketContext);

    useEffect(() => {
        setMessageCallback((message: MessageEvent) => {
            const body = JSON.parse(message.data) as { type: string, data: any };

            switch (body.type) {
                case "matchFound":
                    const gameId = body.data as number;

                    navigate(`/game/${gameId}`);
                    break;
                case "ack":
                    const type = body.data as string;

                    switch (type) {
                        case "joinQueue":
                            setSearching(true);
                            break;
                        case "cancelQueue":
                            setSearching(false);
                            break;
                    }
                    break;
                default:
                    break;
            }
        });
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch("/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            switch (response.status) {
                case 200:
                    setUsername("");
                    return await response.json();
                case 500:
                    throw new Error("Server error.");
                default:
                    throw new Error("Something went wrong.");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userData"] })
        }
    });

    const createLobbyMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch("/api/lobby", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const body = await response.json() as {
                lobbyId: string
            };

            if (response.status === 200) {
                navigate(`/lobby/${body.lobbyId}`);
            }
        }
    })

    if (authIsLoading) {
        return <div className="w-screen h-screen flex items-center justify-center">
            <svg width="64" height="64" stroke="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" strokeLinecap="round"><animate attributeName="stroke-dasharray" dur="1.5s" calcMode="spline" values="0 150;42 150;42 150;42 150" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite" /><animate attributeName="stroke-dashoffset" dur="1.5s" calcMode="spline" values="0;-16;-59;-59" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite" /></circle><animateTransform attributeName="transform" type="rotate" dur="2s" values="0 12 12;360 12 12" repeatCount="indefinite" /></g></svg>
        </div>
    }

    return (
        <div>
            {searching && <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-10 flex items-center justify-center">
                <div className="w-32 bg-stone-900 rounded-2xl flex flex-col gap-4 py-4 items-center justify-center">
                    <svg width="64" height="64" stroke="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" strokeLinecap="round"><animate attributeName="stroke-dasharray" dur="1.5s" calcMode="spline" values="0 150;42 150;42 150;42 150" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite" /><animate attributeName="stroke-dashoffset" dur="1.5s" calcMode="spline" values="0;-16;-59;-59" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite" /></circle><animateTransform attributeName="transform" type="rotate" dur="2s" values="0 12 12;360 12 12" repeatCount="indefinite" /></g></svg>
                    <button onClick={() => send({ type: "cancelQueue" })}>Cancel</button>
                </div>
            </div>}
            <header className="flex justify-between items-center px-4 absolute w-screen border-b-2 border-stone-500 py-4">
                <p className="text-primary font-bold tracking-widest">finar</p>
                {username === ""
                    ? <div className="flex gap-4">
                        {username}
                        <Link
                            to="/register"
                            className="select-none px-2 py-1 bg-primary text-black rounded-md"
                        >
                            Register
                        </Link>
                        <Link
                            to="/login"
                            className="select-none px-2 py-1 underline rounded-md"
                        >
                            Log In
                        </Link>
                    </div>
                    :
                    <div className="flex items-center justify-center gap-4">
                        <p>Logged in as <span className="text-primary">{username}</span></p>
                        <button
                            className="px-2 py-1 underline"
                            onClick={() => {
                                logoutMutation.mutate()
                            }}
                        >
                            Log Out
                        </button>
                    </div>
                }
            </header>
            <main className="w-screen h-screen flex flex-col items-center justify-center">
                <h1 className="text-6xl mb-4 text-primary tracking-widest font-bold">finar</h1>
                <p className="mb-24">A game where the only goal is to make five in a row.</p>
                <p className={`text-sm text-red-500 py-2 ${username !== "" && "invisible"}`}>Please log in or register to play the game.</p>
                <div className={`flex flex-col items-center gap-4 rounded-lg`}>
                    <button className="select-none px-3 py-2 bg-primary text-black rounded-md disabled:opacity-50"
                        disabled={username === ""}
                        onClick={() => send({ type: "joinQueue" })}>
                        Quick Match
                    </button>
                    <button className="select-none px-3 py-2 text-white rounded-md bg-stone-800 hover:bg-stone-700 transition disabled:opacity-50 disabled:hover:bg-stone-800"
                        disabled={username === ""}
                        onClick={() => createLobbyMutation.mutate()}>
                        Create Lobby
                    </button>
                </div>
            </main>
        </div>
    );
}

export default Home;
