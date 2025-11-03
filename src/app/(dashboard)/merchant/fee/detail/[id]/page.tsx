"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    DollarSign,
    Activity,
    Building2,
    User,
    Hash,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Fee } from "@/types/fee";
import { feeService } from "@/services/fee.service";
import { withRoleProtection } from "@/components/ProtectedRoles";

export const runtime = 'edge';

const FeeDetailPage = () => {
    usePageTitle("Merchant Fee Details");
    const params = useParams();
    const router = useRouter();
    const agentId = params.id as string;

    const [fee, setFee] = useState<Fee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFeeDetails = useCallback(async () => {
        try {
            setLoading(true);
            const data = await feeService.getFeeById(agentId);
            setFee(data);
            setError(null);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to fetch fee details";
            setError(errorMessage);
            setFee(null);
        } finally {
            setLoading(false);
        }
    }, [agentId]);

    useEffect(() => {
        if (agentId) {
            fetchFeeDetails();
        }
    }, [agentId, fetchFeeDetails]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading fee details...</p>
                </div>
            </div>
        );
    }

    if (error || !fee) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 text-red-500 mx-auto mb-4">❌</div>
                    <p className="text-red-600 font-bold">{error || "Fee not found"}</p>
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
                        Merchant Fee Details
                    </h1>
                    <p className="text-sm text-gray-600">
                        View complete fee information for the merchant
                    </p>
                </div>
            </div>

            {/* Fee Information Card */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{fee.name}</h2>
                            <p className="text-blue-100 text-sm mt-1">
                                Agent ID: {fee.agent_id}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span
                                className={`px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm border ${fee.status === "ACTIVE"
                                    ? "bg-green-500/20 text-white border-green-300"
                                    : "bg-red-500/20 text-white border-red-300"
                                    }`}
                            >
                                {fee.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Agent Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            Agent Information
                        </h3>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">Agent Name</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {fee.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Hash className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">Agent ID</p>
                                <p className="text-sm font-semibold text-gray-800 break-all">
                                    {fee.agent_id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Platform Information */}
                    <div className="space-y-4">
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
                                    {fee.platform_name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Activity className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold">
                                    Platform ID
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                    Platform {fee.platform_id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Fee Information */}
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            Fee Configuration
                        </h3>

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500 rounded-xl">
                                        <DollarSign className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold">
                                            Total Merchant Fee
                                        </p>
                                        <p className="text-4xl font-bold text-gray-800 mt-1">
                                            {fee.total_fee}%
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 font-semibold">
                                        Fee Status
                                    </p>
                                    <span
                                        className={`inline-block mt-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${fee.status === "ACTIVE"
                                            ? "bg-green-500/20 text-green-700 border-green-500/40"
                                            : "bg-red-500/20 text-red-700 border-red-500/40"
                                            }`}
                                    >
                                        {fee.status}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-blue-200">
                                <p className="text-xs text-gray-600">
                                    This fee configuration applies to all transactions processed
                                    through the <span className="font-bold">{fee.platform_name}</span> platform
                                    for agent <span className="font-bold">{fee.name}</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRoleProtection(FeeDetailPage, [
  "PartnerOwner",
  "PlatformOwner",
  "AgentOwner",
]);