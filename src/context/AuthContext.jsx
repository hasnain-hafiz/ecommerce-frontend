import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(
        localStorage.getItem("token") || null
    );

    const [seller, setSeller] = useState(
        JSON.parse(localStorage.getItem("seller")) || false
    );
    
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedSeller = localStorage.getItem("seller");

        if (storedToken) {
            setToken(storedToken);
        }

        if (storedSeller !== null) {
            setSeller(JSON.parse(storedSeller));
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("seller");

        setToken(null);
        setSeller(false);
    };

    const sellerIn = (sellerValue) => {
        localStorage.setItem(
            "seller",
            JSON.stringify(sellerValue)
        );

        setSeller(sellerValue);
    };

    const sellerOut = () => {
        localStorage.removeItem("seller");
        setSeller(false);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                seller,
                login,
                logout,
                sellerIn,
                sellerOut
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};