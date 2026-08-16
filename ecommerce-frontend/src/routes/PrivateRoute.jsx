import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute() {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null; // avoid a flash-redirect while /auth/me resolves

    return user ? <Outlet /> : <Navigate to="/auth" replace />;
}
