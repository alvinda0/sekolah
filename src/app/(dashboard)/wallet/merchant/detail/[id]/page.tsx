"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { walletMerchantService } from "@/services/wallet-merchant.service";
import { WalletMerchant } from "@/types/wallet-merchant";
import {
  ArrowLeft,
  Wallet,
  Users,
  Calendar,
  Activity,
  TrendingUp,
  TrendingDown,
  Store,
  Banknote,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { withRoleProtection } from "@/components/ProtectedRoles";

export const runtime = 'edge';

const WalletMerchantDetailPage = () => {
  usePageTitle("Wallet Merchant Details");
  const params = useParams();
  const router = useRouter();
  const walletId = params.id as string;

  const [walletMerchant, setWalletMerchant] = useState<WalletMerchant | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletMerchantDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await walletMerchantService.getWalletMerchantById(walletId);
      setWalletMerchant(data);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch wallet merchant details";
      setError(errorMessage);
      setWalletMerchant(null);
    } finally {
      setLoading(false);
    }
  }, [walletId]);

  useEffect(() => {
    if (walletId) {
      fetchWalletMerchantDetails();
    }
  }, [walletId, fetchWalletMerchantDetails]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalBalance = (): number => {
    if (!walletMerchant) return 0;
    return walletMerchant.pending_balance + walletMerchant.available_balance;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wallet merchant details...</p>
        </div>
      </div>
    );
  }

  if (error || !walletMerchant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 text-red-500 mx-auto mb-4">❌</div>
          <p className="text-red-600 font-bold">
            {error || "Wallet merchant not found"}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 hover:bg-white/80 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Wallet Merchant Details
          </h1>
          <p className="text-sm text-gray-600">
            View complete information about the merchant wallet
          </p>
        </div>
      </div>

      {/* Wallet Information Card */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Wallet ID</h2>
              </div>
              <p className="text-purple-100 text-sm font-mono">
                {walletMerchant.wallet_id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-purple-100 text-sm mb-1">Total Balance</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(getTotalBalance())}
              </p>
            </div>
          </div>
        </div>

        {/* Balance Summary Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-200">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-500 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Available Balance
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-700">
              {formatCurrency(walletMerchant.available_balance)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Pending Balance
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-orange-700">
              {formatCurrency(walletMerchant.pending_balance)}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Account Information
            </h3>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Store className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">
                  Merchant Name
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {walletMerchant.merchant_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Agent Name</p>
                <p className="text-sm font-semibold text-gray-800">
                  {walletMerchant.agent_name}
                </p>
              </div>
            </div>
          </div>

          {/* Balance Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Balance Details
            </h3>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <Banknote className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">
                  Available Balance
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {formatCurrency(walletMerchant.available_balance)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Banknote className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">
                  Pending Balance
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {formatCurrency(walletMerchant.pending_balance)}
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Timeline Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">
                    Created At
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(walletMerchant.created_at).toLocaleString(
                      "id-ID",
                      {
                        dateStyle: "long",
                        timeStyle: "short",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">
                    Updated At
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(walletMerchant.updated_at).toLocaleString(
                      "id-ID",
                      {
                        dateStyle: "long",
                        timeStyle: "short",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRoleProtection(WalletMerchantDetailPage, [
  "PartnerOwner",
  "AgentOwner",
]);
