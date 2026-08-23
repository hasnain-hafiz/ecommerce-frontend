import { useEffect, useState } from "react";
import { privateApi, publicApi } from "../api/axios";
import { toast } from "react-toastify";

import UploadImage from "./UploadImage";
import { useNavigate } from "react-router-dom";

export default function AddProduct({setMode}) {

    const [data, setData] = useState({
        name: "",
        brand: "",
        price: "",
        description: "",
        inventory: 0,
        category: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [files, setFiles] = useState([]);

    // CHANGED: previously a hardcoded <option> list duplicated between
    // AddProduct.jsx and EditProduct.jsx, which would silently drift from
    // whatever categories actually exist in the backend. Now fetched once
    // from GET /category/all (public endpoint).
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await publicApi.get("/category/all");
                setCategories(res.data.data || []);
            } catch (err) {
                toast.error("Failed to load categories");
            }
        };
        fetchCategories();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        const toastId = toast.loading("Adding Product...")

        try {
            const res = await privateApi.post("/seller/add", data);

            const newProductId = res.data.data.id;

            if (files.length > 0) {
                await UploadImage(newProductId, files);
            }

            toast.update(toastId, {
                render: res.data.message,
                type: "success",
                isLoading: false,
                autoClose: 2000
            });

            setData({
                name: "",
                brand: "",
                price: 0,
                description: "",
                inventory: 0,
                category: ""
            });

            setFiles([]);
            setMode("MyProducts");

        } catch (err) {

            toast.update(toastId, {
                render: err.response?.data?.message,
                type: "error",
                isLoading: false,
                autoClose: 2000
            })
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (

        <form onSubmit={handleAdd}>

            <input
                type="text"
                placeholder="Name"

                onChange={e => setData({ ...data, name: e.target.value })
                }
            />

            <input
                type="text"
                placeholder="Brand"
                onChange={e => setData({ ...data, brand: e.target.value })}
            />

            <input
                type="number"
                placeholder="Price"

                onChange={e => setData({ ...data, price: Number(e.target.value)})}
            />

            <textarea
                placeholder="Description"

                onChange={e => setData({ ...data, description: e.target.value })}
            />

            <input type="number"
                placeholder="Inventory"
                onChange={e => setData({ ...data, inventory: Number(e.target.value) })}
            />

            <select name="Category"
                value={data.category}
                onChange={e => setData({ ...data, category: e.target.value })}

            >
                <option value="" disabled>Select Category</option>

                {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
            </select>

            <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFiles([...e.target.files])}
            />

            <button disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Product"}
            </button>

        </form>
    );
}
