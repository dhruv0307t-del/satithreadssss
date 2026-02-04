"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(setUsers);
  }, []);

  return (
    <div className="admin-main text-black">
      <h1 className="admin-title mb-8">Users</h1>

      <div className="bg-white rounded-2xl">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Spent</th>
              <th>Subscribed</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr
                key={u._id}
                className="border-t cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/admin/users/${u._id}`)}
              >
                <td className="p-4">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.totalOrders}</td>
                <td>₹{u.totalSpent}</td>
                <td>{u.isSubscribed ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
