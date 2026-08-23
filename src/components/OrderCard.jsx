import React from "react";
import { useNavigate } from "react-router-dom";


export default function OrderCard({ order }) {
    const navigate = useNavigate();

    return (
        <div
            className="order-card"
            onClick={() => navigate(`/order/${order.id}`)}
        >
            <div className="order-id">Order #{order.id}</div>

            <div className="order-date">
                {new Date(order.orderDate).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                })}
            </div>

            <div className="order-amount">₹{order.totalAmount}</div>

            <div className={`order-status ${order.status?.toLowerCase()}`}>
                {order.status}
            </div>
        </div>
    );
}