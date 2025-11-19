"use client";

import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuthMe } from "@/hooks/useAuthMe";
import { withRoleProtection } from "@/components/ProtectedRoles";
import {
  GraduationCap,
  Users,
  BookOpen,
  TrendingUp,
  School,
  UserCheck,
  Award,
  BarChart3,
} from "lucide-react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TooltipItem,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardSekolah = () => {
  usePageTitle("Dashboard Sekolah");
  const { data: user } = useAuthMe();

  // Data Kelas
  const dataKelas = [
    { nama: "Kelas 7A", jumlah: 32 },
    { nama: "Kelas 7B", jumlah: 30 },
    { nama: "Kelas 8A", jumlah: 28 },
    { nama: "Kelas 8B", jumlah: 31 },
    { nama: "Kelas 9A", jumlah: 29 },
    { nama: "Kelas 9B", jumlah: 27 },
  ];

  // Data Grafik Nilai Ujian (Rata-rata per Mata Pelajaran)
  const nilaiUjianData = {
    labels: ["Matematika", "B.Indonesia", "B.Inggris", "IPA", "IPS", "Seni"],
    datasets: [
      {
        label: "Nilai Rata-rata",
        data: [78, 82, 75, 80, 85, 88],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Data Grafik Siswa per Kelas
  const siswaPerKelasData = {
    labels: dataKelas.map((k) => k.nama),
    datasets: [
      {
        label: "Jumlah Siswa",
        data: dataKelas.map((k) => k.jumlah),
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(14, 165, 233, 0.8)",
        ],
        borderColor: [
          "rgba(99, 102, 241, 1)",
          "rgba(168, 85, 247, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(251, 146, 60, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(14, 165, 233, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // Chart Options untuk Nilai Ujian
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#4b5563",
        borderColor: "rgba(99, 102, 241, 0.2)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: { parsed: { y: number | null } }) =>
            context.parsed.y !== null ? `Nilai: ${context.parsed.y}` : "0",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
        },
        ticks: {
          color: "#6b7280",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
        },
      },
    },
  };

  // Chart Options untuk Siswa per Kelas
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#4b5563",
        borderColor: "rgba(99, 102, 241, 0.2)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: TooltipItem<"bar">) =>
            `${context.parsed.y ?? 0} siswa`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
        },
        ticks: {
          color: "#6b7280",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const totalSiswa = dataKelas.reduce((acc, kelas) => acc + kelas.jumlah, 0);

  const stats = [
    {
      title: "Total Siswa",
      value: totalSiswa.toString(),
      change: "+5 siswa baru",
      icon: GraduationCap,
      color: "from-blue-400 to-indigo-600",
    },
    {
      title: "Total Guru",
      value: "24",
      change: "8 guru tetap",
      icon: Users,
      color: "from-purple-400 to-pink-600",
    },
    {
      title: "Jumlah Kelas",
      value: dataKelas.length.toString(),
      change: "3 tingkat",
      icon: School,
      color: "from-green-400 to-emerald-600",
    },
    {
      title: "Rata-rata Nilai",
      value: "81.3",
      change: "+2.5 poin",
      icon: Award,
      color: "from-orange-400 to-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/40 border border-white/20 rounded-2xl p-6 shadow-xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard Sekolah
        </h1>
        <p className="text-gray-600 mt-2">
          Ringkasan data siswa, guru, dan prestasi akademik
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="backdrop-blur-md bg-white/40 border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold mt-2 text-gray-900">
                    {stat.value}
                  </h3>
                  <p className="text-green-600 text-sm mt-2 font-semibold">
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Data Kelas */}
      <div className="backdrop-blur-md bg-white/40 border border-white/20 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          Data Siswa Per Kelas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {dataKelas.map((kelas, index) => (
            <div
              key={index}
              className="bg-white/60 rounded-xl p-4 border border-white/30 hover:bg-white/80 transition-all hover:shadow-lg"
            >
              <p className="text-gray-600 text-sm font-medium">{kelas.nama}</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">
                {kelas.jumlah}
              </p>
              <p className="text-xs text-gray-500 mt-1">siswa</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafik Nilai Ujian */}
        <div className="backdrop-blur-md bg-white/40 border border-white/20 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Rata-rata Nilai Ujian per Mata Pelajaran
          </h3>
          <div className="h-[300px]">
            <Line data={nilaiUjianData} options={lineChartOptions} />
          </div>
        </div>

        {/* Grafik Siswa per Kelas */}
        <div className="backdrop-blur-md bg-white/40 border border-white/20 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            Distribusi Siswa per Kelas
          </h3>
          <div className="h-[300px]">
            <Bar data={siswaPerKelasData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Informasi Tambahan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="backdrop-blur-md bg-white/40 border border-white/20 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-green-600" />
            Tingkat Kehadiran
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Siswa</span>
              <span className="text-2xl font-bold text-green-600">94.5%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-600 h-3 rounded-full"
                style={{ width: "94.5%" }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-600">Guru</span>
              <span className="text-2xl font-bold text-green-600">98.2%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-600 h-3 rounded-full"
                style={{ width: "98.2%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/40 border border-white/20 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-orange-600" />
            Prestasi Terbaru
          </h3>
          <div className="space-y-3">
            <div className="bg-white/60 rounded-lg p-3 border border-white/30 hover:bg-white/80 transition-all">
              <p className="font-semibold text-gray-900">
                🥇 Juara 1 Olimpiade Matematika
              </p>
              <p className="text-sm text-gray-600">
                Tingkat Kota - Januari 2025
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-3 border border-white/30 hover:bg-white/80 transition-all">
              <p className="font-semibold text-gray-900">
                🥈 Juara 2 Lomba Karya Tulis
              </p>
              <p className="text-sm text-gray-600">
                Tingkat Provinsi - Desember 2024
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-3 border border-white/30 hover:bg-white/80 transition-all">
              <p className="font-semibold text-gray-900">
                🥉 Juara 3 Festival Seni
              </p>
              <p className="text-sm text-gray-600">
                Tingkat Nasional - November 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRoleProtection(DashboardSekolah, ["system_admin"]);