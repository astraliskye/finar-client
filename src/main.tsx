import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '@features/home/Home.tsx'
import Login from '@features/auth/Login.tsx'
import Register from '@features/auth/Register.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Play from '@features/play/Play.tsx'
import Lobby from '@features/matchmaking/Lobby.tsx'
import WebSocketProvider from '@contexts/WebSocketContext.tsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/game/:id",
        element: <Play />
    },
    {
        path: "/lobby/:id",
        element: <Lobby />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "*",
        element: <Home />
    }
])

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <WebSocketProvider>
                <RouterProvider router={router} />
            </WebSocketProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
