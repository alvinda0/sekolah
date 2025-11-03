"use client";

import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuthMe } from "@/hooks/useAuthMe";
import { withRoleProtection } from "@/components/ProtectedRoles";
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Plus,
  FileText,
  Settings,
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

const DashboardOwner = () => {
  usePageTitle("Dashboard Owner");
  const { data: user } = useAuthMe();

  // Chart Data
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [4000, 3000, 5000, 4500, 6000, 5500],
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

  const transactionData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Transactions",
        data: [240, 198, 312, 278, 389, 356],
        backgroundColor: [
          "rgba(168, 85, 247, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(168, 85, 247, 0.8)",
        ],
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // Chart Options
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
            context.parsed.y !== null ? `${context.parsed.y.toLocaleString()}` : '$0',
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
          callback: (value: number | string) => `$${value}`,
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
        borderColor: "rgba(168, 85, 247, 0.2)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: TooltipItem<"bar">) =>
            `${context.parsed.y ?? 0} transactions`,
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
        },
      },
    },
  };

  const stats = [
    {
      title: "Total Revenue",
      value: "$28,000",
      change: "+12.5%",
      icon: DollarSign,
      color: "from-green-400 to-emerald-600",
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+8.2%",
      icon: Users,
      color: "from-blue-400 to-indigo-600",
    },
    {
      title: "Transactions",
      value: "1,773",
      change: "+23.1%",
      icon: ShoppingCart,
      color: "from-purple-400 to-pink-600",
    },
    {
      title: "Growth Rate",
      value: "18.5%",
      change: "+4.3%",
      icon: TrendingUp,
      color: "from-orange-400 to-red-600",
    },
  ];

  const quickActions = [
    {
      title: "New Transaction",
      description: "Create new transaction",
      icon: Plus,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "View Reports",
      description: "Check detailed reports",
      icon: FileText,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Settings",
      description: "Manage settings",
      icon: Settings,
      color: "from-gray-500 to-slate-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/40 border border-white/20 rounded-2xl p-6 shadow-xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Welcome back, {user?.name || "Owner"}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here&apos;s what&apos;s happening with your business today
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="backdrop-blur-md bg-white/40 border border-white/20 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Revenue Overview
          </h3>
          <div className="h-[300px]">
            <Line data={revenueData} options={lineChartOptions} />
          </div>
        </div>

        {/* Transaction Chart */}
        <div className="backdrop-blur-md bg-white/40 border border-white/20 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Transaction Volume
          </h3>
          <div className="h-[300px]">
            <Bar data={transactionData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="backdrop-blur-md bg-white/40 border border-white/20 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="group flex items-start gap-4 p-4 rounded-xl bg-white/60 border border-white/30 hover:bg-white/80 transition-all hover:-translate-y-1 hover:shadow-lg text-left"
              >
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${action.color} shadow-md group-hover:shadow-lg transition-shadow`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {action.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default withRoleProtection(DashboardOwner, [
  "PartnerOwner",
  "PlatformOwner",
  "AgentOwner",
]);