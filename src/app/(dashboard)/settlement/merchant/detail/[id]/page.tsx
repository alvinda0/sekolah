"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { settlementService } from "@/services/settlement.service";
import { Settlement } from "@/types/settlement";
import {
    ArrowLeft,
    Calendar,
    Store,
    User,
    FileText,
    DollarSign,
    Clock,
    CheckCircle2,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/button";

export const runtime = 'edge';

const SettlementDetailPage = () => {
    usePageTitle("Settlement Detail");
    const router = useRouter();
    const params = useParams();
    const settlementId = params?.id as string;

    const [settlement, setSettlement] = useState<Settlement | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettlementDetail = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await settlementService.getSettlementById(settlementId);
            setSettlement(data);
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch settlement details";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [settlementId]);

    useEffect(() => {
        if (settlementId) {
            fetchSettlementDetail();
        }
    }, [settlementId, fetchSettlementDetail]);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDateTime = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading settlement details...</p>
                </div>
            </div>
        );
    }

    if (error || !settlement) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Button
                    onClick={() => router.back()}
                    variant="outline"
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <ErrorState
                    code={getErrorCode()}
                    description={error || "Settlement not found"}
                    onAction={fetchSettlementDetail}
                    actionLabel="Retry"
                />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button
                    onClick={() => router.back()}
                    variant="outline"
                    className="hover:bg-gray-100"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">Completed</span>
                </div>
            </div>

            {/* Main Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-lg p-8">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Settlement Details
                        </h1>
                        <p className="text-gray-600">
                            Settlement ID: <span className="font-mono text-sm">{settlement.settlement_id}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Settlement Amount</p>
                        <p className="text-3xl font-bold text-green-600">
                            {formatCurrency(settlement.amount)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Merchant Info */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-indigo-100 p-3 rounded-lg">
                                <Store className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Merchant</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {settlement.merchant_name}
                                </p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Merchant ID:</span>
                            <br />
                            <span className="font-mono text-xs">{settlement.merchant_id}</span>
                        </div>
                    </div>

                    {/* Reference Info */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Reference</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {settlement.reference}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Settled By Info */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <User className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Settled By</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {settlement.settle_by_name}
                                </p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">User ID:</span>
                            <br />
                            <span className="font-mono text-xs">{settlement.settle_by}</span>
                        </div>
                    </div>

                    {/* Amount Info */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Settlement Amount</p>
                                <p className="text-lg font-semibold text-green-700">
                                    {formatCurrency(settlement.amount)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    Timeline
                </h2>

                <div className="space-y-6">
                    {/* Created */}
                    <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="w-0.5 h-12 bg-gray-300 mt-2"></div>
                        </div>
                        <div className="flex-1 pt-1">
                            <p className="font-semibold text-gray-900">Settlement Created</p>
                            <p className="text-sm text-gray-600 mt-1">
                                {formatDateTime(settlement.created_at)}
                            </p>
                        </div>
                    </div>

                    {/* Updated */}
                    <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                            <div className="bg-green-100 p-2 rounded-full">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <div className="flex-1 pt-1">
                            <p className="font-semibold text-gray-900">Last Updated</p>
                            <p className="text-sm text-gray-600 mt-1">
                                {formatDateTime(settlement.updated_at)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Additional Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Settlement ID:</span>
                        <span className="font-mono text-gray-900 text-xs">
                            {settlement.settlement_id}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Merchant ID:</span>
                        <span className="font-mono text-gray-900 text-xs">
                            {settlement.merchant_id}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Settle By ID:</span>
                        <span className="font-mono text-gray-900 text-xs">
                            {settlement.settle_by}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Reference:</span>
                        <span className="font-semibold text-gray-900">
                            {settlement.reference}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRoleProtection(SettlementDetailPage, [
    "PartnerOwner", "PlatformOwner", "PlatformStaff", "SuperAgent", "AgentOwner", "AgentStaff"
]);