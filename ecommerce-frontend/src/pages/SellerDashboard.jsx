import React, { useContext } from "react";
import AddProduct from "../components/AddProduct";

import { useState } from "react";
import Login from "../components/Login";
import SellerProducts from "../components/SellerProducts";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SellerDashboard() {
    const [mode, setMode] = useState();
    const { seller, token, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    

    if (!seller) {
        console.log(seller);
        navigate("/");
    }
    console.log("here 3")

    return (
        <div className="seller-dashboard">  

            <h1>Seller Dashboard</h1>

            <div>
                <button onClick={() => setMode("AddProduct")}>Add Product</button>
                <button onClick={() => setMode("MyProducts")}>My Products</button>
                {token && (
                    <button className="logout-btn" onClick={logout} title="Sign out">
                        ⎋ Sign out
                    </button>
                )}
            </div>
            

            {mode === "AddProduct" && <AddProduct setMode={setMode} />}
            {mode === "MyProducts" && <SellerProducts  />}

        </div>  
  );
}