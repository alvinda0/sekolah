"use client";

import { useState } from "react";
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
import { getFilteredMenuItems } from "@/constants/menuItems";
import { ChevronDown, GraduationCap } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuthMe } from "@/hooks/useAuthMe";

interface AppSidebarProps {
  activeItem?: string;
}

const AppSidebar = ({ activeItem = "Dashboard" }: AppSidebarProps) => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const { data: user } = useAuthMe();

  const userRole = user?.role || "";
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
      className="border-r-0 overflow-hidden h-screen"
      style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
      }}
    >
      <div 
        className="absolute inset-0 -z-10 rounded-r-3xl"
        style={{
          background: "linear-gradient(135deg, rgb(30,58,138) 0%, rgb(59,130,246) 100%)",
        }}
      />
      <SidebarHeader className="h-20 px-6 flex items-center justify-center relative z-10">
        <div className="flex items-center gap-3">
          {/* Icon Logo dengan background */}
          <div className="relative p-2.5 rounded-xl bg-white/95 backdrop-blur-md border-2 border-white shadow-xl">
            <GraduationCap className="h-8 w-8 text-blue-700" strokeWidth={2.5} />
            
            {/* Outer glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/30 to-amber-500/30 blur-lg -z-10 rounded-xl"></div>
          </div>
          
          {/* School Name */}
          <div className="text-left">
            <h2 className="text-base font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight tracking-wide">
              School System
            </h2>
            <p className="text-xs text-yellow-300 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] tracking-wide">
              Management Portal
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6 relative z-10">
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
                          ? "bg-white/95 !text-blue-900 shadow-xl shadow-white/20 border-2 border-white"
                          : "bg-white/80 !text-gray-900 border border-white/50 hover:border-yellow-400"
                        }
                        hover:scale-[1.02] hover:shadow-lg
                        ${!isActive &&
                        !isMenuOpen &&
                        "hover:bg-white/90"
                        }
                      `}
                    >
                      {/* Glassmorphism inner glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

                      <item.icon
                        className={`
                          h-5 w-5 flex-shrink-0 transition-all duration-300 relative z-10
                          ${isActive || isMenuOpen
                            ? "text-blue-700 drop-shadow-lg"
                            : "text-gray-700 group-hover:text-yellow-600"
                          }
                        `}
                        strokeWidth={2.5}
                      />

                      <span
                        className={`
                          text-sm font-bold transition-all duration-300 flex-1 relative z-10
                          ${isActive || isMenuOpen
                            ? "text-blue-900"
                            : "text-gray-900 group-hover:text-yellow-700"
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
                            ? "text-blue-700"
                            : "text-gray-700 group-hover:text-yellow-600"
                          }
                        `}
                        strokeWidth={2.5}
                      />

                      {(isActive || isMenuOpen) && (
                        <div className="absolute left-0 w-1.5 h-2/3 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-r-full shadow-lg"></div>
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
                                  ? "bg-gradient-to-r from-yellow-400 to-amber-500 !text-gray-900 shadow-lg shadow-yellow-500/30 border border-yellow-300"
                                  : "bg-white/70 !text-gray-800 hover:bg-white/85 border border-white/50 hover:border-yellow-400"
                                }
                              `}
                            >
                              <a
                                href={subItem.href}
                                className="flex items-center gap-3 w-full relative"
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-xl"></div>
                                <subItem.icon className="h-4 w-4 relative z-10" strokeWidth={2.5} />
                                <span className="relative z-10 drop-shadow-sm">
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
                        ? "bg-white/95 !text-blue-900 shadow-xl shadow-white/20 border-2 border-white"
                        : "bg-white/80 !text-gray-900 border border-white/50 hover:border-yellow-400"
                      }
                      hover:scale-[1.02] hover:shadow-lg
                      ${!isActive && "hover:bg-white/90"}
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
                            ? "text-blue-700 drop-shadow-lg"
                            : "text-gray-700 group-hover:text-yellow-600"
                          }
                        `}
                        strokeWidth={2.5}
                      />

                      <span
                        className={`
                          text-sm font-bold transition-all duration-300 relative z-10
                          ${isActive
                            ? "text-blue-900"
                            : "text-gray-900 group-hover:text-yellow-700"
                          }
                        `}
                      >
                        {item.title}
                      </span>

                      {isActive && (
                        <div className="absolute left-0 w-1.5 h-2/3 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-r-full shadow-lg"></div>
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
