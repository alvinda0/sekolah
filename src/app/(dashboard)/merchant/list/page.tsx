"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CustomDataTable from "@/components/CustomDataTable";
import { Eye, Calendar, Server, Briefcase } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Merchant, MerchantQueryParams } from "@/types/merchant";
import { merchantService } from "@/services/merchant.service";
import {
  MerchantFilter,

} from "@/components/merchant/MerchantFilter";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ErrorState } from "@/components/ErrorState";

const ListMerchantPage = () => {
  usePageTitle("Merchant List");
  const router = useRouter();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMerchants = useCallback(async (filters?: MerchantQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await merchantService.getMerchants(filters);
      setMerchants(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch merchants";
      setError(errorMessage);
      setMerchants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMerchants({ page: 1, limit: 100 });
  }, [fetchMerchants]);

  const handleApplyFilters = (filters: MerchantQueryParams) => {
    fetchMerchants(filters);
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
      PENDING: "bg-yellow-500/20 text-yellow-700 border-yellow-500/40",
      INACTIVE: "bg-red-500/20 text-red-700 border-red-500/40",
    };
    return colors[status] || "bg-gray-500/20 text-gray-700 border-gray-500/40";
  };

  const getEnvironmentColor = (environment: string): string => {
    return environment === "LIVE"
      ? "bg-purple-500/20 text-purple-700 border-purple-500/40"
      : "bg-blue-500/20 text-blue-700 border-blue-500/40";
  };

  const handleViewDetails = (merchantId: string) => {
    router.push(`/merchant/detail/${merchantId}`);
  };

  const merchantColumns = [
    {
      name: "Name",
      selector: (row: Merchant) => row.name,
      sortable: true,
      cell: (row: Merchant) => (
        <div className="font-semibold text-gray-800">{row.name}</div>
      ),
    },
    {
      name: "Vendor",
      selector: (row: Merchant) => row.vendor_name,
      sortable: true,
    },
    {
      name: "Agent",
      selector: (row: Merchant) => row.agent_name,
      sortable: true,
    },
    {
      name: "Merchant Type",
      selector: (row: Merchant) => row.merchant_type_id,
      sortable: true,
      cell: (row: Merchant) => (
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-gray-500" />
          <span className="text-sm">Type {row.merchant_type_id}</span>
        </div>
      ),
    },
    {
      name: "Environment",
      selector: (row: Merchant) => row.environment,
      sortable: true,
      cell: (row: Merchant) => (
        <span
          className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border ${getEnvironmentColor(
            row.environment
          )}`}
        >
          <div className="flex items-center gap-1">
            <Server className="w-3 h-3" />
            {row.environment}
          </div>
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: Merchant) => row.status,
      sortable: true,
      cell: (row: Merchant) => (
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
      name: "Created At",
      selector: (row: Merchant) => row.created_at,
      sortable: true,
      cell: (row: Merchant) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {new Date(row.created_at).toLocaleDateString("id-ID")}
          </span>
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row: Merchant) => (
        <button
          onClick={() => handleViewDetails(row.merchant_id)}
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
      <div className="space-y-6">
        <MerchantFilter onApplyFilters={handleApplyFilters} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading merchants...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <MerchantFilter onApplyFilters={handleApplyFilters} />
        <ErrorState
          code={getErrorCode()}
          description={error}
          onAction={() => fetchMerchants({ page: 1, limit: 100 })}
          actionLabel="Retry"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MerchantFilter onApplyFilters={handleApplyFilters} />
      <CustomDataTable
        title="Merchant Management"
        description="Manage and view all system merchants"
        columns={merchantColumns}
        data={merchants}
      />
    </div>
  );
};

export default withRoleProtection(ListMerchantPage, [
  "PartnerOwner",
  "PlatformOwner",
  "AgentOwner",
]);