"use client";

import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuthMe } from "@/hooks/useAuthMe";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ArrowRight, FileText, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardStaff = () => {
  usePageTitle("Dashboard Siswa");
  const { data: user } = useAuthMe();
  const router = useRouter();

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 18) return "Selamat Siang";
    return "Selamat Malam";
  };

  const handleNavigateToTransactions = () => {
    router.push("/transactions");
  };

  return (
    <div className="space-y-6">
      {/* Main Welcome Card */}
      <div className="backdrop-blur-md bg-white/40 border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {getCurrentGreeting()}, {user?.username || "Siswa"}!
          </h1>
          <p className="text-gray-600 text-lg">Selamat datang di dashboard kamu</p>
        </div>

        {/* Role Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-300/30 mb-6">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-gray-700">
            {user?.role || "Siswa"}
          </span>
        </div>




      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


        {/* Current Time */}
        <div className="backdrop-blur-md bg-white/40 border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-md">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Waktu Saat Ini</h3>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRoleProtection(DashboardStaff, [
  "student",
]);