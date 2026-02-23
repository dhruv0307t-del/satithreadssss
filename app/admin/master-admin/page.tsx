"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, Trash2, Key, UserCheck, X, UserPlus } from "lucide-react";

interface Admin {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    totalOrders: number;
    totalSpent: number;
}

interface AdminLog {
    _id: string;
    adminEmail: string;
    action: string;
    targetUserEmail?: string;
    details?: string;
    createdAt: string;
}

export default function MasterAdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"admins" | "logs">("admins");
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [logs, setLogs] = useState<AdminLog[]>([]);
    const [stats, setStats] = useState({ totalAdmins: 0, masterAdmins: 0, regularAdmins: 0 });
    const [loading, setLoading] = useState(false);

    // Change password modal
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const [newPassword, setNewPassword] = useState("");

    // Promote user
    const [searchEmail, setSearchEmail] = useState("");

    // Create admin modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createName, setCreateName] = useState("");
    const [createEmail, setCreateEmail] = useState("");
    const [createPassword, setCreatePassword] = useState("");
    const [createError, setCreateError] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin/login");
        } else if (status === "authenticated" && session?.user?.role !== "master_admin") {
            router.push("/admin");
        }
    }, [status, session, router]);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "master_admin") {
            fetchAdmins();
            fetchLogs();
        }
    }, [status, session]);

    const fetchAdmins = async () => {
        try {
            const res = await fetch("/api/master-admin/admins");
            const data = await res.json();
            if (data.success) {
                setAdmins(data.admins);
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Failed to fetch admins:", error);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await fetch("/api/master-admin/logs");
            const data = await res.json();
            if (data.success) {
                setLogs(data.logs);
            }
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        }
    };

    const handleChangePassword = async () => {
        if (!selectedAdmin || !newPassword) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/master-admin/admins/${selectedAdmin._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "change_password", password: newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Password changed successfully");
                setShowPasswordModal(false);
                setNewPassword("");
                setSelectedAdmin(null);
                fetchLogs();
            } else {
                alert(data.error || "Failed to change password");
            }
        } catch (error) {
            alert("Failed to change password");
        }
        setLoading(false);
    };

    const handleDeleteAdmin = async (admin: Admin) => {
        if (!confirm(`Are you sure you want to delete ${admin.email}?`)) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/master-admin/admins/${admin._id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (res.ok) {
                alert("Admin deleted successfully");
                fetchAdmins();
                fetchLogs();
            } else {
                alert(data.error || "Failed to delete admin");
            }
        } catch (error) {
            alert("Failed to delete admin");
        }
        setLoading(false);
    };

    const handlePromoteUser = async () => {
        if (!searchEmail) {
            alert("Please enter a user email");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users`);
            const data = await res.json();

            if (!data.success) {
                alert("Failed to fetch users");
                setLoading(false);
                return;
            }

            const user = data.users.find((u: any) => u.email === searchEmail);
            if (!user) {
                alert("User not found");
                setLoading(false);
                return;
            }

            if (user.role === "admin" || user.role === "master_admin") {
                alert("User is already an admin");
                setLoading(false);
                return;
            }

            const promoteRes = await fetch("/api/master-admin/promote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id, role: "admin" }),
            });

            const promoteData = await promoteRes.json();
            if (promoteRes.ok) {
                alert("User promoted to admin successfully");
                setSearchEmail("");
                fetchAdmins();
                fetchLogs();
            } else {
                alert(promoteData.error || "Failed to promote user");
            }
        } catch (error) {
            alert("Failed to promote user");
        }
        setLoading(false);
    };

    const handleCreateAdmin = async () => {
        setCreateError("");
        if (!createName || !createEmail || !createPassword) {
            setCreateError("All fields are required.");
            return;
        }
        if (createPassword.length < 8) {
            setCreateError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/master-admin/admins", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: createName, email: createEmail, password: createPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message || "Admin created successfully!");
                setShowCreateModal(false);
                setCreateName("");
                setCreateEmail("");
                setCreatePassword("");
                fetchAdmins();
                fetchLogs();
            } else {
                setCreateError(data.error || "Failed to create admin.");
            }
        } catch {
            setCreateError("Something went wrong.");
        }
        setLoading(false);
    };

    if (status === "loading") {
        return (
            <div className="admin-main flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated" || session?.user?.role !== "master_admin") {
        return null;
    }

    return (
        <div className="admin-main text-black">
            <div className="flex items-center gap-3 mb-8">
                <Shield className="text-yellow-600" size={32} />
                <h1 className="admin-title">Master Admin Control Panel</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-2">Total Admins</p>
                    <p className="text-3xl font-bold">{stats.totalAdmins}</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
                    <p className="text-sm text-yellow-800 mb-2">Master Admins</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.masterAdmins} / 2</p>
                </div>
                <div className="bg-white p-6 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-2">Regular Admins</p>
                    <p className="text-3xl font-bold">{stats.regularAdmins}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b">
                <button
                    onClick={() => setActiveTab("admins")}
                    className={`px-6 py-3 font-semibold transition-colors ${activeTab === "admins"
                        ? "border-b-2 border-black text-black"
                        : "text-gray-500 hover:text-black"
                        }`}
                >
                    Admin Management
                </button>
                <button
                    onClick={() => setActiveTab("logs")}
                    className={`px-6 py-3 font-semibold transition-colors ${activeTab === "logs"
                        ? "border-b-2 border-black text-black"
                        : "text-gray-500 hover:text-black"
                        }`}
                >
                    Activity Logs
                </button>
            </div>

            {/* Admin Management Tab */}
            {activeTab === "admins" && (
                <div className="space-y-8">
                    {/* Action Row: Promote + Create */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Promote User Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <UserCheck size={20} />
                                Promote Existing User
                            </h2>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="email"
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                    placeholder="Enter user email"
                                    className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={handlePromoteUser}
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    Promote to Admin
                                </button>
                            </div>
                        </div>

                        {/* Create New Admin Section */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <UserPlus size={20} />
                                Create New Admin
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Create a fresh admin account with email and password (no prior account needed).
                            </p>
                            <button
                                onClick={() => { setShowCreateModal(true); setCreateError(""); }}
                                className="w-full px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <UserPlus size={18} />
                                Create Admin Account
                            </button>
                        </div>
                    </div>

                    {/* Admin List */}
                    <div className="bg-white rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 text-left text-sm font-semibold">Email</th>
                                    <th className="text-left text-sm font-semibold">Role</th>
                                    <th className="text-left text-sm font-semibold">Joined</th>
                                    <th className="text-left text-sm font-semibold">Orders</th>
                                    <th className="text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((admin) => (
                                    <tr key={admin._id} className="border-t hover:bg-gray-50">
                                        <td className="p-4">
                                            <div>
                                                <p className="font-semibold">{admin.name}</p>
                                                <p className="text-sm text-gray-600">{admin.email}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${admin.role === "master_admin"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-blue-100 text-blue-800"
                                                    }`}
                                            >
                                                {admin.role === "master_admin" ? "Master Admin" : "Admin"}
                                            </span>
                                        </td>
                                        <td className="text-sm text-gray-600">
                                            {new Date(admin.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="text-sm text-gray-600">{admin.totalOrders}</td>
                                        <td>
                                            {admin.role !== "master_admin" && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedAdmin(admin);
                                                            setShowPasswordModal(true);
                                                        }}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Change Password"
                                                    >
                                                        <Key size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAdmin(admin)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Admin"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            )}
                                            {admin.role === "master_admin" && (
                                                <span className="text-xs text-gray-400 italic">Protected</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Activity Logs Tab */}
            {activeTab === "logs" && (
                <div className="bg-white rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 text-left text-sm font-semibold">Date</th>
                                <th className="text-left text-sm font-semibold">Admin</th>
                                <th className="text-left text-sm font-semibold">Action</th>
                                <th className="text-left text-sm font-semibold">Target</th>
                                <th className="text-left text-sm font-semibold">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log._id} className="border-t hover:bg-gray-50">
                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="text-sm font-medium">{log.adminEmail}</td>
                                    <td>
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${log.action.includes("deleted")
                                                ? "bg-red-100 text-red-800"
                                                : log.action.includes("promoted") || log.action.includes("created")
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-blue-100 text-blue-800"
                                                }`}
                                        >
                                            {log.action.replace(/_/g, " ")}
                                        </span>
                                    </td>
                                    <td className="text-sm text-gray-600">{log.targetUserEmail || "-"}</td>
                                    <td className="text-sm text-gray-600">{log.details || "-"}</td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No activity logs found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Password Change Modal */}
            {showPasswordModal && selectedAdmin && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Change Password</h2>
                            <button
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setNewPassword("");
                                    setSelectedAdmin(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Changing password for: <span className="font-semibold">{selectedAdmin.email}</span>
                            </p>
                            <label className="label">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="admin-input"
                                placeholder="Enter new password (min 6 characters)"
                                minLength={6}
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handleChangePassword}
                                disabled={loading || newPassword.length < 6}
                                className="flex-1 bg-black text-white py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-gray-800 transition-colors"
                            >
                                {loading ? "Changing..." : "Change Password"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setNewPassword("");
                                    setSelectedAdmin(null);
                                }}
                                className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Admin Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <UserPlus size={24} /> Create Admin
                            </h2>
                            <button
                                onClick={() => { setShowCreateModal(false); setCreateError(""); }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {createError && (
                            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm mb-4">
                                {createError}
                            </div>
                        )}

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="label">Full Name</label>
                                <input
                                    type="text"
                                    value={createName}
                                    onChange={(e) => setCreateName(e.target.value)}
                                    className="admin-input"
                                    placeholder="Admin's full name"
                                />
                            </div>
                            <div>
                                <label className="label">Email Address</label>
                                <input
                                    type="email"
                                    value={createEmail}
                                    onChange={(e) => setCreateEmail(e.target.value)}
                                    className="admin-input"
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <div>
                                <label className="label">Password</label>
                                <input
                                    type="password"
                                    value={createPassword}
                                    onChange={(e) => setCreatePassword(e.target.value)}
                                    className="admin-input"
                                    placeholder="Min 8 characters"
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleCreateAdmin}
                                disabled={loading}
                                className="flex-1 bg-black text-white py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-gray-800 transition-colors"
                            >
                                {loading ? "Creating..." : "Create Admin"}
                            </button>
                            <button
                                onClick={() => { setShowCreateModal(false); setCreateError(""); }}
                                className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
