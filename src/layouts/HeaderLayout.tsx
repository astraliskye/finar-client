import useAuth from "@hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type HeaderLayoutProps = {
    children: ReactNode
}

function HeaderLayout({ children }: HeaderLayoutProps) {
    const { username, setUsername } = useAuth();
    const queryClient = useQueryClient();

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
    return <>
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
        <main>
            {children}
        </main>
    </>
}

export default HeaderLayout;
