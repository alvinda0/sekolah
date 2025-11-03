"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CustomDataTable from "@/components/CustomDataTable";
import {
  walletMerchantService,

} from "@/services/wallet-merchant.service";
import { WalletMerchant, WalletMerchantQueryParams } from "@/types/wallet-merchant";
import { Eye, Calendar, Users, Store } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { WalletMerchantFilter } from "@/components/wallet/WalletMerchantFilter";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ErrorState } from "@/components/ErrorState";

const ListWalletMerchantPage = () => {
  usePageTitle("Wallet Merchant List");
  const router = useRouter();
  const [walletMerchants, setWalletMerchants] = useState<WalletMerchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletMerchants = useCallback(
    async (filters: WalletMerchantQueryParams) => {
      try {
        setLoading(true);
        setError(null);
        const data = await walletMerchantService.getWalletMerchants(filters);
        setWalletMerchants(Array.isArray(data) ? data : []);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch wallet merchants";
        setError(errorMessage);
        setWalletMerchants([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchWalletMerchants({ page: 1, limit: 100 });
  }, [fetchWalletMerchants]);

  const handleApplyFilters = (filters: WalletMerchantQueryParams) => {
    fetchWalletMerchants(filters);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDetails = (walletId: string) => {
    router.push(`/wallet/merchant/detail/${walletId}`);
  };

  const getErrorCode = (): 400 | 401 | 403 | 404 | 500 => {
    if (!error) return 500;
    if (error.toLowerCase().includes("unauthorized") || error.toLowerCase().includes("authentication")) return 401;
    if (error.toLowerCase().includes("forbidden") || error.toLowerCase().includes("permission")) return 403;
    if (error.toLowerCase().includes("not found")) return 404;
    if (error.toLowerCase().includes("bad request") || error.toLowerCase().includes("invalid")) return 400;
    return 500;
  };

  const walletMerchantColumns = [
    {
      name: "Created At",
      selector: (row: WalletMerchant) => row.created_at,
      sortable: true,
      cell: (row: WalletMerchant) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {new Date(row.created_at).toLocaleDateString("id-ID")}
          </span>
        </div>
      ),
    },
    {
      name: "Merchant",
      selector: (row: WalletMerchant) => row.merchant_name,
      sortable: true,
      cell: (row: WalletMerchant) => (
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-gray-700 truncate w-[180px]">
            {row.merchant_name}
          </span>
        </div>
      ),
    },
    {
      name: "Agent",
      selector: (row: WalletMerchant) => row.agent_name,
      sortable: true,
      cell: (row: WalletMerchant) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-gray-700">
            {row.agent_name}
          </span>
        </div>
      ),
    },
    {
      name: "Pending Balance",
      selector: (row: WalletMerchant) => row.pending_balance,
      sortable: true,
      cell: (row: WalletMerchant) => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-orange-700">
            {formatCurrency(row.pending_balance)}
          </span>
        </div>
      ),
    },
    {
      name: "Available Balance",
      selector: (row: WalletMerchant) => row.available_balance,
      sortable: true,
      cell: (row: WalletMerchant) => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-green-700">
            {formatCurrency(row.available_balance)}
          </span>
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row: WalletMerchant) => (
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
      <div className="space-y-6">
        <WalletMerchantFilter onApplyFilters={handleApplyFilters} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wallet merchants...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <WalletMerchantFilter onApplyFilters={handleApplyFilters} />
        <ErrorState
          code={getErrorCode()}
          description={error}
          onAction={() => fetchWalletMerchants({ page: 1, limit: 100 })}
          actionLabel="Retry"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WalletMerchantFilter onApplyFilters={handleApplyFilters} />
      <CustomDataTable
        title="Wallet Merchant Management"
        description="Manage and view all merchant wallet accounts"
        columns={walletMerchantColumns}
        data={walletMerchants}
      />
    </div>
  );
};

export default withRoleProtection(ListWalletMerchantPage, [
  "PartnerOwner",
  "AgentOwner",
]);