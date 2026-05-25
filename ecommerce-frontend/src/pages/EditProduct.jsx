import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { privateApi } from "../api/axios";
import { toast } from "react-toastify";
import UploadImage from "../components/UploadImage";

export default function EditProduct() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);


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
    }, [id]);

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

            await UploadImage(id, files);
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
                value={data.name}
                onChange={handleChange}
                placeholder="Name"
            />

            <input
                name="brand"
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

            <select name="Category"
                value={data.category}
                onChange={handleChange}

            >
                <option value="" disabled>Select Category</option>

                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Decorations">Decorations</option>
                <option value="Accessories">Accessories</option>
                <option value="Books">Books</option>
                <option value="Other">Other</option>
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