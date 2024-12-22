import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

function Home() {
    const [username, setUsername] = useState("");
    const queryClient = useQueryClient();

    const meQuery = useQuery({
        queryKey: ["userData"],
        queryFn: async () => {
            const response = await fetch("/api/me");
            const body = await response.json();

            switch (response.status) {
                case 200:
                    setUsername(body.principal.username);
                    return body;
                case 401:
                    setUsername("");
                    throw new Error("No valid user session.");
                case 500:
                    throw new Error("Server error.");
                default:
                    throw new Error("Something went wrong.");
            }
        },
        retry: false
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

    if (meQuery.isLoading) {
        return <div className="w-screen h-screen flex items-center justify-center">
            <svg width="64" height="64" stroke="#006bf4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" strokeLinecap="round"><animate attributeName="stroke-dasharray" dur="1.5s" calcMode="spline" values="0 150;42 150;42 150;42 150" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite" /><animate attributeName="stroke-dashoffset" dur="1.5s" calcMode="spline" values="0;-16;-59;-59" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite" /></circle><animateTransform attributeName="transform" type="rotate" dur="2s" values="0 12 12;360 12 12" repeatCount="indefinite" /></g></svg>
        </div>
    }

    return (
        <div>
            <header className="flex justify-between h-12 items-center px-4 absolute w-screen">
                <p>Logo</p>
                {username === ""
                    ? <div className="flex gap-4">
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
                <h1 className="text-4xl mb-12">finar</h1>
                <div className="flex flex-col items-center gap-2">
                    <a href="/play/online" className="select-none px-2 py-1 bg-primary text-black rounded-md">Play Online</a>
                    <a href="/play/ai" className="underline">Play vs Computer</a>
                    <a href="/settings" className="underline">Settings</a>
                </div>
            </main>
        </div>
    );
}

export default Home;
