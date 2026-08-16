import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute() {
    const { user, isAdmin, loading } = useContext(AuthContext);

    if (loading) return null;
    if (!user) return <Navigate to="/auth" replace />;

    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
