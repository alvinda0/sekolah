"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CustomDataTable from "@/components/CustomDataTable";
import { settlementPlatformService } from "@/services/settlement-platform.service";
import { SettlementPlatform, SettlementPlatformQueryParams } from "@/types/settlement-platform";
import { Eye, Calendar, Layers, User, FileText, DollarSign } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ErrorState } from "@/components/ErrorState";
import { SettlementPlatformFilter } from "@/components/settlement/SettlementPlatformFilter";

const ListSettlementPlatformPage = () => {
    usePageTitle("Settlement Platform List");
    const router = useRouter();
    const [settlementPlatforms, setSettlementPlatforms] = useState<SettlementPlatform[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettlementPlatforms = useCallback(
        async (filters: SettlementPlatformQueryParams) => {
            try {
                setLoading(true);
                setError(null);
                const data = await settlementPlatformService.getSettlementPlatforms(filters);
                setSettlementPlatforms(Array.isArray(data) ? data : []);
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch settlement platforms";
                setError(errorMessage);
                setSettlementPlatforms([]);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchSettlementPlatforms({ page: 1, limit: 10 });
    }, [fetchSettlementPlatforms]);

    const handleApplyFilters = (filters: SettlementPlatformQueryParams) => {
        fetchSettlementPlatforms(filters);
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleViewDetails = (settlementId: string) => {
        router.push(`/settlement/platform/detail/${settlementId}`);
    };

    const getErrorCode = (): 400 | 401 | 403 | 404 | 500 => {
        if (!error) return 500;
        if (error.toLowerCase().includes("unauthorized") || error.toLowerCase().includes("authentication")) return 401;
        if (error.toLowerCase().includes("forbidden") || error.toLowerCase().includes("permission")) return 403;
        if (error.toLowerCase().includes("not found")) return 404;
        if (error.toLowerCase().includes("bad request") || error.toLowerCase().includes("invalid")) return 400;
        return 500;
    };

    const settlementPlatformColumns = [
        {
            name: "Created At",
            selector: (row: SettlementPlatform) => row.created_at,
            sortable: true,
            cell: (row: SettlementPlatform) => (
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                        {new Date(row.created_at).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
            ),
        },
        {
            name: "Platform",
            selector: (row: SettlementPlatform) => row.platform_name,
            sortable: true,
            cell: (row: SettlementPlatform) => (
                <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-semibold text-gray-700">
                        {row.platform_name}
                    </span>
                </div>
            ),
        },
        {
            name: "Amount",
            selector: (row: SettlementPlatform) => row.amount,
            sortable: true,
            cell: (row: SettlementPlatform) => (
                <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-bold text-green-700">
                        {formatCurrency(row.amount)}
                    </span>
                </div>
            ),
        },
        {
            name: "Reference",
            selector: (row: SettlementPlatform) => row.reference,
            sortable: true,
            cell: (row: SettlementPlatform) => (
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">
                        {row.reference}
                    </span>
                </div>
            ),
        },
        {
            name: "Settled By",
            selector: (row: SettlementPlatform) => row.settle_by_name,
            sortable: true,
            cell: (row: SettlementPlatform) => (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">
                        {row.settle_by_name}
                    </span>
                </div>
            ),
        },
        {
            name: "Actions",
            cell: (row: SettlementPlatform) => (
                <button
                    onClick={() => handleViewDetails(row.settlement_id)}
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
                <SettlementPlatformFilter onApplyFilters={handleApplyFilters} />
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading settlement platforms...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <SettlementPlatformFilter onApplyFilters={handleApplyFilters} />
                <ErrorState
                    code={getErrorCode()}
                    description={error}
                    onAction={() => fetchSettlementPlatforms({ page: 1, limit: 10 })}
                    actionLabel="Retry"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <SettlementPlatformFilter onApplyFilters={handleApplyFilters} />
            <CustomDataTable
                title="Settlement Platform Management"
                description="Manage and view all platform settlement transactions"
                columns={settlementPlatformColumns}
                data={settlementPlatforms}
            />
        </div>
    );
};

export default withRoleProtection(ListSettlementPlatformPage, [
    "PartnerOwner", "PlatformOwner", "PlatformStaff"
]);