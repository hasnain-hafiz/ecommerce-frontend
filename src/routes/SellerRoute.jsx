import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SellerRoute() {
    const { token, seller } = useContext(AuthContext);
    console.log("here 1")

    if (!token) {
        return <Navigate to="/auth" replace />;
    }
    console.log("here 2")

    return seller
        ? <Outlet /> 
        : <Navigate to="/" replace />;
}