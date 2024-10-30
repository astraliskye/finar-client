import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [errorText, setErrorText] = useState("");

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // TODO
    // Data type is any
    // Better error messages
    //  * Show error on form for "invalid username or password"
    const registerMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const body = await response.json();


            switch (response.status) {
            case 201:
                return body;
            case 401:
                throw new Error("Invalid form input.");
            case 500:
                throw new Error("Server error.");
            default:
                throw new Error("Something went wrong.");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userData"] })
            navigate("/");
        },
        onError: (error) => {
            setErrorText(error.message);
        }
    });

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            setErrorText("");
            let goodPassword = true;
            let error = "";

            if (password.length < 8) {
                error += "\nPassword must be at least 8 characters.";
                goodPassword = false;
            }

            let containsSpecial = false;
            for (let i = 0; i < password.length; i++) {
                if ("~`!@#$%^&*()-_+={}[]\\;:\"<>,./?".includes(password[i])) {
                    error += "\nPassword must contain a special character.";
                    containsSpecial = true;
                }
            }
            
            if (!containsSpecial) {
                error += "\nPassword must contain a special character.";
            }

            if (!goodPassword) {
                setErrorText(error);
                return;
            }

            registerMutation.mutate({
                username,
                password,
                email
            })
        }}
            className="w-screen h-screen flex flex-col items-center justify-center gap-4"
        >
            <p className="text-red-600 h-8">{errorText}</p>
            <input type="text" value={username}
                required
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                className="border-2 border-gray-700 rounded-md px-2 py-1 bg-transparent"
                autoFocus
            />
            <input type="password" value={password}
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-gray-700 rounded-md px-2 py-1 bg-transparent"
            />
            <input type="text" value={email}
                required
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-gray-700 rounded-md px-2 py-1 bg-transparent"
            />
            <button
                className="bg-primary rounded-md px-2 py-1 text-black"
            >
                Register
            </button>
            <Link
                to="/login"
                className="text-sm underline"
            >
                Already have an account? Log in instead
            </Link>
        </form>
    );
}

export default Register;
