"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { User, ChevronDown, Package, LogOut, Heart, UserCircle, Phone } from "lucide-react";
import Link from "next/link";

const DROPDOWN_CSS = `
/* ── Dropdown panel ── */
.account-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: -10px;
  width: 288px;
  background: #FFFFFF;
  border-radius: 18px;
  border: 1px solid rgba(58,107,80,0.10);
  box-shadow: 0 8px 40px rgba(40,60,40,0.13), 0 2px 8px rgba(40,60,40,0.07);
  overflow: hidden;
  z-index: 3000;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 640px) {
  .account-dropdown {
    right: 0;
  }
}

/* ── User info header ── */
.ad-header {
  padding: 16px 18px 15px;
  border-bottom: 1px solid rgba(58,107,80,0.08);
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #EAF4EE 0%, #F8F6EC 100%);
}
.ad-avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: #3A6B50;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(58,107,80,0.25);
  font-family: 'DM Sans', sans-serif;
}
.ad-user-info {
  flex: 1;
  min-width: 0;
}
.ad-user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1A1A14;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}
.ad-user-email {
  font-size: 11.5px;
  color: #6B7060;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 3px;
}
.ad-status-pill {
  flex-shrink: 0;
  background: rgba(58,107,80,0.12);
  color: #3A6B50;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 3px 9px;
  border-radius: 99px;
  border: 1px solid rgba(58,107,80,0.18);
  text-transform: uppercase;
}

/* ── Menu body ── */
.ad-menu {
  padding: 6px;
}
.ad-menu-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 10px;
  border-radius: 10px;
  text-decoration: none;
  color: #1A1A14;
  transition: background 0.13s;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  font-family: 'DM Sans', sans-serif;
  text-align: left;
}
.ad-menu-item:hover {
  background: #F2EFE0;
}
.ad-item-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: #F2EFE0;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.13s;
}
.ad-menu-item:hover .ad-item-icon {
  background: #EAF4EE;
}
.ad-item-text {
  flex: 1;
}
.ad-item-label {
  font-size: 13px;
  font-weight: 600;
  color: #1A1A14;
  line-height: 1.2;
}
.ad-item-desc {
  font-size: 11px;
  color: #7A8070;
  margin-top: 1px;
}
.ad-item-arrow {
  color: #C0C4B8;
  flex-shrink: 0;
  transition: transform 0.13s, color 0.13s;
}
.ad-menu-item:hover .ad-item-arrow {
  color: #3A6B50;
  transform: translateX(2px);
}

/* ── Divider ── */
.ad-divider {
  height: 1px;
  background: rgba(58,107,80,0.07);
  margin: 4px 6px;
}

/* ── Logout item ── */
.ad-menu-item.logout {
  color: #C0392B;
}
.ad-menu-item.logout .ad-item-label { color: #C0392B; }
.ad-menu-item.logout .ad-item-desc { color: #D47A72; }
.ad-menu-item.logout .ad-item-icon {
  background: #FDECEA;
}
.ad-menu-item.logout:hover {
  background: #FFF5F5;
}
.ad-menu-item.logout:hover .ad-item-icon {
  background: #FDECEA;
}
.ad-menu-item.logout .ad-item-arrow { color: #E8A09A; }
.ad-menu-item.logout:hover .ad-item-arrow { color: #C0392B; transform: translateX(2px); }

/* Removed mobile sheet behavior to maintain desktop dropdown look on all screens */
@media (max-width: 480px) {
  .account-dropdown {
    right: -20px;
    width: 250px;
  }
}
`;

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

  const initials = session.user.name
    ? session.user.name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase()
    : 'U';

  const menuItems = [
    {
      label: 'My Orders',
      desc: 'Track your purchases',
      href: '/my-orders',
      icon: <Package size={15} className="text-[#3A6B50]" />
    },
    {
      label: 'My Profile',
      desc: 'Edit account details',
      href: '/profile',
      icon: <UserCircle size={15} className="text-[#3A6B50]" />
    },
    {
      label: 'Wishlist',
      desc: 'Your saved items',
      href: '/wishlist',
      icon: <Heart size={15} className="text-[#3A6B50]" />
    },
    {
      label: 'Help & Support',
      desc: 'FAQs and guidance',
      href: '/about', // Or a help page
      icon: <User size={15} className="text-[#3A6B50]" />
    },
    {
      label: 'Contact Us',
      desc: 'Talk to our team',
      href: '/contact',
      icon: <Phone size={15} className="text-[#3A6B50]" />
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <style dangerouslySetInnerHTML={{ __html: DROPDOWN_CSS }} />

      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`nav-icon flex items-center gap-1 transition-colors ${isOpen ? 'text-[#3A6B50]' : ''}`}
        aria-label="Account menu"
      >
        <User size={20} />
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="account-dropdown">
          {/* User Info Header */}
          <div className="ad-header">
            <div className="ad-avatar">{initials}</div>
            <div className="ad-user-info">
              <div className="ad-user-name">{session.user.name}</div>
              <div className="ad-user-email">{session.user.email}</div>
            </div>
            <div className="ad-status-pill">Active</div>
          </div>

          {/* Menu Items */}
          <div className="ad-menu">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="ad-menu-item"
                onClick={() => setIsOpen(false)}
              >
                <div className="ad-item-icon">{item.icon}</div>
                <div className="ad-item-text">
                  <div className="ad-item-label">{item.label}</div>
                  <div className="ad-item-desc">{item.desc}</div>
                </div>
                <svg className="ad-item-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="ad-divider"></div>

          {/* Logout */}
          <div className="ad-menu" style={{ paddingBottom: '8px' }}>
            <button
              onClick={() => {
                signOut({ callbackUrl: "/" });
                setIsOpen(false);
              }}
              className="ad-menu-item logout"
            >
              <div className="ad-item-icon">
                <LogOut size={15} className="text-[#C0392B]" />
              </div>
              <div className="ad-item-text">
                <div className="ad-item-label">Logout</div>
                <div className="ad-item-desc">Sign out of your account</div>
              </div>
              <svg className="ad-item-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
