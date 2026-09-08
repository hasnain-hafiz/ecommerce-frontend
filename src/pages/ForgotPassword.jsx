import React, { useState } from "react";
import { Link } from "react-router-dom";
import { publicApi } from "../api/axios";
import { toast } from "react-toastify";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await publicApi.post("/auth/forgot-password", { email });
            // The backend always returns the same generic message whether
            // or not the email exists (prevents account enumeration), so
            // there's nothing more specific to show here even on "success".
            toast.success(res.data.message);
            setSubmitted(true);
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h3 className="auth-title">Reset your password</h3>
                <p className="auth-subtitle">
                    {submitted
                        ? "If an account with that email exists, check your inbox for a reset link."
                        : "Enter your email and we'll send you a reset link."}
                </p>

                {!submitted && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button className="btn-primary" disabled={submitting}>
                            {submitting ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                )}

                <p className="auth-back-link">
                    <Link to="/auth">Back to login</Link>
                </p>
            </div>
        </div>
    );
}
