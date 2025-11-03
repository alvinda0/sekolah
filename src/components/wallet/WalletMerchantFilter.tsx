// components/wallet-merchant/WalletMerchantFilter.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { merchantService } from "@/services/merchant.service";
import { agentService } from "@/services/agent.service";
import { Merchant } from "@/types/merchant";
import { Agent } from "@/types/agent";
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

export interface WalletMerchantQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    merchant_id?: string;
    agent_id?: string;
}

interface WalletMerchantFilterProps {
    onApplyFilters: (filters: WalletMerchantQueryParams) => void;
}

export const WalletMerchantFilter: React.FC<WalletMerchantFilterProps> = ({
    onApplyFilters,
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loadingMerchants, setLoadingMerchants] = useState(false);
    const [loadingAgents, setLoadingAgents] = useState(false);

    const [search, setSearch] = useState("");
    const [merchantId, setMerchantId] = useState<string>("all");
    const [agentId, setAgentId] = useState<string>("all");

    useEffect(() => {
        if (showAdvanced) {
            fetchMerchants();
            fetchAgents();
        }
    }, [showAdvanced]);

    const fetchMerchants = async () => {
        try {
            setLoadingMerchants(true);
            const data = await merchantService.getMerchantforSelect();
            setMerchants(data);
        }
        catch (error) {
            console.error("Failed to fetch merchants:", error);
        } finally {
            setLoadingMerchants(false);
        }
    };
    
    const fetchAgents = async () => {
        try {
            setLoadingAgents(true);
            const data = await agentService.getAgentsForSelect();
            setAgents(data);
        } catch (error) {
            console.error("Failed to fetch agents:", error);
        } finally {
            setLoadingAgents(false);
        }
    };

    const applyFilters = () => {
        const filters: WalletMerchantQueryParams = {
            page: 1,
            limit: 100,
        };

        if (search.trim()) filters.search = search.trim();
        if (merchantId !== "all") filters.merchant_id = merchantId;
        if (agentId !== "all") filters.agent_id = agentId;

        onApplyFilters(filters);
    };

    const handleClear = () => {
        setSearch("");
        setMerchantId("all");
        setAgentId("all");
        onApplyFilters({ page: 1, limit: 100 });
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">
                    Search & Filter
                </h3>
            </div>

            <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[300px]">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            id="search"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                            placeholder="Search wallet merchant..."
                            className="pl-10 bg-white/50 backdrop-blur-sm"
                        />
                    </div>
                </div>

                <Button
                    onClick={applyFilters}
                    className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                >
                    Apply
                </Button>

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

                <Button
                    onClick={handleClear}
                    variant="outline"
                    className="bg-red-500/20 hover:bg-red-500/30 border-red-200 text-red-700"
                >
                    <X className="w-4 h-4 mr-2" />
                    Clear
                </Button>
            </div>

            {showAdvanced && (
                <div className="flex flex-wrap items-end gap-3 pt-4 border-t border-gray-200">
                    <div className="w-[250px]">
                        <Label htmlFor="merchant">Merchant</Label>
                        <Select
                            value={merchantId}
                            onValueChange={setMerchantId}
                            disabled={loadingMerchants}
                        >
                            <SelectTrigger
                                id="merchant"
                                className="mt-2 bg-white/50 backdrop-blur-sm"
                            >
                                <SelectValue placeholder="All Merchants" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Merchants</SelectItem>
                                {merchants.map((m) => (
                                    <SelectItem key={m.merchant_id} value={m.merchant_id}>
                                        {m.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {loadingMerchants && (
                            <p className="text-xs text-gray-500 mt-1">
                                Loading merchants...
                            </p>
                        )}
                    </div>

                    <div className="w-[250px]">
                        <Label htmlFor="agent">Agent</Label>
                        <Select
                            value={agentId}
                            onValueChange={setAgentId}
                            disabled={loadingAgents}
                        >
                            <SelectTrigger
                                id="agent"
                                className="mt-2 bg-white/50 backdrop-blur-sm"
                            >
                                <SelectValue placeholder="All Agents" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Agents</SelectItem>
                                {agents.map((a) => (
                                    <SelectItem key={a.agent_id} value={String(a.agent_id)}>
                                        {a.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {loadingAgents && (
                            <p className="text-xs text-gray-500 mt-1">Loading agents...</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};