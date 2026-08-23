import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { privateApi, publicApi } from "../api/axios";
import { toast } from "react-toastify";
import UploadImage from "../components/UploadImage";

export default function EditProduct() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    // CHANGED: fetched from the backend instead of a hardcoded list — see
    // AddProduct.jsx for the same fix and why.
    const [categories, setCategories] = useState([]);


    const [data, setData] = useState({
        name: "",
        brand: "",
        price: "",
        description: "",
        inventory: "",
        category: ""
    });

    useEffect(() => {
        fetchProduct();
        fetchCategories();
    }, [id]);

    const fetchCategories = async () => {
        try {
            const res = await publicApi.get("/category/all");
            setCategories(res.data.data || []);
        } catch (err) {
            toast.error("Failed to load categories");
        }
    };

    const fetchProduct = async () => {

        try {

            const res = await privateApi.get(
                `/product/${id}`
            );

          

            const product = res.data.data;

            setData({
                name: product.name || "",
                brand: product.brand || "",
                price: product.price || "",
                description:
                    product.description || "",
                inventory:
                    product.inventory || "",
                category:
                    product.category?.name ||
                    product.category ||
                    ""
            });

        } catch (err) {

            toast.error(
                err.response?.data?.message
                || "Failed to load product"
            );

            navigate("/seller");
        }
    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            await privateApi.put(
                `/seller/update/${id}`,
                data
            );

            // CHANGED: previously always called UploadImage(id, files),
            // which shows a "Select images" error toast on every
            // metadata-only edit where the seller didn't pick new files.
            // Now only uploads if files were actually selected.
            if (files.length > 0) {
                await UploadImage(id, files);
            }

            toast.success(
                "Product updated"
            );

            navigate("/seller");

        } catch (err) {

            toast.error(
                err.response?.data?.message
                || "Update failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (

        <form onSubmit={handleUpdate}>

            <input
                name="name"
                type="text"
                value={data.name}
                onChange={handleChange}
                placeholder="Name"
            />

            <input
                name="brand"
                type="text"
                value={data.brand}
                onChange={handleChange}
                placeholder="Brand"
            />

            <input
                name="price"
                type="number"
                value={data.price}
                onChange={handleChange}
                placeholder="Price"
            />

            <textarea
                name="description"
                value={data.description}
                onChange={handleChange}
                placeholder="Description"
            />

            <input
                name="inventory"
                type="number"
                value={data.inventory}
                onChange={handleChange}
                placeholder="Inventory"
            />

            <select name="category"
                value={data.category}
                onChange={handleChange}

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

            <button disabled={loading}>

                {
                    loading
                        ? "Updating..."
                        : "Update Product"
                }

            </button>

        </form>
    );
}
