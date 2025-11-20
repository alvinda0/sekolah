// constants/menuItems.ts
import {
  LayoutDashboard,
  ArrowRightLeft,
  History,
  User,
  UserPlus,
  Building,
  Plus,
  Server,
  Workflow,
  BookPlus,
  Layers,
  LayoutList,
  Users,
  FileText,
  Award,
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
    roles: ["system_admin", "teacher", "student"],
  },
  {
    name: "admin-users",
    title: "List User",
    href: "/users",
    icon: Users,
    roles: ["system_admin"],
  },
  {
    name: "admin-classes",
    title: "Kelas",
    href: "/class",
    icon: Building,
    roles: ["system_admin"],
  },
  {
    name: "admin-subjects",
    title: "Mata Pelajaran",
    href: "/subject",
    icon: BookPlus,
    roles: ["system_admin"],
  },
  {
    name: "admin-assign-teacher",
    title: "Tugas Guru",
    href: "/admin/assign-teacher",
    icon: Workflow,
    roles: ["system_admin"],
  },
  {
    name: "admin-student-enroll",
    title: "Pendaftaran Siswa",
    href: "/admin/students/enroll",
    icon: UserPlus,
    roles: ["system_admin"],
  },

  {
    name: "teacher-classes",
    title: "Kelas Guru",
    href: "/teacher/classes",
    icon: Building,
    roles: ["teacher"],
  },
  {
    name: "teacher-students",
    title: "Siswa Guru",
    href: "/teacher/students",
    icon: Users,
    roles: ["teacher"],
  },
  {
    name: "teacher-exams",
    title: "Ujian",
    href: "/teacher/exams",
    icon: FileText,
    roles: ["teacher"],
  },
  {
    name: "teacher-exams-create",
    title: "Buat Ujian",
    href: "/teacher/exams/new",
    icon: Plus,
    roles: ["teacher"],
  },
  {
    name: "teacher-exams-publish",
    title: "Publikasi Ujian",
    href: "/teacher/exams/publish",
    icon: Server,
    roles: ["teacher"],
  },
  {
    name: "teacher-questions",
    title: "Soal Ujian",
    href: "/teacher/exams/questions",
    icon: LayoutList,
    roles: ["teacher"],
  },
  {
    name: "teacher-submissions",
    title: "Jawaban Siswa",
    href: "/teacher/exams/submissions",
    icon: History,
    roles: ["teacher"],
  },

  {
    name: "student-subjects",
    title: "Mata Pelajaran",
    href: "/student/subjects",
    icon: BookPlus,
    roles: ["student"],
  },
  {
    name: "student-class",
    title: "Kelas",
    href: "/student/class",
    icon: Building,
    roles: ["student"],
  },
  {
    name: "student-classmates",
    title: "Teman Sekelas",
    href: "/student/classmates",
    icon: Users,
    roles: ["student"],
  },
  {
    name: "student-exams",
    title: "Ujian Tersedia",
    href: "/student/exams",
    icon: FileText,
    roles: ["student"],
  },
  {
    name: "student-grades",
    title: "Nilai",
    href: "/student/grades",
    icon: Award,
    roles: ["student"],
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
