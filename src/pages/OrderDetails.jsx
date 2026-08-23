import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { privateApi } from "../api/axios";

export default function OrderDetails(){
    const {id } = useParams();
    const [order,setOrder] = useState(null);
    const [loading,setLoading] =useState(false);

    const fetchOrder = async ()=>{
        setLoading(true);
        try{
            const res = await privateApi.get(`/order/${id}`);
            setOrder(res.data.data);
        }
        catch(err){
            console.log(err);
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchOrder();
    },[]);

    if (loading) {
        return (
            <div className="order-loading">
                Loading order...
            </div>
        );
    }

       if (!order) {
        return (
            <div className="order-error">
                <h2>Order not found</h2>
            </div>
        );
    }


   return (
        <div className="order-details-page">

            <div className="order-header">
                <h2>Order #{order.id}</h2>

                <p>
                    <strong>Status:</strong> {order.status}
                </p>

                <p>
                    <strong>Placed On:</strong>{" "}
                    {new Date(order.orderDate).toLocaleString()}
                </p>

                <p>
                    <strong>Total Amount:</strong> ₹{order.totalAmount}
                </p>
            </div>

            <div className="order-items">

                <h3>Items</h3>

                {order.items.map((item) => (
                    <div className="order-item-card" key={item.id}>

                        <div className="item-info">
        
                            <h4>{item.productName}</h4>

                            <p>
                                Quantity: {item.quantity}
                            </p>

                            <p>
                                Price: ₹{item.price}
                            </p>
                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}