import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function GuestRoute() {
    const { isSeller, loading } = useContext(AuthContext);

    if (loading) return null;

    return isSeller ? <Navigate to="/seller" replace /> : <Outlet />;
}
