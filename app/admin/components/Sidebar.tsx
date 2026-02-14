"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  TicketPercent,
  ShoppingCart,
  IndianRupee,
  LogOut,
  ExternalLink,
  Plus,
  Palette,
  ClipboardList,
  MessageSquare,
} from "lucide-react";

const menu = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "View Products", href: "/admin/products", icon: Package },
  { label: "Inventory", href: "/admin/inventory", icon: ClipboardList },
  { label: "Add Product", href: "/admin/products/add", icon: Plus },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Revenue", href: "/admin/revenue", icon: IndianRupee },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: TicketPercent },
  { label: "Add Coupon", href: "/admin/coupons/add", icon: Plus },
  { label: "Contact Messages", href: "/admin/contact-messages", icon: MessageSquare },
  { label: "Website Update", href: "/admin/website-update", icon: Palette },
];

export default function Sidebar({ userName = "Admin" }: { userName?: string }) {
  return (
    <aside className="admin-sidebar">
      {/* Top section */}
      <div>
        {/* Avatar + Brand */}
        <div className="flex items-center gap-3 mb-10">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-xl"
            style={{ backgroundColor: "var(--admin-accent)" }}
          >
            {userName?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <span
            className="font-semibold text-xl"
            style={{ color: "var(--admin-text)" }}
          >
            Admin
          </span>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1.5">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] transition-colors"
                style={{
                  color: "var(--admin-text)",
                }}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="space-y-2 mt-8">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] transition-colors"
          style={{ color: "var(--admin-text)" }}
        >
          <ExternalLink size={18} strokeWidth={1.8} />
          <span>Visit Website</span>
        </Link>

        <button
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] w-full text-left transition-colors"
          style={{ color: "#dc2626" }} // red for sign out
        >
          <LogOut size={18} strokeWidth={1.8} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}