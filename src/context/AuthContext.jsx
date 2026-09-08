import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(
        localStorage.getItem("token") || null
    );

    // NEW (Phase 3): the refresh token, used by axios.js to silently obtain
    // a new short-lived access token instead of forcing a full re-login.
    const [refreshToken, setRefreshToken] = useState(
        localStorage.getItem("refreshToken") || null
    );

    const [seller, setSeller] = useState(
        JSON.parse(localStorage.getItem("seller")) || false
    );

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRefreshToken = localStorage.getItem("refreshToken");
        const storedSeller = localStorage.getItem("seller");

        if (storedToken) {
            setToken(storedToken);
        }

        if (storedRefreshToken) {
            setRefreshToken(storedRefreshToken);
        }

        if (storedSeller !== null) {
            setSeller(JSON.parse(storedSeller));
        }
    }, []);

    // CHANGED: now accepts and persists the refresh token returned
    // alongside the access token by /auth/authenticate and /auth/register.
    const login = (newToken, newRefreshToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);

        if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
            setRefreshToken(newRefreshToken);
        }
    };

    // NEW (Phase 3): used by axios.js after a silent refresh succeeds, so
    // context state stays in sync with what's now in localStorage.
    const updateTokens = (newToken, newRefreshToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);

        if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
            setRefreshToken(newRefreshToken);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("seller");

        setToken(null);
        setRefreshToken(null);
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
                refreshToken,
                seller,
                login,
                updateTokens,
                logout,
                sellerIn,
                sellerOut
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
