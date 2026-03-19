"use client";

import { useEffect } from "react";
import "./admin.css";
import Sidebar from "./components/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (status === "unauthenticated" && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [status, router, isLoginPage]);

  // If it's the login page, just render children without layout wrapper (or with it, but no checks)
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F2EFE0]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A6B50]"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect via useEffect
  }

  const role = session?.user?.role;
  const isAuthorized = role === "admin" || role === "master_admin";

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F2EFE0] p-6 text-center font-['DM_Sans']">
        <div className="bg-white p-12 rounded-[32px] shadow-xl max-w-md w-full border border-red-100">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A14] mb-2">Access Denied</h1>
          <p className="text-[#6B7060] mb-8 italic">"You are logged in as a customer, but this area is for administrators only."</p>

          <div className="space-y-3">
            <button
              onClick={() => window.location.href = "/"}
              className="w-full bg-[#3A6B50] text-white py-3.5 rounded-2xl font-bold shadow-lg hover:bg-[#2d523d] transition-all"
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                // Sign out but redirect to admin login to switch
                const { signOut } = require("next-auth/react");
                signOut({ callbackUrl: "/admin/login" });
              }}
              className="w-full bg-white text-[#3A6B50] border border-[#3A6B50] py-3.5 rounded-2xl font-bold hover:bg-[#F2EFE0] transition-all"
            >
              Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

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
