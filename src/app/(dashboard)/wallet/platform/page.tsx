"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CustomDataTable from "@/components/CustomDataTable";
import { walletService } from "@/services/wallet-platform.service";
import {
  WalletPlatform,
  WalletPlatformQueryParams,
} from "@/types/wallet-platform";
import { WalletPlatformFilter } from "@/components/wallet/WalletPlatformFilter";
import { Eye, Calendar } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ErrorState } from "@/components/ErrorState";

const WalletPlatformPage = () => {
  usePageTitle("Wallet Platform List");
  const router = useRouter();
  const [wallets, setWallets] = useState<WalletPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = useCallback(
    async (filters?: WalletPlatformQueryParams) => {
      try {
        setLoading(true);
        setError(null);
        const data = await walletService.getWalletPlatforms(filters);
        setWallets(Array.isArray(data) ? data : []);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch wallet platforms";
        setError(errorMessage);
        setWallets([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchWallets({ page: 1, limit: 100 });
  }, [fetchWallets]);

  const handleApplyFilters = (filters: WalletPlatformQueryParams) => {
    fetchWallets(filters);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDetails = (walletId: string) => {
    router.push(`/wallet/platform/detail/${walletId}`);
  };

  const getErrorCode = (): 400 | 401 | 403 | 404 | 500 => {
    if (!error) return 500;
    if (error.toLowerCase().includes("unauthorized") || error.toLowerCase().includes("authentication")) return 401;
    if (error.toLowerCase().includes("forbidden") || error.toLowerCase().includes("permission")) return 403;
    if (error.toLowerCase().includes("not found")) return 404;
    if (error.toLowerCase().includes("bad request") || error.toLowerCase().includes("invalid")) return 400;
    return 500;
  };

  const walletColumns = [
    {
      name: "Created At",
      selector: (row: WalletPlatform) => row.created_at,
      sortable: true,
      cell: (row: WalletPlatform) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {new Date(row.created_at).toLocaleDateString("id-ID")}
          </span>
        </div>
      ),
    },
    {
      name: "Platform",
      selector: (row: WalletPlatform) => row.platform_name,
      sortable: true,
    },
    {
      name: "Pending Balance",
      selector: (row: WalletPlatform) => row.pending_balance,
      sortable: true,
      cell: (row: WalletPlatform) => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-orange-700">
            {formatCurrency(row.pending_balance)}
          </span>
        </div>
      ),
    },
    {
      name: "Available Balance",
      selector: (row: WalletPlatform) => row.available_balance,
      sortable: true,
      cell: (row: WalletPlatform) => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-green-700">
            {formatCurrency(row.available_balance)}
          </span>
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row: WalletPlatform) => (
        <button
          onClick={() => handleViewDetails(row.wallet_id)}
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
          <p className="text-gray-600">Loading wallet platforms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        code={getErrorCode()}
        description={error}
        onAction={() => fetchWallets({ page: 1, limit: 100 })}
        actionLabel="Retry"
      />
    );
  }

  return (
    <div className="space-y-6">
      <WalletPlatformFilter onApplyFilters={handleApplyFilters} />

      <CustomDataTable
        title="Wallet Platform Management"
        description="Manage and view all platform wallets"
        columns={walletColumns}
        data={wallets}
      />
    </div>
  );
};

export default withRoleProtection(WalletPlatformPage, [
  "PartnerOwner",
  "PlatformOwner",
]);