import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import OrderCard from "../components/OrderCard";

export default function Orders() {
    const { token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        if (!token) { return };

        setLoading(true);
        try {
            const res = await api.get("/order/all");
            setOrders(res.data.data);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="orders-loading">
                Loading orders...
            </div>
        );
    }

    return (
        <div className="order-list">
            <h2>My Orders</h2>
            <div className="order-container">
                {orders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                    />
                )
                )}
            </div>
        </div>
    )
}