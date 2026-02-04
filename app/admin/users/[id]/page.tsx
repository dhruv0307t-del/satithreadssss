import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import Order from "@/app/models/Order";
import Product from "@/app/models/Product"; // Ensure Product model is registered
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

async function getUserDetails(id: string) {
    try {
        await connectDB();

        // Register Product model if not already (safeguard for population)
        // mongoose.models.Product || mongoose.model("Product", Product.schema);

        const user = await User.findById(id)
            .populate("wishlist")
            .populate("likedProducts")
            .lean();

        if (!user) return null;

        const orders = await Order.find({ user: id }).sort({ createdAt: -1 }).lean();

        // Verify calculated stats vs stored stats (optional, but good for display)
        const calculatedSpent = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        const calculatedOrders = orders.length;

        return {
            user: JSON.parse(JSON.stringify(user)),
            orders: JSON.parse(JSON.stringify(orders)),
            stats: {
                spent: calculatedSpent,
                count: calculatedOrders
            }
        };
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
    }
}

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getUserDetails(id);

    if (!data) {
        return notFound();
    }

    const { user, orders, stats } = data;

    return (
        <div className="admin-main text-black">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/users" className="text-gray-500 hover:text-black transition-colors">
                    ← Back to Users
                </Link>
                <h1 className="admin-title !mb-0">{user.name}'s Profile</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Orders</h3>
                    <div className="text-3xl font-bold text-gray-900">{stats.count}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Spent</h3>
                    <div className="text-3xl font-bold text-green-600">₹{stats.spent.toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">User Info</h3>
                    <div className="text-sm space-y-1">
                        <p><span className="font-medium">Email:</span> {user.email}</p>
                        <p><span className="font-medium">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
                        <p><span className="font-medium">Role:</span> <span className="uppercase bg-gray-100 px-2 py-0.5 rounded text-xs font-bold">{user.role}</span></p>
                        <p><span className="font-medium">Subscribed:</span> {user.isSubscribed ? "Yes" : "No"}</p>
                    </div>
                </div>
            </div>

            {/* Orders Section */}
            <div className="admin-section">
                <h2 className="text-xl font-bold mb-4">Order History</h2>
                {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-sm text-gray-500 uppercase">
                                <tr>
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Items</th>
                                    <th className="p-4">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order: any) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-mono text-sm text-gray-600">{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                                        <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                                                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.orderStatus.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            <div className="space-y-2">
                                                {order.items.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-3">
                                                        <div className="relative w-10 h-12 flex-shrink-0 bg-gray-100 rounded">
                                                            {item.image ? (
                                                                <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">N/A</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900 line-clamp-1 text-xs">{item.name}</div>
                                                            <div className="text-xs text-gray-500">
                                                                {item.size} &bull; Qty: {item.quantity}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium">₹{order.totalAmount?.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No orders found.</p>
                )}
            </div>

            {/* Liked Products Section */}
            <div className="admin-section">
                <h2 className="text-xl font-bold mb-4">Liked Products ({user.likedProducts?.length || 0})</h2>
                {user.likedProducts?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {user.likedProducts.map((product: any) => (
                            <Link href={`/product/${product._id}`} key={product._id} className="group block border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative aspect-[3/4] bg-gray-100">
                                    {product.mainImage ? (
                                        <Image src={product.mainImage} alt={product.name} fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <h3 className="font-medium text-sm truncate" title={product.name}>{product.name}</h3>
                                    <p className="text-sm font-bold mt-1">₹{product.priceNew}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No liked products.</p>
                )}
            </div>

            {/* Wishlist Section */}
            <div className="admin-section">
                <h2 className="text-xl font-bold mb-4">Wishlist ({user.wishlist?.length || 0})</h2>
                {user.wishlist?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {user.wishlist.map((product: any) => (
                            <Link href={`/product/${product._id}`} key={product._id} className="group block border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative aspect-[3/4] bg-gray-100">
                                    {product.mainImage ? (
                                        <Image src={product.mainImage} alt={product.name} fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <h3 className="font-medium text-sm truncate" title={product.name}>{product.name}</h3>
                                    <p className="text-sm font-bold mt-1">₹{product.priceNew}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Wishlist is empty.</p>
                )}
            </div>

        </div>
    );
}
