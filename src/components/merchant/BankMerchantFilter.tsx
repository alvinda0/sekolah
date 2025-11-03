// components/bank-merchant/BankMerchantFilter.tsx
"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
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
import { BankMerchantQueryParams } from "@/types/bank-merchant";

interface BankMerchantFilterProps {
    onApplyFilters: (filters: BankMerchantQueryParams) => void;
}

export const BankMerchantFilter: React.FC<BankMerchantFilterProps> = ({
    onApplyFilters,
}) => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string>("all");

    const applyFilters = () => {
        const filters: BankMerchantQueryParams = {
            page: 1,
            limit: 100,
        };

        if (search.trim()) filters.search = search.trim();
        if (status !== "all") filters.status = status;

        onApplyFilters(filters);
    };

    const handleClear = () => {
        setSearch("");
        setStatus("all");
        onApplyFilters({ page: 1, limit: 100 });
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
            </div>

            {/* Open Filters */}
            <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[250px]">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            id="search"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                            placeholder="Search by bank name, account number, or account name..."
                            className="pl-10 bg-white/50 backdrop-blur-sm"
                        />
                    </div>
                </div>

                <div className="w-[180px]">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger
                            id="status"
                            className="mt-2 bg-white/50 backdrop-blur-sm"
                        >
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Accepted">Accepted</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Revised">Revised</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    onClick={applyFilters}
                    className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                >
                    Apply
                </Button>

                <Button
                    onClick={handleClear}
                    variant="outline"
                    className="bg-red-500/20 hover:bg-red-500/30 border-red-200 text-red-700"
                >
                    <X className="w-4 h-4 mr-2" />
                    Clear
                </Button>
            </div>
        </div>
    );
};