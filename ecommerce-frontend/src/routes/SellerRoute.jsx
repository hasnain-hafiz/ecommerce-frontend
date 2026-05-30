import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SellerRoute() {
    const { token, seller } = useContext(AuthContext);
 

    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    return seller
        ? <Outlet />
        : <Navigate to="/" replace />;
}