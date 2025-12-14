"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { FiHome, FiUserPlus, FiUsers, FiMessageCircle, FiLogOut, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSession } from "next-auth/react";

const sidebarLinks = [
  { href: "/station", label: "Dashboard", icon: <FiHome /> },
  { href: "/station/add-officer", label: "Add Officer", icon: <FiUserPlus /> },
  { href: "/station/manage-officer", label: "Manage Officer", icon: <FiUsers /> },
  { href: "/station/support", label: "Support", icon: <FiMessageCircle /> },
];

export default function UserSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = () => {
    router.push("/station/login");
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
                <span className="text-sm font-bold text-slate-800 line-clamp-1">{session?.user?.station_name || 'Station'}</span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{session?.user?.role || 'User Panel'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {sidebarLinks.map(link => {
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-4 py-4 rounded-2xl transition-all duration-300 font-semibold group relative overflow-hidden
                ${collapsed ? "justify-center px-0" : "px-5"}
                ${isActive 
                  ? "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105" 
                  : "text-slate-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 hover:shadow-md"
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
        {/* iPhone-style Dock Container */}
        <div className="px-4 pb-6 pointer-events-none">
          <div className="mx-auto max-w-md pointer-events-auto">
            {/* Glassmorphic Dock */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-[28px] shadow-2xl border border-white/50 px-3 py-2">
              <div className="flex items-center justify-around">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href;
                  
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`relative flex flex-col items-center justify-center gap-1.5 px-3 py-2.5 flex-1 rounded-2xl transition-all duration-300 active:scale-90 group
                      ${isActive ? 'bg-blue-100/60' : 'hover:bg-slate-100/40'}`}
                    >
                      {/* Icon with bounce effect */}
                      <div className={`relative transition-all duration-300 ${
                        isActive ? 'scale-110 -translate-y-0.5' : 'group-hover:scale-105'
                      }`}>
                        <span className={`text-2xl transition-colors ${
                          isActive ? 'text-blue-600' : 'text-slate-600'
                        }`}>
                          {link.icon}
                        </span>
                        
                        {/* Active indicator dot */}
                        {isActive && (
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      
                      {/* Label */}
                      <span className={`text-[9px] font-medium transition-all ${
                        isActive ? 'text-blue-600 opacity-100' : 'text-slate-600 opacity-70'
                      }`}>
                        {link.label.split(' ')[0]}
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

        /* iOS-style backdrop blur support */
        @supports (backdrop-filter: blur(20px)) or (-webkit-backdrop-filter: blur(20px)) {
          .backdrop-blur-2xl {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }
        }
      `}</style>
    </>
  );
}
