// components/fee/FeeFilter.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { usePermission } from "@/components/ProtectedRoles";
import { platformService } from "@/services/platform.service";
import { Platform } from "@/types/platform";
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

export interface FeeQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    platform_id?: number;
    status?: string;
}

interface FeeFilterProps {
    onApplyFilters: (filters: FeeQueryParams) => void;
}

export const FeeFilter: React.FC<FeeFilterProps> = ({ onApplyFilters }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [loadingPlatforms, setLoadingPlatforms] = useState(false);

    const isPartnerOwner = usePermission("PartnerOwner");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string>("all");
    const [platformId, setPlatformId] = useState<string>("all");

    useEffect(() => {
        if (isPartnerOwner && showAdvanced) {
            fetchPlatforms();
        }
    }, [isPartnerOwner, showAdvanced]);

    const fetchPlatforms = async () => {
        try {
            setLoadingPlatforms(true);
            const data = await platformService.getPlatformsForSelect();
            setPlatforms(data);
        } catch (error) {
            console.error("Failed to fetch platforms:", error);
        } finally {
            setLoadingPlatforms(false);
        }
    };

    const applyFilters = () => {
        const filters: FeeQueryParams = {
            page: 1,
            limit: 100,
        };

        if (search.trim()) filters.search = search.trim();
        if (status !== "all") filters.status = status;
        if (platformId !== "all") {
            // platformId dari select adalah string (platform_id dari API)
            // Kita perlu convert ke number untuk API query
            const platformIdNum = parseInt(platformId, 10);
            if (!isNaN(platformIdNum)) {
                filters.platform_id = platformIdNum;
            }
        }

        onApplyFilters(filters);
    };

    const handleClear = () => {
        setSearch("");
        setStatus("all");
        setPlatformId("all");
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
                            placeholder="Search by agent name..."
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
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    onClick={applyFilters}
                    className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                >
                    Apply
                </Button>

                {isPartnerOwner && (
                    <Button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        variant="outline"
                        className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-200 text-blue-700"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Advanced
                        <ChevronDown
                            className={`w-4 h-4 ml-2 transition-transform ${showAdvanced ? "rotate-180" : ""
                                }`}
                        />
                    </Button>
                )}

                <Button
                    onClick={handleClear}
                    variant="outline"
                    className="bg-red-500/20 hover:bg-red-500/30 border-red-200 text-red-700"
                >
                    <X className="w-4 h-4 mr-2" />
                    Clear
                </Button>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && isPartnerOwner && (
                <div className="flex flex-wrap items-end gap-3 pt-4 border-t border-gray-200">
                    <div className="w-[250px]">
                        <Label htmlFor="platform">Platform</Label>
                        <Select
                            value={platformId}
                            onValueChange={setPlatformId}
                            disabled={loadingPlatforms}
                        >
                            <SelectTrigger
                                id="platform"
                                className="mt-2 bg-white/50 backdrop-blur-sm"
                            >
                                <SelectValue placeholder="All Platforms" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Platforms</SelectItem>
                                {platforms.map((p) => (
                                    <SelectItem key={p.platform_id} value={p.platform_id}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {loadingPlatforms && (
                            <p className="text-xs text-gray-500 mt-1">Loading platforms...</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};