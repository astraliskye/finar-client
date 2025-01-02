import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Play from './pages/Play.tsx'
import Lobby from './matchmaking/Lobby.tsx'
import WebSocketProvider from './hooks/WebSocketContext.tsx'

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
