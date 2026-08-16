import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { publicApi } from "../api/axios";

export default function Login() {
    const [userData, setUserData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading("Logging in...");

        try {
            const res = await publicApi.post("/auth/authenticate", userData);
            login(res.data.data);
            toast.update(toastId, {
                render: res.data.message,
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
            navigate("/");
        } catch (err) {
            toast.update(toastId, {
                render: err.response?.data?.message || "Login failed",
                type: "error",
                isLoading: false,
                autoClose: 2500,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={userData.email || ""}
                    onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
                />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    minLength={8}
                    value={userData.password || ""}
                    onChange={(e) => setUserData((prev) => ({ ...prev, password: e.target.value }))}
                />
            </div>

            <button className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
            </button>
        </form>
    );
}
