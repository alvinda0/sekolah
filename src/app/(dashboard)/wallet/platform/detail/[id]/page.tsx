"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { walletService } from "@/services/wallet-platform.service";
import { WalletPlatform } from "@/types/wallet-platform";
import {
  ArrowLeft,
  Wallet,
  Calendar,
  Activity,
  Building2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { withRoleProtection } from "@/components/ProtectedRoles";

export const runtime = 'edge';

const WalletPlatformDetailPage = () => {
  usePageTitle("Wallet Platform Details");
  const params = useParams();
  const router = useRouter();
  const walletId = params.id as string;

  const [wallet, setWallet] = useState<WalletPlatform | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await walletService.getWalletPlatformById(walletId);
      setWallet(data);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch wallet platform details";
      setError(errorMessage);
      setWallet(null);
    } finally {
      setLoading(false);
    }
  }, [walletId]);

  useEffect(() => {
    if (walletId) {
      fetchWalletDetails();
    }
  }, [walletId, fetchWalletDetails]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wallet platform details...</p>
        </div>
      </div>
    );
  }

  if (error || !wallet) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 text-red-500 mx-auto mb-4">❌</div>
          <p className="text-red-600 font-bold">
            {error || "Wallet platform not found"}
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

  const totalBalance = wallet.pending_balance + wallet.available_balance;

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
            Wallet Platform Details
          </h1>
          <p className="text-sm text-gray-600">
            View complete information about the wallet platform
          </p>
        </div>
      </div>

      {/* Wallet Information Card */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Platform {wallet.platform_id}
                </h2>
                <p className="text-blue-100 text-sm mt-1 font-mono">
                  {wallet.wallet_id}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-xs font-semibold">
                Total Balance
              </p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalBalance)}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* Balance Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Balance Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-orange-600 font-semibold mb-1">
                    Pending Balance
                  </p>
                  <p className="text-xl font-bold text-orange-700">
                    {formatCurrency(wallet.pending_balance)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-green-600 font-semibold mb-1">
                    Available Balance
                  </p>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(wallet.available_balance)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Platform Information
            </h3>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">
                  Platform Name
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {wallet.platform_name}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Information */}
          <div>
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
                    {new Date(wallet.created_at).toLocaleString("id-ID", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
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
                    {new Date(wallet.updated_at).toLocaleString("id-ID", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
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

export default withRoleProtection(WalletPlatformDetailPage, [
  "PartnerOwner",
  "PlatformOwner",
]);
