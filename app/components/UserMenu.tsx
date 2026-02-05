"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { User, ChevronDown, Package, LogOut } from "lucide-react";
import Link from "next/link";

export default function UserMenu() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    if (!session?.user) return null;

    return (
        <div className="relative" ref={menuRef}>
            {/* User Button - Simple icon like other nav items */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="nav-icon flex items-center gap-1"
            >
                <User size={20} />
                <ChevronDown
                    size={14}
                    className={`transition-transform hidden sm:block ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-[-10px] sm:right-0 mt-3 w-[260px] sm:w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[3000] overflow-hidden">
                    {/* User Info */}
                    <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/30">
                        <p className="text-sm font-semibold text-gray-900 leading-tight">
                            {session.user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                            {session.user.email}
                        </p>
                    </div>

                    {/* Menu Items */}
                    <Link
                        href="/my-orders"
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition active:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                    >
                        <Package size={18} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-800">My Orders</span>
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={() => {
                            signOut({ callbackUrl: "/home" });
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-5 py-3.5 hover:bg-gray-50 transition active:bg-gray-100 text-red-600 border-t border-gray-50 mt-1"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-semibold">Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
}
