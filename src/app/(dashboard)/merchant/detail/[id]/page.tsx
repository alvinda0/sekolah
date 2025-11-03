"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Calendar,
    Activity,
    Briefcase,
    Building2,
    Server,
    Tag,
    UserCheck,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Merchant } from "@/types/merchant";
import { merchantService } from "@/services/merchant.service";
import { withRoleProtection } from "@/components/ProtectedRoles";

export const runtime = 'edge';

const MerchantDetailPage = () => {
    usePageTitle("Merchant Details");
    const params = useParams();
    const router = useRouter();
    const merchantId = params.id as string;

    const [merchant, setMerchant] = useState<Merchant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMerchantDetails = useCallback(async () => {
        try {
            setLoading(true);
            const data = await merchantService.getMerchantById(merchantId);
            setMerchant(data);
            setError(null);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to fetch merchant details";
            setError(errorMessage);
            setMerchant(null);
        } finally {
            setLoading(false);
        }
    }, [merchantId]);

    useEffect(() => {
        if (merchantId) {
            fetchMerchantDetails();
        }
    }, [merchantId, fetchMerchantDetails]);

    // Function to get gradient color based on status
    const getStatusGradient = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "from-green-500 to-emerald-600";
            case "PENDING":
                return "from-orange-500 to-amber-600";
            case "INACTIVE":
                return "from-red-500 to-rose-600";
            default:
                return "from-blue-500 to-indigo-600";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading merchant details...</p>
                </div>
            </div>
        );
    }

    if (error || !merchant) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 text-red-500 mx-auto mb-4">❌</div>
                    <p className="text-red-600 font-bold">{error || "Merchant not found"}</p>
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
                    <h1 className="text-2xl font-bold text-gray-800">Merchant Details</h1>
                    <p className="text-sm text-gray-600">
                        View complete information about the merchant
                    </p>
                </div>
            </div>

            {/* Merchant Information Card */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                {/* Header Section with Dynamic Gradient */}
                <div className={`bg-gradient-to-r ${getStatusGradient(merchant.status)} p-6`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{merchant.name}</h2>
                            <p className="text-white/80 text-sm mt-1">
                                ID: {merchant.merchant_id}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-4 py-2 rounded-xl text-sm font-bold border-2 border-white/30 bg-white/20 backdrop-blur-sm text-white">
                                {merchant.status}
                            </span>
                            <span className="px-4 py-2 rounded-xl text-sm font-bold border-2 border-white/30 bg-white/20 backdrop-blur-sm text-white">
                                <div className="flex items-center gap-1">
                                    <Server className="w-4 h-4" />
                                    {merchant.environment}
                                </div>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            Basic Information
                        </h3>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">Vendor ID</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    Vendor {merchant.vendor_id}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <UserCheck className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">Agent ID</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    Agent {merchant.agent_id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Business Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            Business Information
                        </h3>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Briefcase className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">
                                    Merchant Type
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                    Type {merchant.merchant_type_id}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Tag className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">
                                    Merchant ID
                                </p>
                                <p className="text-xs font-mono text-gray-800 break-all">
                                    {merchant.merchant_id}
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
                                        {new Date(merchant.created_at).toLocaleString("id-ID", {
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
                                        {new Date(merchant.updated_at).toLocaleString("id-ID", {
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

export default withRoleProtection(MerchantDetailPage, [
  "PartnerOwner",
  "PlatformOwner",
  "AgentOwner",
]);