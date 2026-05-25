import React from "react";
import AddProduct from "../components/AddProduct";

import { useState } from "react";
import Login from "../components/Login";
import SellerProducts from "../components/SellerProducts";

export default function SellerDashboard() {
    const [mode, setMode] = useState();


    return (

        <div>

            <h1>Seller Dashboard</h1>

            <button onClick={() => setMode("AddProduct")}>
                Add Product
            </button>

            <button onClick={() => setMode("MyProducts")}>
                My Products
            </button>

            {mode === "AddProduct" && <AddProduct setMode={setMode} />}
            {mode === "MyProducts" && <SellerProducts />}

        </div>

    );

}