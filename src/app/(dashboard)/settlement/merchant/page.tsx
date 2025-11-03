"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CustomDataTable from "@/components/CustomDataTable";
import { settlementService } from "@/services/settlement.service";
import { Settlement, SettlementQueryParams } from "@/types/settlement";
import { Eye, Calendar, Store, User, FileText, DollarSign } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ErrorState } from "@/components/ErrorState";
import { SettlementFilter } from "@/components/settlement/SettlementFilter";

const ListSettlementPage = () => {
    usePageTitle("Settlement List");
    const router = useRouter();
    const [settlements, setSettlements] = useState<Settlement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettlements = useCallback(
        async (filters: SettlementQueryParams) => {
            try {
                setLoading(true);
                setError(null);
                const data = await settlementService.getSettlements(filters);
                setSettlements(Array.isArray(data) ? data : []);
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch settlements";
                setError(errorMessage);
                setSettlements([]);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchSettlements({ page: 1, limit: 10 });
    }, [fetchSettlements]);

    const handleApplyFilters = (filters: SettlementQueryParams) => {
        fetchSettlements(filters);
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleViewDetails = (settlementId: string) => {
        router.push(`/settlement/merchant/detail/${settlementId}`);
    };

    const getErrorCode = (): 400 | 401 | 403 | 404 | 500 => {
        if (!error) return 500;
        if (error.toLowerCase().includes("unauthorized") || error.toLowerCase().includes("authentication")) return 401;
        if (error.toLowerCase().includes("forbidden") || error.toLowerCase().includes("permission")) return 403;
        if (error.toLowerCase().includes("not found")) return 404;
        if (error.toLowerCase().includes("bad request") || error.toLowerCase().includes("invalid")) return 400;
        return 500;
    };

    const settlementColumns = [
        {
            name: "Created At",
            selector: (row: Settlement) => row.created_at,
            sortable: true,
            cell: (row: Settlement) => (
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
            name: "Merchant",
            selector: (row: Settlement) => row.merchant_name,
            sortable: true,
            cell: (row: Settlement) => (
                <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-semibold text-gray-700 truncate max-w-[200px]">
                        {row.merchant_name}
                    </span>
                </div>
            ),
        },
        {
            name: "Amount",
            selector: (row: Settlement) => row.amount,
            sortable: true,
            cell: (row: Settlement) => (
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
            selector: (row: Settlement) => row.reference,
            sortable: true,
            cell: (row: Settlement) => (
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">
                        {row.reference}
                    </span>
                </div>
            ),
        },

        {
            name: "Actions",
            cell: (row: Settlement) => (
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
                <SettlementFilter onApplyFilters={handleApplyFilters} />
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading settlements...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <SettlementFilter onApplyFilters={handleApplyFilters} />
                <ErrorState
                    code={getErrorCode()}
                    description={error}
                    onAction={() => fetchSettlements({ page: 1, limit: 10 })}
                    actionLabel="Retry"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <SettlementFilter onApplyFilters={handleApplyFilters} />
            <CustomDataTable
                title="Settlement Merchant"
                description="Manage and view all merchant settlement transactions"
                columns={settlementColumns}
                data={settlements}
            />
        </div>
    );
};

export default withRoleProtection(ListSettlementPage, [
    "PartnerOwner", "PlatformOwner", "PlatformStaff", "SuperAgent", "AgentOwner", "AgentStaff"
]);