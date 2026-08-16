import React, { useContext, useEffect, useState } from "react";
import { privateApi } from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function AdminDashboard() {
    const { logout } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await privateApi.get("/auth/all");
            setUsers(res.data.data);
        } catch {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (!window.confirm("Delete this user? This cannot be undone.")) return;
        try {
            await privateApi.delete(`/auth/${userId}`);
            toast.success("User deleted");
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch {
            toast.error("Failed to delete user");
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <button className="logout-btn" onClick={logout} title="Sign out">
                    ⎋ Sign out
                </button>
            </div>

            <h2>Users</h2>
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Roles</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.firstName} {u.lastName}</td>
                                <td>{u.email}</td>
                                <td>{(u.roles || []).join(", ")}</td>
                                <td>
                                    <button className="danger-btn" onClick={() => handleDelete(u.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
