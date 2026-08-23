import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute() {
    const { token } = useContext(AuthContext);

    return token
        ? <Outlet />
        : <Navigate to="/auth" replace />;
}