import React, { createContext, useState } from "react";
import { useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        const StoredToken = localStorage.getItem("token");
        if (StoredToken) { setToken(StoredToken) }
    }, [])

    const login = (token) => {
        localStorage.setItem("token", token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };
    
    return (
        <AuthContext.Provider value={{ token, login, logout }} >
            {children}
        </AuthContext.Provider>
    );
};