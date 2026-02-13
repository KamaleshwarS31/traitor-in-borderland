"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    User
} from "firebase/auth";
import { authAPI } from "@/lib/api";

interface UserData {
    id: number;
    email: string;
    role: "master_admin" | "team_lead" | "member";
}

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const response = await authAPI.verify();
            setUserData(response.data);
        } catch (error: any) {
            // If user not registered (403), try to register them
            if (error.response && error.response.status === 403) {
                try {
                    console.log("User not found in backend, attempting registration...");
                    await authAPI.registerMember();
                    // After registration, fetch user data again
                    const response = await authAPI.verify();
                    setUserData(response.data);
                } catch (regError) {
                    console.error("Registration failed:", regError);
                    setUserData(null);
                }
            } else {
                console.error("Error fetching user data:", error);
                setUserData(null);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                await fetchUserData();
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
        await fetchUserData();
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);

        // fetchUserData will be called by onAuthStateChanged
        // It will handle registration if needed
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
        setUserData(null);
    };

    const refreshUserData = async () => {
        if (user) {
            await fetchUserData();
        }
    };

    return (
        <AuthContext.Provider value={{ user, userData, loading, signIn, signInWithGoogle, signOut, refreshUserData }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
