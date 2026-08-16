import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { privateApi } from "../api/axios";
import OrderCard from "../components/OrderCard";

export default function Orders() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        if (!user) { return };

        setLoading(true);
        try {
            const res = await privateApi.get("/order/all");
            setOrders(res.data.data);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [user]);

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