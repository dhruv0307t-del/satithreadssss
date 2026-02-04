import Order from "@/app/models/Order";
import { connectDB } from "@/app/lib/db";

export default async function OrderSuccess({ params }: any) {
  await connectDB();

  // In Next.js 15+, params is a Promise
  const { id } = await params;
  const order = await Order.findById(id).lean();

  if (!order) {
    return (
      <div className="p-10">
        <h1>Order Not Found</h1>
        <p>The order you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1>Order Placed Successfully 🎉</h1>
      <p>Order ID: {order._id.toString()}</p>
      <p>Total: Rs. {order.totalAmount}</p>
      <p>Status: {order.orderStatus}</p>
    </div>
  );
}
