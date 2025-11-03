"use client";

import React, { useEffect, useState, useCallback } from "react";
import CustomDataTable from "@/components/CustomDataTable";
import { disbursementPlatformService } from "@/services/disbursement-platform.service";
import { DisbursementPlatform } from "@/types/disbursement-platform";
import { Calendar, Eye, Banknote } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useRouter } from "next/navigation";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ErrorState } from "@/components/ErrorState";

const ListDisbursementPlatform = () => {
  usePageTitle("Disbursement Platform List");
  const router = useRouter();
  const [disbursements, setDisbursements] = useState<DisbursementPlatform[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDisbursements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await disbursementPlatformService.getDisbursementPlatforms({
        page: 1,
        limit: 100,
      });
      setDisbursements(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch disbursement platforms";
      setError(errorMessage);
      setDisbursements([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDisbursements();
  }, [fetchDisbursements]);

  const handleViewDetail = (disbursementId: string) => {
    router.push(`/disbursement/platform/detail/${disbursementId}`);
  };

  const getErrorCode = (): 400 | 401 | 403 | 404 | 500 => {
    if (!error) return 500;
    if (
      error.toLowerCase().includes("unauthorized") ||
      error.toLowerCase().includes("authentication")
    )
      return 401;
    if (
      error.toLowerCase().includes("forbidden") ||
      error.toLowerCase().includes("permission")
    )
      return 403;
    if (error.toLowerCase().includes("not found")) return 404;
    if (
      error.toLowerCase().includes("bad request") ||
      error.toLowerCase().includes("invalid")
    )
      return 400;
    return 500;
  };

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      PENDING: "bg-yellow-500/20 text-yellow-700 border-yellow-500/40",
      APPROVED: "bg-green-500/20 text-green-700 border-green-500/40",
      REJECTED: "bg-red-500/20 text-red-700 border-red-500/40",
      PROCESSING: "bg-blue-500/20 text-blue-700 border-blue-500/40",
    };
    return colors[status] || "bg-gray-500/20 text-gray-700 border-gray-500/40";
  };

  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      IDR: "bg-emerald-500/20 text-emerald-700 border-emerald-500/40",
      USD: "bg-purple-500/20 text-purple-700 border-purple-500/40",
    };
    return colors[type] || "bg-gray-500/20 text-gray-700 border-gray-500/40";
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const disbursementColumns = [
    {
      name: "Created At",
      selector: (row: DisbursementPlatform) => row.created_at,
      sortable: true,
      width: "150px",
      cell: (row: DisbursementPlatform) => (
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
      selector: (row: DisbursementPlatform) => row.platform_name,
      sortable: true,
      cell: (row: DisbursementPlatform) => (
        <span className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
          {row.platform_name}
        </span>
      ),
    },
    {
      name: "Bank Name",
      selector: (row: DisbursementPlatform) => row.bank_name,
      sortable: true,
      cell: (row: DisbursementPlatform) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold">{row.bank_name}</span>
          <span className="text-xs text-gray-500">{row.bank_code}</span>
        </div>
      ),
      width: "200px",
    },
    {
      name: "Acc. Name",
      selector: (row: DisbursementPlatform) => row.account_name,
      sortable: true,
    },
    {
      name: "Acc. Number",
      selector: (row: DisbursementPlatform) => row.account_number,
      sortable: true,
      width: "150px",
    },
    {
      name: "Amount",
      selector: (row: DisbursementPlatform) => row.amount,
      sortable: true,
      width: "150px",
      cell: (row: DisbursementPlatform) => (
        <div className="flex items-center gap-2">
          <Banknote className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-bold text-emerald-600">
            {formatCurrency(row.amount)}
          </span>
        </div>
      ),
    },
    {
      name: "Admin Cost",
      selector: (row: DisbursementPlatform) => row.admin_cost,
      sortable: true,
      cell: (row: DisbursementPlatform) => (
        <span className="text-sm text-gray-600">
          {formatCurrency(row.admin_cost)}
        </span>
      ),
      width: "150px",
    },
    {
      name: "Total",
      selector: (row: DisbursementPlatform) => row.total_disbursements,
      sortable: true,
      cell: (row: DisbursementPlatform) => (
        <span className="text-sm font-bold text-blue-600">
          {formatCurrency(row.total_disbursements)}
        </span>
      ),
      width: "150px",
    },
    {
      name: "Type",
      selector: (row: DisbursementPlatform) => row.type,
      sortable: true,
      cell: (row: DisbursementPlatform) => (
        <span
          className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border ${getTypeColor(
            row.type
          )}`}
        >
          {row.type}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: DisbursementPlatform) => row.status,
      sortable: true,
      cell: (row: DisbursementPlatform) => (
        <span
          className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border ${getStatusColor(
            row.status
          )}`}
        >
          {row.status}
        </span>
      ),
      width: "150px",
    },
    {
      name: "Actions",
      cell: (row: DisbursementPlatform) => (
        <button
          onClick={() => handleViewDetail(row.disbursement_id)}
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
          <p className="text-gray-600">Loading disbursement platforms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        code={getErrorCode()}
        description={error}
        onAction={() => fetchDisbursements()}
        actionLabel="Retry"
      />
    );
  }

  return (
    <div className="space-y-6">
      <CustomDataTable
        title="Disbursement Platform Management"
        description="Manage and view all disbursement platforms"
        columns={disbursementColumns}
        data={disbursements}
      />
    </div>
  );
};

export default withRoleProtection(ListDisbursementPlatform, [
  "PlatformOwner",
  "PlatformStaff",
]);
