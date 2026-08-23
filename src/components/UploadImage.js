import { privateApi } from "../api/axios";
import { toast } from "react-toastify";

export default async function UploadImage(productId, files) {

    console.log(productId);

    if (files.length === 0) {
        toast.error("Select images");
        return;
    }

    const toastId = toast.loading("Uploading...");

    try {

        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files", file);
        });

        formData.append("productId", productId);

        const res = await privateApi.post(
            "/image/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        toast.update(toastId, {
            render: res.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000
        });

    } catch (err) {

        toast.update(toastId, {
            render: err.response?.data?.message || "Upload failed",
            type: "error",
            isLoading: false,
            autoClose: 2000
        });

    }
}