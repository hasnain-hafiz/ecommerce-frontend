import React from "react";
import { useNavigate } from "react-router-dom";

export default function OrderCard({ order }) {
    const navigate = useNavigate();

    return (
        <div className="order-card"
            onClick={() => navigate(`/order/${order.id}`)}
        >
            <div className="order-id">OrderID:{order.id}</div>
            <div className="order-date">OrderDate:{order.orderDate}</div>
            <div className="order-amount">Total Amount:{order.totalAmount}</div>
            <div
                className={`order-status ${order.status?.toLowerCase()}`}
            >
                Order Status: {order.status}
            </div>
        </div>

    )
}