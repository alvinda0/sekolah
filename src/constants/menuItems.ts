// constants/menuItems.ts
import {
  LayoutDashboard,
  ArrowRightLeft,
  Banknote,
  Store,
  Settings,
  CreditCard,
  History,
  User,
  Key,
  UserPlus,
  Building,
  Landmark,
  Plus,
  HatGlasses,
  Server,
  Workflow,
  BookPlus,
  DollarSign,
  Layers,
  Wallet,
  LayoutList,
  BanknoteArrowDown,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  name: string;
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: string[]; // Role yang diizinkan mengakses menu ini
  submenu?: SubMenuItem[];
}

export interface SubMenuItem {
  name: string;
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: string[]; // Role yang diizinkan mengakses submenu ini
}

export const MENU_ITEMS: MenuItem[] = [
  {
    name: "Dashboard",
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "PartnerOwner",
      "PlatformOwner",
      "PlatformStaff",
      "AgentOwner",
      "AgentStaff",
    ],
  },
  {
    name: "Transaction",
    title: "Transaction",
    href: "/transaction",
    icon: ArrowRightLeft,
    roles: [
      "PartnerOwner",
      "PlatformOwner",
      "PlatformStaff",
      "AgentOwner",
      "AgentStaff",
    ],
  },
  {
    name: "wallet-merchant",
    title: "Wallet",
    href: "/wallet/merchant",
    icon: Wallet,
    roles: ["AgentOwner"],
  },
  {
    name: "wallet-platform",
    title: "Wallet",
    href: "/wallet/platform",
    icon: Wallet,
    roles: ["PlatformOwner"],
  },
  {
    name: "wallet",
    title: "Wallets",
    href: "/wallet",
    icon: Wallet,
    roles: ["PartnerOwner"],
    submenu: [
      {
        name: "wallet-platform",
        title: "Wallet Platform",
        href: "/wallet/platform",
        icon: LayoutList,
        roles: ["PartnerOwner"],
      },
      {
        name: "wallet-merchant",
        title: "Wallet Merchant",
        href: "/wallet/merchant",
        icon: LayoutList,
        roles: ["PartnerOwner"],
      },
    ],
  },
  {
    name: "disbursement-merchant",
    title: "Disbursement",
    href: "/disbursement/merchant",
    icon: BanknoteArrowDown,
    roles: ["AgentOwner"],
    submenu: [
      {
        name: "disbursement-merchant-request",
        title: "Request Disbursement",
        href: "/disbursement/merchant/request",
        icon: LayoutList,
        roles: ["AgentOwner"],
      },
      {
        name: "disbursement-merchant-list",
        title: "Disbursement Report",
        href: "/disbursement/merchant/list",
        icon: LayoutList,
        roles: ["AgentOwner"],
      },
    ],
  },
  {
    name: "settlement",
    title: "Settlement",
    href: "/settlement/merchant",
    icon: BanknoteArrowDown,
    roles: ["PartnerOwner", "PlatformOwner", "PlatformStaff", "SuperAgent", "AgentOwner", "AgentStaff"],
    submenu: [
      {
        name: "settlement-merchant",
        title: "Settlement Merchant",
        href: "/settlement/merchant",
        icon: LayoutList,
        roles: ["PartnerOwner", "PlatformOwner", "PlatformStaff", "SuperAgent", "AgentOwner", "AgentStaff"],
      },
      {
        name: "settlement-platform",
        title: "Settlement platform",
        href: "/settlement/platform",
        icon: LayoutList,
        roles: ["PartnerOwner", "PlatformOwner", "PlatformStaff"],
      },
    ],
  },
  {
    name: "disbursement-platform",
    title: "Disbursement",
    href: "/disbursement/platform",
    icon: BanknoteArrowDown,
    roles: ["PlatformOwner"],
    submenu: [
      {
        name: "disbursement-platform-request",
        title: "Request Disbursement",
        href: "/disbursement/platform/request",
        icon: LayoutList,
        roles: ["PlatformOwner"],
      },
      {
        name: "disbursement-platform-list",
        title: "Disbursement Report",
        href: "/disbursement/platform/list",
        icon: LayoutList,
        roles: ["PlatformOwner"],
      },
    ],
  },
  {
    name: "disbursement",
    title: "Disbursement",
    href: "/disbursement",
    icon: Wallet,
    roles: ["PartnerOwner"],
    submenu: [
      {
        name: "disbursement-platform",
        title: "Disbursement Platform",
        href: "/disbursement/platform",
        icon: LayoutList,
        roles: ["PartnerOwner"],
      },
      {
        name: "disbursement-merchant",
        title: "Disbursement Merchant",
        href: "/disbursement/merchant",
        icon: LayoutList,
        roles: ["PartnerOwner"],
      },
    ],
  },
  {
    name: "bank-merchant",
    title: "Banks Account",
    href: "/bank/merchant",
    icon: Banknote,
    roles: ["AgentOwner"],
  },

  {
    name: "bank-platform",
    title: "Banks Account",
    href: "/bank/platform",
    icon: Banknote,
    roles: ["PlatformOwner"],
  },

  {
    name: "banks",
    title: "Banks",
    href: "/bank",
    icon: Banknote,
    roles: ["PartnerOwner"],
    submenu: [
      {
        name: "bank-merchant",
        title: "Banks Platform",
        href: "/wallet/platform",
        icon: LayoutList,
        roles: ["PartnerOwner"],
      },
      {
        name: "bank-platform",
        title: "Banks Merchant",
        href: "/wallet/merchant",
        icon: LayoutList,
        roles: ["PartnerOwner"],
      },
    ],
  },
  {
    name: "user",
    title: "Users",
    href: "/users",
    icon: User,
    roles: ["PartnerOwner", "PlatformOwner", "AgentOwner"],
    submenu: [
      {
        name: "user-list",
        title: "User List",
        href: "/users/list",
        icon: User,
        roles: ["PartnerOwner", "PlatformOwner", "AgentOwner"],
      },
      {
        name: "user-create",
        title: "Create User",
        href: "/users/create",
        icon: UserPlus,
        roles: ["PartnerOwner", "PlatformOwner", "AgentOwner"],
      },
    ],
  },
  {
    name: "platform",
    title: "Platform",
    href: "/platform",
    icon: Layers,
    roles: ["PartnerOwner"],
  },
  {
    name: "agent",
    title: "Agents",
    href: "/agent",
    icon: HatGlasses,
    roles: ["PartnerOwner", "PlatformOwner", "AgentOwner"],
  },
  {
    name: "merchant",
    title: "Merchant",
    href: "/merchant",
    icon: Store,
    roles: ["PartnerOwner", "PlatformOwner", "AgentOwner"],
    submenu: [
      {
        name: "merchant-create",
        title: "Create Merchant",
        href: "/merchant/create",
        icon: Plus,
        roles: ["PartnerOwner", "PlatformOwner", "AgentOwner"],
      },
      {
        name: "merchant-list",
        title: "List Merchant",
        href: "/merchant/list",
        icon: Store,
        roles: ["PartnerOwner", "PlatformOwner", "AgentOwner"],
      },
      {
        name: "merchant-fee-list",
        title: "Fee",
        href: "/merchant/fee/list",
        icon: DollarSign,
        roles: ["PartnerOwner", "PlatformOwner", "AgentOwner"],
      },
    ],
  },
  {
    name: "credentials",
    title: "Credentials",
    href: "/credentials",
    icon: Key,
    roles: ["AgentOwner"],
    submenu: [
      {
        name: "credentials-agent",
        title: "Credentials Agent",
        href: "/credentials/agent",
        icon: Key,
        roles: ["AgentOwner"],
      },
      {
        name: "credentials-merchant",
        title: "Credentials Merchant",
        href: "/credentials/merchant",
        icon: Key,
        roles: ["AgentOwner"],
      },
    ],
  },
];

