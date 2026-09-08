import { createContext, useContext, useEffect, useState } from "react";
import { privateApi } from "../api/axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { token, seller } = useContext(AuthContext);

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    // Wishlist is a customer-only concept — sellers never fetch it.
    const fetchWishlist = async () => {
        if (!token || seller) {
            setWishlist([]);
            return;
        }

        setLoading(true);
        try {
            const res = await privateApi.get("/wishlist");
            setWishlist(res.data.data || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const isWishlisted = (productId) =>
        wishlist.some((item) => item.product.id === productId);

    const addToWishlist = async (productId) => {
        try {
            const res = await privateApi.post(`/wishlist/${productId}`);
            setWishlist((prev) => [
                res.data.data,
                ...prev.filter((item) => item.product.id !== productId),
            ]);
            toast.success("Added to wishlist");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add to wishlist");
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await privateApi.delete(`/wishlist/${productId}`);
            setWishlist((prev) => prev.filter((item) => item.product.id !== productId));
            toast.success("Removed from wishlist");
        } catch (err) {
            toast.error("Failed to remove from wishlist");
        }
    };

    const toggleWishlist = async (productId) => {
        if (isWishlisted(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    useEffect(() => {
        fetchWishlist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, seller]);

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                loading,
                isWishlisted,
                toggleWishlist,
                addToWishlist,
                removeFromWishlist,
                fetchWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
