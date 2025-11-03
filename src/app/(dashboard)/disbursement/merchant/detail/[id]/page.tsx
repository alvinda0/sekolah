"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { disbursementMerchantService } from "@/services/disbursement-merchant.service";
import { DisbursementMerchant } from "@/types/disbursement-merchant";
import {
  ArrowLeft,
  Calendar,
  Activity,
  Banknote,
  CreditCard,
  Building2,
  User,
  Hash,
  CheckCircle,
  DollarSign,
  Store,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { withRoleProtection } from "@/components/ProtectedRoles";

export const runtime = 'edge';

const DisbursementMerchantDetailPage = () => {
  usePageTitle("Disbursement Merchant Details");
  const params = useParams();
  const router = useRouter();
  const disbursementId = params.id as string;

  const [disbursement, setDisbursement] = useState<DisbursementMerchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDisbursementDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await disbursementMerchantService.getDisbursementMerchantById(disbursementId);
      setDisbursement(data);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch disbursement merchant details";
      setError(errorMessage);
      setDisbursement(null);
    } finally {
      setLoading(false);
    }
  }, [disbursementId]);

  useEffect(() => {
    if (disbursementId) {
      fetchDisbursementDetails();
    }
  }, [disbursementId, fetchDisbursementDetails]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      PENDING: "bg-yellow-500/20 text-white border-yellow-300",
      APPROVED: "bg-green-500/20 text-white border-green-300",
      REJECTED: "bg-red-500/20 text-white border-red-300",
      PROCESSING: "bg-blue-500/20 text-white border-blue-300",
    };
    return colors[status] || "bg-gray-500/20 text-white border-gray-300";
  };

  const getStatusBadgeColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      PENDING: "from-yellow-500 to-orange-600",
      APPROVED: "from-green-500 to-emerald-600",
      REJECTED: "from-red-500 to-rose-600",
      PROCESSING: "from-blue-500 to-indigo-600",
    };
    return colors[status] || "from-gray-500 to-gray-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading disbursement merchant details...</p>
        </div>
      </div>
    );
  }

  if (error || !disbursement) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 text-red-500 mx-auto mb-4">❌</div>
          <p className="text-red-600 font-bold">{error || "Disbursement merchant not found"}</p>
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
          <h1 className="text-2xl font-bold text-gray-800">Disbursement Merchant Details</h1>
          <p className="text-sm text-gray-600">
            View complete information about the disbursement merchant
          </p>
        </div>
      </div>

      {/* Disbursement Information Card */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className={`bg-gradient-to-r ${getStatusBadgeColor(disbursement.status)} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{disbursement.bank_name}</h2>
                <span className="px-3 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-bold border border-white/30 flex items-center gap-1">
                  <Store className="w-3 h-3" />
                  {disbursement.merchant_name}
                </span>
              </div>
              <p className="text-white/80 text-sm">ID: {disbursement.disbursement_id}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm border ${getStatusColor(
                disbursement.status
              )}`}
            >
              {disbursement.status}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bank Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Bank Information
            </h3>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Bank Name</p>
                <p className="text-sm font-semibold text-gray-800">
                  {disbursement.bank_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Hash className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Bank Code</p>
                <p className="text-sm font-semibold text-gray-800">
                  {disbursement.bank_code}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Account Name</p>
                <p className="text-sm font-semibold text-gray-800">
                  {disbursement.account_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-pink-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Account Number</p>
                <p className="text-sm font-semibold text-gray-800">
                  {disbursement.account_number}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Transaction Information
            </h3>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Banknote className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Amount</p>
                <p className="text-sm font-bold text-emerald-600">
                  {formatCurrency(disbursement.amount)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Admin Cost</p>
                <p className="text-sm font-semibold text-gray-800">
                  {formatCurrency(disbursement.admin_cost)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Total Disbursements</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(disbursement.total_disbursements)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Hash className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Type</p>
                <p className="text-sm font-semibold text-gray-800">
                  {disbursement.type}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Additional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Store className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Merchant Name</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {disbursement.merchant_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <Hash className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Merchant ID</p>
                  <p className="text-sm font-semibold text-gray-800 break-all">
                    {disbursement.merchant_id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Status</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {disbursement.status}
                  </p>
                </div>
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
                  <p className="text-xs text-gray-500 font-semibold">Created At</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(disbursement.created_at).toLocaleString("en-US", {
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
                  <p className="text-xs text-gray-500 font-semibold">Updated At</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(disbursement.updated_at).toLocaleString("en-US", {
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

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 backdrop-blur-sm rounded-2xl border border-orange-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Transaction Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-500 font-semibold mb-1">Base Amount</p>
            <p className="text-xl font-bold text-gray-800">
              {formatCurrency(disbursement.amount)}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-500 font-semibold mb-1">Admin Fee</p>
            <p className="text-xl font-bold text-orange-600">
              {formatCurrency(disbursement.admin_cost)}
            </p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg p-4 border border-orange-300">
            <p className="text-xs text-white/80 font-semibold mb-1">Total Amount</p>
            <p className="text-xl font-bold text-white">
              {formatCurrency(disbursement.total_disbursements)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRoleProtection(DisbursementMerchantDetailPage, ["PartnerOwner"]);