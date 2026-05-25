import React, { createContext, useState } from "react";
import { useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [seller, setSeller] = useState(localStorage.getItem("seller") || false);

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

    const sellerIn = (seller) => {
        localStorage.setItem("seller", seller)
        setSeller(seller)
    }

    const sellerOut = () => {
        localStorage.removeItem("seller")
        setSeller(false);
    }
        
    return (
        <AuthContext.Provider value={{ token, seller, login, logout ,sellerIn, sellerOut }} >
            {children}
        </AuthContext.Provider>
    );
};