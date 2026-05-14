import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function Signup() {
    const [userData, setUserData] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false);


    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    const handleSignup = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        const toastId = toast.loading("Signing in...")

        try {
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    const res = await api.post("/auth/register", userData);
                    console.log(res);
                    login(res.data.data); //res.data.data = token
                    toast.update(toastId, {
                        render: res.data.message,
                        type: "success",
                        isLoading: false,
                        autoClose: 2000
                    });
                    navigate("/")
                    return;

                } catch (err) {
                    if (attempt === 2) {
                        toast.update(toastId, {
                            render: err.response?.data?.message,
                            type: "error",
                            isLoading: false,
                            autoClose: 2000
                        })
                    }
                    else {
                        await sleep(1500);
                    }
                }
            }
        }
        finally {
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
                    onChange={(e) =>
                        setUserData(prev => ({ ...prev, firstName: e.target.value }))
                    }
                />
                {/* <span className="error-text">Error here</span> */}
            </div>

            <div className="form-group">
                <label>Last Name</label>
                <input
                    type="text"
                    placeholder="Enter last name"
                    onChange={(e) =>
                        setUserData(prev => ({ ...prev, lastName: e.target.value }))
                    }
                />
            </div>

            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) =>
                        setUserData(prev => ({ ...prev, email: e.target.value }))
                    }
                />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter password"
                    minLength={8}
                    onChange={(e) =>
                        setUserData(prev => ({ ...prev, password: e.target.value }))
                    }
                />
            </div>

            <button className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Signing up..." : "Signup"}
            </button>
        </form>
    );
}