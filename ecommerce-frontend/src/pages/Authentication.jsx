import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import  { publicApi } from "../api/axios";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Authentication() {
    const [mode, setMode] = useState("login");
    
    const {token} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
       
        const toastId = toast.loading("Server is spinning up...");
        const warmUp = async () => {
            
            try {
                const response = await publicApi.get("/auth/warmup");
                if (response.status === 200) {
                    toast.update(toastId, {
                        render: "Server is Online 🎉",
                        type: "success",
                        isLoading: false,
                        autoClose: 3000,
                    });
                }
            } catch (err) {
                console.error("Warmup failed:", err);
                toast.update(toastId, {
                    render: "Something went wrong",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            }
        };
        warmUp();
    }, []);

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h3 className="auth-title">Welcome</h3>
                <p className="auth-subtitle">Sign in to continue shopping</p>
                
                <div className="auth-toggle">
                    <button
                        className={mode === "signup" ? "active" : ""}
                        onClick={() => setMode("signup")}
                    >
                        Sign Up
                    </button>

                    <button
                        className={mode === "login" ? "active" : ""}
                        onClick={() => setMode("login")}
                    >
                        Login
                    </button>
                </div>

                {mode === "login" && <Login />}
                {mode === "signup" && <Signup  />}

            </div>
            
        </div>
    );
}