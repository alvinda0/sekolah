"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { bankMerchantService } from "@/services/bank-merchant.service";
import { BankMerchant } from "@/types/bank-merchant";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CreditCard,
  User,
  Activity,
  Shield,
  FileText,
  Store,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { withRoleProtection } from "@/components/ProtectedRoles";

export const runtime = 'edge';

const BankMerchantDetailPage = () => {
  usePageTitle("Bank Merchant Details");
  const params = useParams();
  const router = useRouter();
  const bankMerchantId = params.id as string;

  const [bankMerchant, setBankMerchant] = useState<BankMerchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBankMerchantDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bankMerchantService.getBankMerchantById(
        bankMerchantId
      );
      setBankMerchant(data);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch bank merchant details";
      setError(errorMessage);
      setBankMerchant(null);
    } finally {
      setLoading(false);
    }
  }, [bankMerchantId]);

  useEffect(() => {
    if (bankMerchantId) {
      fetchBankMerchantDetails();
    }
  }, [bankMerchantId, fetchBankMerchantDetails]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "from-green-500 to-emerald-600";
      case "Pending":
        return "from-orange-500 to-amber-600";
      case "Revised":
        return "from-purple-500 to-indigo-600";
      case "Rejected":
        return "from-red-500 to-rose-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bank merchant details...</p>
        </div>
      </div>
    );
  }

  if (error || !bankMerchant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 text-red-500 mx-auto mb-4">❌</div>
          <p className="text-red-600 font-bold">
            {error || "Bank merchant not found"}
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
            Bank Merchant Details
          </h1>
          <p className="text-sm text-gray-600">
            View complete information about the merchant bank account
          </p>
        </div>
      </div>

      {/* Bank Merchant Information Card */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header Section */}
        <div
          className={`bg-gradient-to-r ${getStatusColor(
            bankMerchant.status
          )} p-6`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {bankMerchant.bank_name}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {bankMerchant.account_name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-4 py-2 rounded-xl text-sm font-bold border-2 border-white/30 bg-white/20 backdrop-blur-sm text-white">
                {bankMerchant.status}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* Account Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Account Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-semibold mb-1">
                    Account Number
                  </p>
                  <p className="text-lg font-bold text-blue-700 font-mono">
                    {bankMerchant.account_number}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-purple-600 font-semibold mb-1">
                    Bank Code
                  </p>
                  <p className="text-lg font-bold text-purple-700 font-mono">
                    {bankMerchant.bank_code}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-green-600 font-semibold mb-1">
                    Account Name
                  </p>
                  <p className="text-lg font-bold text-green-700">
                    {bankMerchant.account_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl border border-indigo-200">
                <div className="p-3 bg-indigo-500/20 rounded-lg">
                  <Store className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-indigo-600 font-semibold mb-1">
                    Merchant Name
                  </p>
                  <p className="text-lg font-bold text-indigo-700">
                    {bankMerchant.merchant_name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              User Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">
                    Created By
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {bankMerchant.created_by_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">
                    Accepted By
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {bankMerchant.accepted_by_name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reason (if exists) */}
          {bankMerchant.reason && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Additional Information
              </h3>

              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="p-2 bg-amber-100 rounded-lg mt-1">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-amber-600 font-semibold mb-1">
                    Reason
                  </p>
                  <p className="text-sm text-gray-700">{bankMerchant.reason}</p>
                </div>
              </div>
            </div>
          )}

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
                    {new Date(bankMerchant.created_at).toLocaleString("id-ID", {
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
                    {new Date(bankMerchant.updated_at).toLocaleString("id-ID", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ID Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              System Information
            </h3>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-semibold mb-1">
                  Bank Merchant ID
                </p>
                <p className="text-xs font-mono text-gray-700 break-all">
                  {bankMerchant.bank_merchant_id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRoleProtection(BankMerchantDetailPage, [
  "PartnerOwner",
  "AgentOwner",
]);
