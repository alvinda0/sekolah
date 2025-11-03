// components/Header.tsx
"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  MenuSquare,
  PanelRightClose,
  LogOut, User,
  UserLock,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { authService } from "@/services/auth.service";
import { getFilteredMenuItems, getMenuItemByPath } from "@/constants/menuItems";
import { useAuthMe } from "@/hooks/useAuthMe";
import Link from "next/link";

const Divider = ({ className = "my-4" }: { className?: string }) => (
  <div className={`border-t border-white/30 ${className}`} />
);

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileOpenMenus, setMobileOpenMenus] = useState<string[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const { data: user } = useAuthMe();

  const { menuItem, subMenuItem } = getMenuItemByPath(pathname);
  const currentTitle = subMenuItem?.title || menuItem?.title || "Dashboard";
  const currentMenuName = menuItem?.name || "Dashboard";

  const userName = user?.name || "User";
  const userRole = user?.role_name || "User";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const twoFAEnabled = user?.is_2fa || false;
  const filteredMenuItems = getFilteredMenuItems(userRole);

  const toggleMobileMenu = (menuName: string) => {
    setMobileOpenMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  const isMobileSubmenuActive = (submenuHref: string) => {
    return pathname.startsWith(submenuHref);
  };

  const shouldMobileMenuBeOpen = (menuName: string, submenu?: Array<{ href: string }>) => {
    if (mobileOpenMenus.includes(menuName)) return true;
    if (submenu) {
      return submenu.some((sub) => isMobileSubmenuActive(sub.href));
    }
    return false;
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      authService.logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/auth/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleChangePassword = () => {
    router.push("/profile/change-password");
    setIsMobileProfileOpen(false);
  };

  const handleProfile = () => {
    router.push("/profile");
    setIsMobileProfileOpen(false);
  };

  const handleTwoFactorAuth = () => {
    router.push("/profile/two-factor");
    setIsMobileProfileOpen(false);
  };

  return (
    <>
      {/* Desktop Header */}
      <header
        className="hidden md:flex w-full h-20 px-8 items-center justify-between border-b-0 shadow-lg backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(0,123,255,0.1) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.3)',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-10 w-1.5 bg-gradient-to-b from-[#007BFF] via-[#007BFF] to-[#A0F000] rounded-full shadow-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#007BFF] to-[#A0F000] blur-md opacity-50"></div>
          </div>
          <h1 className="text-xl font-bold text-gray-800 drop-shadow-sm">{currentTitle}</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-3 backdrop-blur-md bg-white/50 border border-white/40 rounded-2xl px-5 py-2.5 transition-all duration-300 focus:outline-none group hover:bg-white/70 hover:shadow-lg hover:scale-[1.02]">
            <Avatar className="h-9 w-9 ring-2 ring-[#007BFF]/50 transition-all duration-300 group-hover:ring-[#007BFF] shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-[#007BFF] to-[#A0F000] text-white text-sm font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start">
              <span className="text-sm font-bold text-gray-800 group-hover:text-[#007BFF] transition-colors">
                {userName}
              </span>
              <span className="text-xs font-medium text-gray-500">
                {userRole}
              </span>
            </div>

            <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-[#007BFF] transition-colors" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-72 p-0 border-white/40 backdrop-blur-xl bg-white/95 shadow-2xl rounded-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-white/30">
                <Avatar className="h-12 w-12 ring-2 ring-[#007BFF] shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-[#007BFF] to-[#A0F000] text-white text-base font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-gray-800">
                    {userName}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {userRole}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <button
                  className="flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 text-gray-700
   backdrop-blur-sm bg-white/50 hover:bg-white/80 hover:border-[#007BFF]/30 border border-white/40
   focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:ring-opacity-30
   active:scale-[0.98] cursor-pointer group shadow-sm hover:shadow-md"
                  onClick={handleProfile}
                >
                  <User className="w-5 h-5 mr-3 text-gray-500 group-hover:text-[#007BFF] transition-colors" />
                  <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                    Profile
                  </span>
                </button>
                <button
                  className="flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 text-gray-700
                   backdrop-blur-sm bg-white/50 hover:bg-white/80 hover:border-[#007BFF]/30 border border-white/40
                   focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:ring-opacity-30
                   active:scale-[0.98] cursor-pointer group shadow-sm hover:shadow-md"
                  onClick={handleChangePassword}
                >
                  <UserLock className="w-5 h-5 mr-3 text-gray-500 group-hover:text-[#007BFF] transition-colors" />
                  <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                    Change Password
                  </span>
                </button>

                <button
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 text-gray-700
                   backdrop-blur-sm bg-white/50 hover:bg-gradient-to-r hover:from-[#A0F000]/20 hover:to-[#A0F000]/10 hover:border-[#A0F000]/30 border border-white/40
                   focus:outline-none focus:ring-2 focus:ring-[#A0F000] focus:ring-opacity-30
                   active:scale-[0.98] cursor-pointer group shadow-sm hover:shadow-md"
                  onClick={handleTwoFactorAuth}
                >
                  <div className="flex items-center">
                    {twoFAEnabled ? (
                      <ShieldCheck className="w-5 h-5 mr-3 text-[#A0F000]" />
                    ) : (
                      <Shield className="w-5 h-5 mr-3 text-gray-500 group-hover:text-[#A0F000] transition-colors" />
                    )}
                    <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                      {twoFAEnabled ? "Manage 2FA" : "Enable 2FA"}
                    </span>
                  </div>

                  {twoFAEnabled ? (
                    <Badge className="bg-[#A0F000]/30 text-[#A0F000] border-[#A0F000]/40 font-bold backdrop-blur-sm">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-200/50 text-gray-600 border-gray-300/50 backdrop-blur-sm">
                      Inactive
                    </Badge>
                  )}
                </button>
              </div>

              <Divider className="my-4" />

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center justify-center w-full px-4 py-3 rounded-xl font-bold transition-all duration-200 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                <LogOut className="w-5 h-5 mr-2" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Mobile Header */}
      <header
        className="md:hidden w-full h-16 px-4 flex items-center justify-between border-b-0 shadow-lg backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(0,123,255,0.1) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.3)',
        }}
      >
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-white/50 rounded-xl transition-all backdrop-blur-sm border border-white/40 hover:shadow-md">
              <MenuSquare className="h-6 w-6 text-gray-700" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 p-0 border-white/40 backdrop-blur-xl bg-white/95"
          >
            <SheetTitle className="sr-only">Menu Navigation</SheetTitle>
            <div className="flex flex-col h-full">
              <div className="flex-shrink-0 p-6 backdrop-blur-md bg-gradient-to-br from-white/60 to-[#007BFF]/10">
                <div className="flex items-center justify-between mb-4">
                  <Image
                    src="/images/logo_mini.png"
                    alt="Logo"
                    width={50}
                    height={50}
                    className="object-contain drop-shadow-lg"
                  />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 hover:bg-white/50 rounded-xl transition-all backdrop-blur-sm"
                  >
                    <PanelRightClose className="h-8 w-8 text-gray-600 hover:text-[#007BFF]" />
                  </button>
                </div>
                <Divider className="mb-0" />
              </div>

              <nav className="flex-1 overflow-y-auto px-6 pb-6 space-y-2 bg-gradient-to-b from-[#007BFF]/5 to-transparent">
                {filteredMenuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentMenuName === item.name;
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  const isMenuOpen = shouldMobileMenuBeOpen(item.name, item.submenu);

                  return (
                    <div key={item.name}>
                      {hasSubmenu ? (
                        <>
                          <button
                            onClick={() => toggleMobileMenu(item.name)}
                            className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all backdrop-blur-sm ${isActive || isMenuOpen
                              ? "text-white bg-gradient-to-r from-[#007BFF]/90 to-[#0066DD]/90 shadow-lg border border-white/20"
                              : "text-gray-700 hover:text-gray-900 bg-white/50 hover:bg-white/70 border border-white/40 hover:border-[#007BFF]/30"
                              }`}
                          >
                            <div className="flex items-center">
                              <IconComponent className="w-5 h-5 mr-3" />
                              <span className="font-bold text-sm">{item.title}</span>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${isMenuOpen ? "rotate-180" : ""
                                }`}
                            />
                          </button>

                          {isMenuOpen && (
                            <div className="mt-2 ml-4 space-y-1">
                              {item.submenu?.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className={`flex items-center px-4 py-2.5 rounded-xl transition-all text-sm backdrop-blur-sm ${isMobileSubmenuActive(subItem.href)
                                    ? "text-gray-900 bg-gradient-to-r from-[#A0F000]/90 to-[#8FD000]/90 font-bold shadow-md border border-white/30"
                                    : "text-gray-600 hover:text-gray-900 bg-white/40 hover:bg-white/60 border border-white/30 hover:border-[#A0F000]/40"
                                    }`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <subItem.icon className="w-4 h-4 mr-3" />
                                  <span className="font-semibold">{subItem.title}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className={`flex items-center px-4 py-3 rounded-xl transition-all backdrop-blur-sm ${isActive
                            ? "text-white bg-gradient-to-r from-[#007BFF]/90 to-[#0066DD]/90 shadow-lg border border-white/20"
                            : "text-gray-700 hover:text-gray-900 bg-white/50 hover:bg-white/70 border border-white/40 hover:border-[#007BFF]/30"
                            }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <IconComponent className="w-5 h-5 mr-3" />
                          <span className="font-bold">{item.title}</span>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center justify-center">
          <Image src="/images/logo_mini.png" alt="Logo" width={50} height={50} className="object-contain drop-shadow-lg" />
        </div>

        <Sheet open={isMobileProfileOpen} onOpenChange={setIsMobileProfileOpen}>
          <SheetTrigger asChild>
            <button className="p-1">
              <Avatar className="h-10 w-10 ring-2 ring-[#007BFF]/50 shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-[#007BFF] to-[#A0F000] text-white font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-80 p-0 border-white/40 backdrop-blur-xl bg-white/95"
          >
            <SheetTitle className="sr-only">User Profile</SheetTitle>
            <div className="flex flex-col h-full p-6">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/30">
                <Avatar className="h-12 w-12 ring-2 ring-[#007BFF] shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-[#007BFF] to-[#A0F000] text-white text-base font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-gray-800">
                    {userName}
                  </span>
                  <span className="text-sm font-bold text-gray-500">
                    {userRole}
                  </span>
                </div>
              </div>

              <nav className="space-y-3 mb-6">

                <button
                  className="flex items-center w-full px-4 py-3 rounded-xl transition-all text-gray-700 backdrop-blur-sm bg-white/50 hover:bg-white/80 hover:border-[#007BFF]/30 border border-white/40 shadow-sm hover:shadow-md"
                  onClick={handleProfile}
                >
                  <User className="w-5 h-5 mr-3 text-gray-500" />
                  <span className="font-semibold">Profile</span>
                </button>
                <button
                  className="flex items-center w-full px-4 py-3 rounded-xl transition-all text-gray-700 backdrop-blur-sm bg-white/50 hover:bg-white/80 hover:border-[#007BFF]/30 border border-white/40 shadow-sm hover:shadow-md"
                  onClick={handleChangePassword}
                >
                  <UserLock className="w-5 h-5 mr-3 text-gray-500" />
                  <span className="font-semibold">Change Password</span>
                </button>

                <button
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all text-gray-700 backdrop-blur-sm bg-white/50 hover:bg-gradient-to-r hover:from-[#A0F000]/20 hover:to-[#A0F000]/10 hover:border-[#A0F000]/30 border border-white/40 shadow-sm hover:shadow-md"
                  onClick={handleTwoFactorAuth}
                >
                  <div className="flex items-center">
                    {twoFAEnabled ? (
                      <ShieldCheck className="w-5 h-5 mr-3 text-[#A0F000]" />
                    ) : (
                      <Shield className="w-5 h-5 mr-3 text-gray-500" />
                    )}
                    <span className="font-semibold">{twoFAEnabled ? "Manage 2FA" : "Enable 2FA"}</span>
                  </div>

                  {twoFAEnabled ? (
                    <Badge className="bg-[#A0F000]/30 text-[#A0F000] border-[#A0F000]/40 text-xs font-bold backdrop-blur-sm">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-200/50 text-gray-600 border-gray-300/50 text-xs backdrop-blur-sm">
                      Inactive
                    </Badge>
                  )}
                </button>
              </nav>

              <Divider className="mb-6" />

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center justify-center w-full px-4 py-3 rounded-xl font-bold transition-all text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                <LogOut className="w-5 h-5 mr-2" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
};

export default Header;