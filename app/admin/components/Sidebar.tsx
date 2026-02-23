"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Plus,
  ShoppingCart,
  IndianRupee,
  Users,
  TicketPercent,
  MessageSquare,
  Palette,
  KeyRound,
  Shield,
  ExternalLink,
  LogOut,
} from "lucide-react";

const groups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "View Products", href: "/admin/products", icon: Package },
      { label: "Inventory", href: "/admin/inventory", icon: ClipboardList },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Revenue", href: "/admin/revenue", icon: IndianRupee },
      { label: "Coupons", href: "/admin/coupons", icon: TicketPercent },
      { label: "Contact Messages", href: "/admin/contact-messages", icon: MessageSquare },
      { label: "Website Update", href: "/admin/website-update", icon: Palette },
    ],
  },
  {
    label: "Quick Actions",
    items: [
      { label: "Add Product", href: "/admin/products/add", icon: Plus },
      { label: "Add Coupon", href: "/admin/coupons/add", icon: Plus },
      { label: "Settings", href: "/admin/settings", icon: KeyRound },
    ],
  },
];

export default function Sidebar({
  userName = "Admin",
  userRole,
}: {
  userName?: string;
  userRole?: string;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const displayName = session?.user?.name || userName;
  const initial = displayName?.charAt(0)?.toUpperCase() || "A";

  return (
    <aside className="adm-sidebar">
      {/* Logo */}
      <div className="adm-logo">
        <div className="adm-logo-mark">{initial}</div>
        <span className="adm-logo-text">Admin</span>
      </div>

      {/* Nav Groups */}
      <div className="adm-nav-scroll">
        {groups.map((group) => (
          <div className="adm-nav-group" key={group.label}>
            <div className="adm-nav-label">{group.label}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`adm-nav-item${isActive ? " active" : ""}`}
                >
                  <Icon size={15} strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Master Admin — only for master_admin */}
        {userRole === "master_admin" && (
          <>
            <div className="adm-nav-divider" />
            <div className="adm-nav-group">
              <Link href="/admin/master-admin" className={`adm-nav-item adm-master${pathname === "/admin/master-admin" ? " active" : ""}`}>
                <Shield size={15} strokeWidth={2} />
                Master Admin
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Bottom */}
      <div className="adm-sidebar-bottom">
        <div className="adm-nav-divider" />
        <Link href="/" className="adm-nav-item" style={{ marginBottom: 4 }}>
          <ExternalLink size={15} strokeWidth={2} />
          Visit Website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="adm-nav-item adm-signout"
        >
          <LogOut size={15} strokeWidth={2} />
          Sign Out
        </button>
        <div className="adm-user-chip">
          <div className="adm-avatar">{initial}</div>
          <div className="adm-user-info">
            <div className="adm-user-name">{displayName}</div>
            <div className="adm-user-role">
              {userRole === "master_admin" ? "Master Admin" : "Admin"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}