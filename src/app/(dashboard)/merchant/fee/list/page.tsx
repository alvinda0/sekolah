"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CustomDataTable from "@/components/CustomDataTable";
import { Eye, DollarSign, Building2, User } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Fee } from "@/types/fee";
import { feeService } from "@/services/fee.service";
import { FeeFilter, FeeQueryParams } from "@/components/fee/FeeFilter";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ErrorState } from "@/components/ErrorState";

const ListFeePage = () => {
  usePageTitle("Merchant Fee List");
  const router = useRouter();
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFees = useCallback(async (filters?: FeeQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await feeService.getFees(filters);
      setFees(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch fees";
      setError(errorMessage);
      setFees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFees({ page: 1, limit: 100 });
  }, [fetchFees]);

  const handleApplyFilters = (filters: FeeQueryParams) => {
    fetchFees(filters);
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
    return status === "ACTIVE"
      ? "bg-green-500/20 text-green-700 border-green-500/40"
      : "bg-red-500/20 text-red-700 border-red-500/40";
  };

  const getPlatformColor = (platformId: number): string => {
    const colors: { [key: number]: string } = {
      1: "bg-blue-500/20 text-blue-700 border-blue-500/40",
      2: "bg-purple-500/20 text-purple-700 border-purple-500/40",
      3: "bg-indigo-500/20 text-indigo-700 border-indigo-500/40",
    };
    return (
      colors[platformId] || "bg-gray-500/20 text-gray-700 border-gray-500/40"
    );
  };

  const handleViewDetails = (agentId: string) => {
    router.push(`/merchant/fee/detail/${agentId}`);
  };

  const feeColumns = [
    {
      name: "Agent Name",
      selector: (row: Fee) => row.name,
      sortable: true,
      cell: (row: Fee) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="font-semibold text-gray-800">{row.name}</span>
        </div>
      ),
    },
    {
      name: "Platform",
      selector: (row: Fee) => row.platform_name,
      sortable: true,
      cell: (row: Fee) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-500" />
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border ${getPlatformColor(
              row.platform_id
            )}`}
          >
            {row.platform_name}
          </span>
        </div>
      ),
    },
    {
      name: "Platform ID",
      selector: (row: Fee) => row.platform_id,
      sortable: true,
      cell: (row: Fee) => (
        <span className="px-2 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-700">
          Platform {row.platform_id}
        </span>
      ),
    },
    {
      name: "Total Fee",
      selector: (row: Fee) => row.total_fee,
      sortable: true,
      cell: (row: Fee) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-bold text-yellow-700">
            {row.total_fee}%
          </span>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row: Fee) => row.status,
      sortable: true,
      cell: (row: Fee) => (
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
      cell: (row: Fee) => (
        <button
          onClick={() => handleViewDetails(row.agent_id)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 rounded-lg transition-all duration-200 border border-blue-500/30"
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
          <p className="text-gray-600">Loading merchant fees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        code={getErrorCode()}
        description={error}
        onAction={() => fetchFees({ page: 1, limit: 100 })}
        actionLabel="Retry"
      />
    );
  }

  return (
    <div className="space-y-6">
      <FeeFilter onApplyFilters={handleApplyFilters} />

      <CustomDataTable
        title="Merchant Fee Management"
        description="Manage and view all merchant fee configurations"
        columns={feeColumns}
        data={fees}
      />
    </div>
  );
};

export default withRoleProtection(ListFeePage, [
  "PartnerOwner",
  "PlatformOwner",
  "AgentOwner",
]);