// Helper function untuk check apakah user punya akses ke menu
// Updated: menerima userRole sebagai string langsung dari API
export const hasMenuAccess = (
  menuRoles?: string[],
  userRole?: string
): boolean => {
  // Jika menu tidak ada role requirement, berarti semua bisa akses
  if (!menuRoles || menuRoles.length === 0) {
    return true;
  }

  // Jika user tidak ada role, tidak bisa akses
  if (!userRole) {
    return false;
  }

  // Check apakah role user match dengan role requirement menu (case-insensitive)
  return menuRoles.some(
    (menuRole) => menuRole.toLowerCase() === userRole.toLowerCase()
  );
};

// Filter menu items berdasarkan role user
// Updated: menerima userRole sebagai string langsung dari API (role_name)
export const getFilteredMenuItems = (userRole?: string): MenuItem[] => {
  return MENU_ITEMS.filter((item) => {
    // Check akses ke main menu
    const hasMainMenuAccess = hasMenuAccess(item.roles, userRole);

    // Jika tidak ada akses ke main menu, skip langsung
    if (!hasMainMenuAccess) {
      return false;
    }

    return true;
  }).map((item) => {
    // Filter submenu untuk item yang lolos
    if (item.submenu) {
      return {
        ...item,
        submenu: item.submenu.filter((subItem) =>
          hasMenuAccess(subItem.roles, userRole)
        ),
      };
    }
    return item;
  });
};

// Get menu item by name
export const getMenuItemByName = (name: string): MenuItem | undefined => {
  return MENU_ITEMS.find((item) => item.name === name);
};

// Get menu item by current pathname
export const getMenuItemByPath = (
  pathname: string
): { menuItem: MenuItem | undefined; subMenuItem: SubMenuItem | undefined } => {
  // First: Try exact match untuk main menu
  for (const item of MENU_ITEMS) {
    if (pathname === item.href) {
      return { menuItem: item, subMenuItem: undefined };
    }

    // Check submenu exact match
    if (item.submenu) {
      for (const subItem of item.submenu) {
        if (pathname === subItem.href) {
          return { menuItem: item, subMenuItem: subItem };
        }
      }
    }
  }

  // Second: Try partial match (untuk detail pages, edit pages, dll)
  for (const item of MENU_ITEMS) {
    // Check apakah pathname dimulai dengan href menu (contoh: /users/detail/123 starts with /users)
    if (pathname.startsWith(item.href + "/")) {
      // Check dulu apakah ada submenu yang lebih spesifik
      if (item.submenu) {
        for (const subItem of item.submenu) {
          if (pathname.startsWith(subItem.href + "/")) {
            return { menuItem: item, subMenuItem: subItem };
          }
        }
      }
      // Jika tidak ada submenu yang match, return main menu
      return { menuItem: item, subMenuItem: undefined };
    }

    // Check submenu partial match
    if (item.submenu) {
      for (const subItem of item.submenu) {
        if (pathname.startsWith(subItem.href + "/")) {
          return { menuItem: item, subMenuItem: subItem };
        }
      }
    }
  }

  return { menuItem: undefined, subMenuItem: undefined };
};

// Get menu items with active status
export const getMenuItemsWithActiveStatus = (activeMenuItem: string) => {
  return MENU_ITEMS.map((item) => ({
    ...item,
    active: activeMenuItem === item.name,
  }));
};
