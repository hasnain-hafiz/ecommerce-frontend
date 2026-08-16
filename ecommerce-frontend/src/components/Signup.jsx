import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { publicApi } from "../api/axios";

export default function Signup() {
    const [userData, setUserData] = useState({ seller: false });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading("Signing up...");

        try {
            const res = await publicApi.post("/auth/register", userData);
            login(res.data.data);
            toast.update(toastId, {
                render: res.data.message,
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
            navigate("/");
        } catch (err) {
            const fieldErrors = err.response?.data?.data;
            const message =
                typeof fieldErrors === "object" && fieldErrors !== null
                    ? Object.values(fieldErrors)[0]
                    : err.response?.data?.message || "Signup failed";
            toast.update(toastId, {
                render: message,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <div className="form-group">
                <label>First Name</label>
                <input
                    type="text"
                    placeholder="Enter first name"
                    onChange={(e) => setUserData((prev) => ({ ...prev, firstName: e.target.value }))}
                />
            </div>

            <div className="form-group">
                <label>Last Name</label>
                <input
                    type="text"
                    placeholder="Enter last name"
                    onChange={(e) => setUserData((prev) => ({ ...prev, lastName: e.target.value }))}
                />
            </div>

            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
                />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter password"
                    minLength={8}
                    onChange={(e) => setUserData((prev) => ({ ...prev, password: e.target.value }))}
                />
                <span className="hint-text">
                    8+ characters, with an uppercase letter, lowercase letter, digit, and symbol.
                </span>
            </div>

            <button className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Signing up..." : "Signup"}
            </button>

            <label className="auth-seller">
                Are you a Seller?
                <input
                    type="checkbox"
                    onChange={(e) => setUserData((prev) => ({ ...prev, seller: e.target.checked }))}
                />
            </label>
        </form>
    );
}
