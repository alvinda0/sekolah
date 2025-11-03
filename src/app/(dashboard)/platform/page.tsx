"use client";

import React, { useEffect, useState, useCallback } from "react";
import CustomDataTable from "@/components/CustomDataTable";
import { platformService } from "@/services/platform.service";
import { Platform } from "@/types/platform";
import { Calendar, Eye } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useRouter } from "next/navigation";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ErrorState } from "@/components/ErrorState";

const ListPlatformPage = () => {
  usePageTitle("Platform List");
  const router = useRouter();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlatforms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await platformService.getPlatforms();
      setPlatforms(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch platforms";
      setError(errorMessage);
      setPlatforms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlatforms();
  }, [fetchPlatforms]);

  const handleViewDetail = (platformId: string) => {
    router.push(`/platform/detail/${platformId}`);
  };

  const getErrorCode = (): 400 | 401 | 403 | 404 | 500 => {
    if (!error) return 500;
    if (error.toLowerCase().includes("unauthorized") || error.toLowerCase().includes("authentication")) return 401;
    if (error.toLowerCase().includes("forbidden") || error.toLowerCase().includes("permission")) return 403;
    if (error.toLowerCase().includes("not found")) return 404;
    if (error.toLowerCase().includes("bad request") || error.toLowerCase().includes("invalid")) return 400;
    return 500;
  };

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      ACTIVE: "bg-green-500/20 text-green-700 border-green-500/40",
      INACTIVE: "bg-red-500/20 text-red-700 border-red-500/40",
      PENDING: "bg-yellow-500/20 text-yellow-700 border-yellow-500/40",
    };
    return colors[status] || "bg-gray-500/20 text-gray-700 border-gray-500/40";
  };

  const platformColumns = [
    {
      name: "Created At",
      selector: (row: Platform) => row.created_at,
      sortable: true,
      cell: (row: Platform) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {new Date(row.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      ),
    },
    {
      name: "Platform Name",
      selector: (row: Platform) => row.name,
      sortable: true,
    },
    {
      name: "Referral",
      selector: (row: Platform) => row.referral,
      sortable: true,
      cell: (row: Platform) => (
        <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
          {row.referral}
        </span>
      ),
    },
    {
      name: "Fee",
      selector: (row: Platform) => row.fee,
      sortable: true,
      cell: (row: Platform) => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-emerald-600">
            {(row.fee)}%
          </span>
        </div>
      ),
    },
    {
      name: "Partner Name",
      selector: (row: Platform) => row.partner_name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: Platform) => row.status,
      sortable: true,
      cell: (row: Platform) => (
        <span
          className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border ${getStatusColor(
            row.status
          )}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row: Platform) => (
        <button
          onClick={() => handleViewDetail(row.platform_id)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 rounded-lg transition-all duration-200 border border-blue-500/30 cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span className="text-xs font-bold">Details</span>
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading platforms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        code={getErrorCode()}
        description={error}
        onAction={() => fetchPlatforms()}
        actionLabel="Retry"
      />
    );
  }

  return (
    <div className="space-y-6">
      <CustomDataTable
        title="Platform Management"
        description="Manage and view all platforms"
        columns={platformColumns}
        data={platforms}
      />
    </div>
  );
};

export default withRoleProtection(ListPlatformPage, ["PartnerOwner"]);