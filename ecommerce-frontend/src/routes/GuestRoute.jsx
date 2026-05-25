import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function GuestRoute() {
    const { seller } = useContext(AuthContext);

    return seller
        ? <Navigate to="/seller" replace />
        : <Outlet />;
}