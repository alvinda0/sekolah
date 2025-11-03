// components/transaction/TransactionFilter.tsx
"use client";

import React, { useState } from "react";
import { Search, X, RotateCw } from "lucide-react";
import { TransactionQueryParams } from "@/types/transaction";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TransactionFilterProps {
    onApplyFilters: (filters: TransactionQueryParams) => void;
    autoRefresh: boolean;
    onToggleAutoRefresh: () => void;
}

export const TransactionFilter: React.FC<TransactionFilterProps> = ({
    onApplyFilters,
    autoRefresh,
    onToggleAutoRefresh,
}) => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string>("all");

    const handleApplyFilters = () => {
        const filters: TransactionQueryParams = {
            page: 1,
            limit: 10,
        };

        if (search.trim()) {
            filters.search = search.trim();
        }
        
        if (status !== "all") {
            filters.status = status;
        }

        onApplyFilters(filters);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        
        const filters: TransactionQueryParams = {
            page: 1,
            limit: 10,
        };

        if (search.trim()) {
            filters.search = search.trim();
        }
        
        if (value !== "all") {
            filters.status = value;
        }

        onApplyFilters(filters);
    };

    const handleClear = () => {
        setSearch("");
        setStatus("all");
        onApplyFilters({ page: 1, limit: 10 });
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
            </div>

            {/* Main Filters */}
            <div className="flex flex-wrap items-end gap-3">
                {/* Search Input */}
                <div className="flex-1 min-w-[300px]">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            id="search"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleApplyFilters();
                                }
                            }}
                            placeholder="Search by Transaction UUID, Order ID, Reference Number, Username..."
                            className="pl-10 pr-10 bg-white/50 backdrop-blur-sm"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Filter - Auto apply saat berubah */}
                <div className="w-[180px]">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger
                            id="status"
                            className="mt-2 bg-white/50 backdrop-blur-sm"
                        >
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Search Button */}
                <Button
                    onClick={handleApplyFilters}
                    className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                </Button>

                {/* Auto Refresh Toggle */}
                <Button
                    onClick={onToggleAutoRefresh}
                    variant="outline"
                    className={`${
                        autoRefresh
                            ? "bg-green-500/20 hover:bg-green-500/30 border-green-300 text-green-700"
                            : "bg-gray-500/10 hover:bg-gray-500/20 border-gray-200 text-gray-700"
                    }`}
                >
                    <RotateCw
                        className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`}
                    />
                    Auto Refresh {autoRefresh ? "ON" : "OFF"}
                </Button>

                {/* Clear Button - Hanya muncul saat ada filter aktif */}
                {(search || status !== "all") && (
                    <Button
                        onClick={handleClear}
                        variant="outline"
                        className="bg-red-500/20 hover:bg-red-500/30 border-red-200 text-red-700"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
};