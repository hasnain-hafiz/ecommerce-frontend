import React, { createContext, useState, useEffect, useCallback } from "react";
import { publicApi, privateApi, primeCsrfToken } from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);       // { id, firstName, lastName, email, roles: [] }
    const [loading, setLoading] = useState(true);  // true while we check for an existing session

    const hasRole = useCallback((role) => !!user?.roles?.includes(role), [user]);
    const isSeller = hasRole("ROLE_SELLER");
    const isAdmin = hasRole("ROLE_ADMIN");

    const bootstrap = useCallback(async () => {
        await primeCsrfToken();
        try {
            const res = await privateApi.get("/auth/me");
            setUser(res.data.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        bootstrap();

        // Fired by the axios interceptor when a refresh attempt fails.
        const onExpired = () => setUser(null);
        window.addEventListener("auth:expired", onExpired);
        return () => window.removeEventListener("auth:expired", onExpired);
    }, [bootstrap]);

    const login = (userData) => setUser(userData);

    const logout = async () => {
        try {
            await publicApi.post("/auth/logout");
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, isSeller, isAdmin, hasRole, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
