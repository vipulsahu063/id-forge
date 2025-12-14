"use client"

import Image from "next/image";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { FiHome, FiSettings, FiMapPin, FiUsers, FiMessageCircle, FiChevronRight, FiChevronLeft, FiChevronDown, FiLogOut } from "react-icons/fi";

import { NavLink } from "@/app/types/navigation";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: <FiHome /> },
  {
    label: "Station Management",
    icon: <FiMapPin />,
    subLinks: [
      { href: "/admin/add-station", label: "Add Station" },
      { href: "/admin/station-field", label: "Station Field" },
      { href: "/admin/manage-station", label: "Manage Station" },
    ]
  },
  {
    label: "Officer Management",
    icon: <FiUsers />,
    subLinks: [
      { href: "/admin/add-officer", label: "Add Officer" },
      { href: "/admin/manage-officer", label: "Manage Officer" },
    ]
  },
  { href: "/admin/support", label: "Support", icon: <FiMessageCircle /> },
  { href: "/admin/change-password", label: "Change Password", icon: <FiSettings /> },
];

// Main navigation items for mobile
const mobileNavLinks = [
  { href: "/admin", label: "Home", icon: <FiHome /> },
  {
    label: "Stations",
    icon: <FiMapPin />,
    subLinks: [
      { href: "/admin/add-station", label: "Add Station" },
      { href: "/admin/station-field", label: "Station Field" },
      { href: "/admin/manage-station", label: "Manage Station" },
    ]
  },
  {
    label: "Officers",
    icon: <FiUsers />,
    subLinks: [
      { href: "/admin/add-officer", label: "Add Officer" },
      { href: "/admin/manage-officer", label: "Manage Officer" },
    ]
  },
  { href: "/admin/support", label: "Support", icon: <FiMessageCircle /> },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(["Station Management", "Officer Management"]);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState(0);
  const buttonRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const toggleGroup = (label: string) => {
    setOpenGroups(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const handleLogout = () => {
    router.push("/admin-login");
  };

  const toggleMobileSubmenu = (label: string, index: number) => {
    if (mobileSubmenu === label) {
      setMobileSubmenu(null);
    } else {
      setMobileSubmenu(label);
      const button = buttonRefs.current[index];
      if (button) {
        const rect = button.getBoundingClientRect();
        setSubmenuPosition(rect.left + rect.width / 2);
      }
    }
  };

  const isLinkActive = (link: NavLink): boolean => {
    if ('href' in link) {
      return pathname === link.href;
    }
    if ('subLinks' in link) {
      return link.subLinks.some((sub) => sub.href === pathname);
    }
    return false;
  };

  return (
    <>
      {/* Desktop Sidebar - Enhanced */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-white border-r-2 border-slate-200 shadow-xl transition-all duration-300 relative group/sidebar
        ${collapsed ? "w-24" : "w-72"}`}
      >
        {/* Toggle Button - Outside and Centered (Visible on Hover) */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="absolute top-1/2 -translate-y-1/2 -right-4 p-2.5 rounded-full bg-white border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-lg hover:shadow-xl z-50 opacity-0 group-hover/sidebar:opacity-100"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          type="button"
        >
          {collapsed ? <FiChevronRight size={18} className="text-blue-600" /> : <FiChevronLeft size={18} className="text-blue-600" />}
        </button>

        {/* Minimal Logo Section */}
        <div className="p-6 pb-8">
          <div className={`flex flex-col items-center gap-3`}>
            <Image 
              src='/logo.png'
              alt="Logo"
              width={collapsed ? 45 : 100}
              height={collapsed ? 45 : 40}
              className="object-contain transition-all duration-300"
            />
            {!collapsed && (
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-sm font-bold text-slate-800">Admin Panel</span>
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-lg">{session?.user?.email || 'Administrator'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {sidebarLinks.map(link => {
            const isActive = isLinkActive(link);
            
            return (
              <div key={link.label}>
                {'subLinks' in link ? (
                  <div>
                    <button
                      onClick={() => !collapsed && toggleGroup(link.label)}
                      className={`w-full flex items-center gap-4 py-4 rounded-2xl transition-all duration-300 font-semibold group relative overflow-hidden
                      ${collapsed ? "justify-center px-0" : "px-5 justify-between"}
                      ${isActive 
                        ? "bg-linear-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105" 
                        : "text-slate-700 hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 hover:shadow-md"
                      }`}
                    >
                      {/* Background decoration for active state */}
                      {isActive && (
                        <div className="absolute inset-0 bg-white opacity-10 rounded-2xl"></div>
                      )}
                      
                      <div className="flex items-center gap-4 relative z-10">
                        <span className={`text-2xl transition-transform duration-300 ${
                          isActive ? 'scale-110' : 'group-hover:scale-110'
                        }`}>
                          {link.icon}
                        </span>
                        {!collapsed && (
                          <span className="text-sm">{link.label}</span>
                        )}
                      </div>
                      {!collapsed && (
                        <FiChevronDown
                          size={18}
                          className={`transition-transform duration-300 relative z-10 ${
                            openGroups.includes(link.label) ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                      
                      {/* Active indicator bar */}
                      {isActive && !collapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full"></div>
                      )}
                    </button>

                    {!collapsed && openGroups.includes(link.label) && (
                      <div className="ml-8 mt-2 space-y-1 border-l-2 border-purple-200 pl-4">
                        {link.subLinks?.map(subLink => {
                          const isSubActive = pathname === subLink.href;
                          return (
                            <Link
                              key={subLink.href}
                              href={subLink.href}
                              className={`flex items-center py-2.5 px-4 rounded-xl transition-all duration-300 text-sm font-medium
                              ${isSubActive 
                                ? 'bg-purple-100 text-purple-700 shadow-sm' 
                                : 'text-slate-600 hover:bg-purple-50 hover:text-purple-600'
                              }`}
                            >
                              {subLink.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={`flex items-center gap-4 py-4 rounded-2xl transition-all duration-300 font-semibold group relative overflow-hidden
                    ${collapsed ? "justify-center px-0" : "px-5"}
                    ${isActive 
                      ? "bg-linear-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105" 
                      : "text-slate-700 hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 hover:shadow-md"
                    }`}
                  >
                    {/* Background decoration for active state */}
                    {isActive && (
                      <div className="absolute inset-0 bg-white opacity-10 rounded-2xl"></div>
                    )}
                    
                    {/* Icon */}
                    <span className={`text-2xl relative z-10 transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                      {link.icon}
                    </span>
                    
                    {/* Label */}
                    {!collapsed && (
                      <span className="text-sm relative z-10">{link.label}</span>
                    )}
                    
                    {/* Active indicator bar */}
                    {isActive && !collapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full"></div>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="px-4 pb-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 py-4 rounded-2xl transition-all duration-300 font-semibold group hover:shadow-lg
            ${collapsed ? "justify-center px-0" : "px-5"}
            bg-linear-to-r from-red-50 to-pink-50 text-red-600 hover:from-red-500 hover:to-pink-600 hover:text-white border-2 border-red-200 hover:border-red-500`}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              <FiLogOut />
            </span>
            {!collapsed && (
              <span className="text-sm">Logout</span>
            )}
          </button>
        </div>

        {/* Minimal Footer Section */}
        <div className="px-5 pb-5">
          {!collapsed ? (
            <p className="text-[10px] text-slate-400 text-center">
              &copy; 2025 Vipul Sahu
            </p>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation - iPhone Dock Style */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        {/* Submenu Bubbles */}
        {mobileSubmenu && (
          <>
            <div 
              className="fixed inset-0 pointer-events-auto"
              onClick={() => setMobileSubmenu(null)}
            />
            
            <div 
              className="absolute bottom-[100px] pointer-events-auto"
              style={{
                left: `${submenuPosition}px`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="flex flex-col items-center gap-2">
                {mobileNavLinks.find(link => link.label === mobileSubmenu && 'subLinks' in link)?.subLinks?.slice().reverse().map((subLink, index) => (
                  <Link
                    key={subLink.href}
                    href={subLink.href}
                    onClick={() => setMobileSubmenu(null)}
                    className={`px-5 py-2.5 rounded-full text-xs font-medium shadow-lg backdrop-blur-xl border transition-all animate-bubbleUp whitespace-nowrap ${
                      pathname === subLink.href
                        ? 'bg-purple-500/90 text-white border-purple-400/50'
                        : 'bg-white/80 text-slate-700 border-white/50 hover:bg-white/90 active:scale-95'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    {subLink.label}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {/* iPhone-style Dock Container */}
        <div className="px-4 pb-6 pointer-events-none">
          <div className="mx-auto max-w-md pointer-events-auto">
            {/* Glassmorphic Dock */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-[28px] shadow-2xl border border-white/50 px-3 py-2">
              <div className="flex items-center justify-around">
                {mobileNavLinks.map((link, index) => {
                  const isActive = 'href' in link 
                    ? pathname === link.href 
                    : 'subLinks' in link && link.subLinks.some(sub => sub.href === pathname);
                  
                  const handleClick = (e: React.MouseEvent) => {
                    if ('subLinks' in link) {
                      e.preventDefault();
                      toggleMobileSubmenu(link.label, index);
                    } else {
                      setMobileSubmenu(null);
                    }
                  };

                  return (
                    <Link
                      key={link.label}
                      href={('href' in link ? link.href : '#') as string}
                      onClick={handleClick}
                      ref={(el) => {
                        buttonRefs.current[index] = el;
                      }}
                      className={`relative flex flex-col items-center justify-center gap-1.5 px-3 py-2.5 flex-1 rounded-2xl transition-all duration-300 active:scale-90 group
                      ${isActive ? 'bg-purple-100/60' : 'hover:bg-slate-100/40'}`}
                    >
                      {/* Icon with bounce effect */}
                      <div className={`relative transition-all duration-300 ${
                        isActive ? 'scale-110 -translate-y-0.5' : 'group-hover:scale-105'
                      }`}>
                        <span className={`text-2xl transition-colors ${
                          isActive ? 'text-purple-600' : 'text-slate-600'
                        }`}>
                          {link.icon}
                        </span>
                        
                        {/* Active indicator dot */}
                        {isActive && (
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full" />
                        )}
                      </div>
                      
                      {/* Label */}
                      <span className={`text-[9px] font-medium transition-all ${
                        isActive ? 'text-purple-600 opacity-100' : 'text-slate-600 opacity-70'
                      }`}>
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="relative flex flex-col items-center justify-center gap-1.5 px-3 py-2.5 flex-1 rounded-2xl transition-all duration-300 active:scale-90 hover:bg-red-50/40 group"
                >
                  <div className="transition-all duration-300 group-hover:scale-105">
                    <span className="text-2xl text-slate-600 group-hover:text-red-600 transition-colors">
                      <FiLogOut />
                    </span>
                  </div>
                  <span className="text-[9px] font-medium text-slate-600 opacity-70 group-hover:text-red-600 transition-colors">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        @media (max-width: 768px) {
          main {
            padding-bottom: 100px;
          }
        }

        @keyframes bubbleUp {
          from {
            transform: translateY(20px) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .animate-bubbleUp {
          animation: bubbleUp 250ms cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
        }

        /* iOS-style backdrop blur support */
        @supports (backdrop-filter: blur(20px)) or (-webkit-backdrop-filter: blur(20px)) {
          .backdrop-blur-2xl {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }
          
          .backdrop-blur-xl {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
          }
        }
      `}</style>
    </>
  );
}
