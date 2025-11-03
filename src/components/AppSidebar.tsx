"use client";

import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { getFilteredMenuItems } from "@/constants/menuItems";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuthMe } from "@/hooks/useAuthMe";

interface AppSidebarProps {
  activeItem?: string;
}

const AppSidebar = ({ activeItem = "Dashboard" }: AppSidebarProps) => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const { data: user } = useAuthMe();

  const userRole = user?.role_name || "";
  const filteredMenuItems = getFilteredMenuItems(userRole);

  const toggleMenu = (menuName: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  const isSubmenuActive = (submenuHref: string) => {
    return pathname.startsWith(submenuHref);
  };

  const shouldMenuBeOpen = (menuName: string, submenu?: Array<{ href: string }>) => {
    if (openMenus.includes(menuName)) return true;
    if (submenu) {
      return submenu.some((sub) => isSubmenuActive(sub.href));
    }
    return false;
  };

  return (
    <Sidebar
      className="border-r-0 backdrop-blur-xl shadow-2xl rounded-r-3xl overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(0,123,255,0.05) 100%)",
      }}
    >
      <SidebarHeader className="px-6 pt-6">
        <div className="flex items-center justify-center">
          {/* Glassmorphism wrapper untuk logo */}
          <div className="relative px-10 py-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 shadow-2xl">
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-[#007BFF]/10 rounded-2xl pointer-events-none"></div>

            <Image
              src="/images/logo_main.png"
              alt="Logo"
              width={160}
              height={45}
              className="relative z-10 transition-transform duration-300 hover:scale-105"
            />

            {/* Outer glow effect - warna lebih strong */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#007BFF]/10 to-[#A0F000]/10 blur-xl -z-10 rounded-2xl"></div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarMenu className="space-y-2">
          {filteredMenuItems.map((item) => {
            const isActive = activeItem === item.name;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isMenuOpen = shouldMenuBeOpen(item.name, item.submenu);

            return (
              <SidebarMenuItem key={item.name}>
                {hasSubmenu ? (
                  <>
                    <SidebarMenuButton
                      onClick={() => toggleMenu(item.name)}
                      className={`
                        group relative overflow-hidden
                        flex items-center gap-3 px-4 py-6 rounded-2xl 
                        transition-all duration-300 ease-in-out
                        backdrop-blur-md
                        ${isActive || isMenuOpen
                          ? "bg-gradient-to-r from-[#007BFF]/90 to-[#0066DD]/90 !text-white shadow-xl shadow-[#007BFF]/30 border border-white/20"
                          : "bg-white/50 !text-gray-700 border border-white/40 hover:border-[#007BFF]/30"
                        }
                        hover:scale-[1.02] hover:shadow-lg
                        ${!isActive &&
                        !isMenuOpen &&
                        "hover:bg-white/70 hover:!text-[#007BFF]"
                        }
                      `}
                    >
                      {/* Glassmorphism inner glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

                      <item.icon
                        className={`
                          h-5 w-5 flex-shrink-0 transition-all duration-300 relative z-10
                          ${isActive || isMenuOpen
                            ? "text-white drop-shadow-lg"
                            : "text-gray-600 group-hover:text-[#007BFF]"
                          }
                        `}
                      />

                      <span
                        className={`
                          text-sm font-bold transition-all duration-300 flex-1 relative z-10
                          ${isActive || isMenuOpen
                            ? "text-white"
                            : "text-gray-700 group-hover:text-[#007BFF]"
                          }
                        `}
                      >
                        {item.title}
                      </span>

                      <ChevronDown
                        className={`
                          h-4 w-4 transition-transform duration-300 relative z-10
                          ${isMenuOpen ? "rotate-180" : ""}
                          ${isActive || isMenuOpen
                            ? "text-white"
                            : "text-gray-600 group-hover:text-[#007BFF]"
                          }
                        `}
                      />

                      {(isActive || isMenuOpen) && (
                        <div className="absolute left-0 w-1.5 h-2/3 bg-white rounded-r-full opacity-90 shadow-lg"></div>
                      )}
                    </SidebarMenuButton>

                    {isMenuOpen && (
                      <SidebarMenuSub className="mt-2 ml-3 space-y-1.5">
                        {item.submenu?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.name}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubmenuActive(subItem.href)}
                              className={`
                                py-4 text-sm font-semibold rounded-xl
                                transition-all duration-300 backdrop-blur-sm
                                ${isSubmenuActive(subItem.href)
                                  ? "bg-gradient-to-r from-[#A0F000]/90 to-[#8FD000]/90 !text-gray-900 shadow-lg shadow-[#A0F000]/30 border border-white/30"
                                  : "bg-white/40 !text-gray-700 hover:bg-white/60 hover:!text-gray-900 border border-white/30 hover:border-[#A0F000]/40"
                                }
                              `}
                            >
                              <a
                                href={subItem.href}
                                className="flex items-center gap-3 w-full relative"
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-xl"></div>
                                <subItem.icon className="h-4 w-4 relative z-10" />
                                <span className="relative z-10">
                                  {subItem.title}
                                </span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </>
                ) : (
                  <SidebarMenuButton
                    asChild
                    className={`
                      group relative overflow-hidden
                      flex items-center gap-3 px-4 py-3.5 rounded-2xl 
                      transition-all duration-300 ease-in-out backdrop-blur-md
                      ${isActive
                        ? "bg-gradient-to-r from-[#007BFF]/90 to-[#0066DD]/90 !text-white shadow-xl shadow-[#007BFF]/30 border border-white/20"
                        : "bg-white/50 !text-gray-700 border border-white/40 hover:border-[#007BFF]/30"
                      }
                      hover:scale-[1.02] hover:shadow-lg
                      ${!isActive && "hover:bg-white/70 hover:!text-[#007BFF]"}
                    `}
                  >
                    <a
                      href={item.href}
                      className="flex items-center gap-3 w-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

                      <item.icon
                        className={`
                          h-5 w-5 flex-shrink-0 transition-all duration-300 relative z-10
                          ${isActive
                            ? "text-white drop-shadow-lg"
                            : "text-gray-600 group-hover:text-[#007BFF]"
                          }
                        `}
                      />

                      <span
                        className={`
                          text-sm font-bold transition-all duration-300 relative z-10
                          ${isActive
                            ? "text-white"
                            : "text-gray-700 group-hover:text-[#007BFF]"
                          }
                        `}
                      >
                        {item.title}
                      </span>

                      {isActive && (
                        <div className="absolute left-0 w-1.5 h-2/3 bg-white rounded-r-full opacity-90 shadow-lg"></div>
                      )}
                    </a>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
