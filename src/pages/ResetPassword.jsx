import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { publicApi } from "../api/axios";
import { toast } from "react-toastify";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error("Missing or invalid reset link");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        setSubmitting(true);
        try {
            const res = await publicApi.post("/auth/reset-password", { token, newPassword });
            toast.success(res.data.message);
            navigate("/auth");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reset password");
        } finally {
            setSubmitting(false);
        }
    };

    if (!token) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h3 className="auth-title">Invalid link</h3>
                    <p className="auth-subtitle">
                        This password reset link is missing or malformed.
                    </p>
                    <p className="auth-back-link">
                        <Link to="/forgot-password">Request a new link</Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h3 className="auth-title">Set a new password</h3>
                <p className="auth-subtitle">Choose a new password for your account.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            placeholder="At least 8 characters"
                            minLength={8}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Re-enter new password"
                            minLength={8}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn-primary" disabled={submitting}>
                        {submitting ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <p className="auth-back-link">
                    <Link to="/auth">Back to login</Link>
                </p>
            </div>
        </div>
    );
}
