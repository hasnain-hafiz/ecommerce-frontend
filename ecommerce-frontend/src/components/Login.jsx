import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { publicApi } from "../api/axios";


export default function Login() {
    const [userData, setUserData] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false);


    const { login } = useContext(AuthContext);
    const { sellerIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));


    const handleLogin = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        const toastId = toast.loading("Loggin in...")

        try {
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    const res = await publicApi.post("/auth/authenticate", userData);

                    console.log(res);
                    login(res.data.data.token);
                    sellerIn(res.data.data.seller);
                    toast.update(toastId, {
                        render: res.data.message,
                        type: "success",
                        isLoading: false,
                        autoClose: 2000
                    });
                    navigate("/");
                    return;
                } catch (err) {
                    if (attempt === 2) {
                        toast.update(toastId, {
                            render: err.response?.data?.data,
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
        <form onSubmit={handleLogin}>

            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={userData.email || ""}
                    onChange={(e) =>
                        setUserData(prev => ({ ...prev, email: e.target.value }))
                    }
                />
                {/* Example error */}
                {/* <span className="error-text">Invalid email</span> */}
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    minLength={8}
                    value={userData.password || ""}
                    onChange={(e) =>
                        setUserData(prev => ({ ...prev, password: e.target.value }))
                    }
                />
                {/* <span className="error-text">Password must be 8+ chars</span> */}
            </div>

            <button className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
            </button>

        </form>
    );
}