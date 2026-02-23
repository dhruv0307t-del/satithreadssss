"use client";

import "./admin.css";
import Sidebar from "./components/Sidebar";
import { useSession } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="adm-layout">
      <Sidebar
        userName={session?.user?.name || "Admin"}
        userRole={session?.user?.role}
      />
      <div className="adm-content admin-main">
        {children}
      </div>
    </div>
  );
}
