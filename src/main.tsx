import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Settings from './pages/Settings.tsx'
import Matchmaking from './pages/Matchmaking.tsx'
import Play from './pages/Play.tsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/play/online",
        element: <Matchmaking />
    },
    {
        path: "/game/:id",
        element: <Play />
    },
    {
        path: "/play/ai",
        element: <></>
    },
    {
        path: "/settings",
        element: <Settings />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
])

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>,
)
