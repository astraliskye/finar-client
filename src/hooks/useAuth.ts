import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function useAuth() {
    const [username, setUsername] = useState<String>("");

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

    return {
        loading: meQuery.isLoading,
        error: meQuery.isError,
        username,
        setUsername
    }
}

export default useAuth;
