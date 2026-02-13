"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import socket from "@/lib/socket";
import { useAuth } from "./AuthContext";

interface SocketContextType {
    connected: boolean;
    joinTeam: (teamId: number) => void;
    joinAdmin: () => void;
    leaveRoom: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [connected, setConnected] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            socket.connect();

            socket.on("connect", () => {
                console.log("Socket connected");
                setConnected(true);
            });

            socket.on("disconnect", () => {
                console.log("Socket disconnected");
                setConnected(false);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [user]);

    const joinTeam = (teamId: number) => {
        socket.emit("join_team", teamId);
    };

    const joinAdmin = () => {
        socket.emit("join_admin");
    };

    const leaveRoom = () => {
        socket.disconnect();
        socket.connect();
    };

    return (
        <SocketContext.Provider value={{ connected, joinTeam, joinAdmin, leaveRoom }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
}
