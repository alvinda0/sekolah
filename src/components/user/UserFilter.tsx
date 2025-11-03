// components/UserFilter.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { UserQueryParams } from "@/types/user";
import { usePermission } from "@/components/ProtectedRoles";
import { platformService } from "@/services/platform.service";
import { agentService } from "@/services/agent.service";
import { Platform } from "@/types/platform";
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

interface UserFilterProps {
  onApplyFilters: (filters: UserQueryParams) => void;
}

export const UserFilter: React.FC<UserFilterProps> = ({ onApplyFilters }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(false);
  const [loadingAgents, setLoadingAgents] = useState(false);

  const isPartnerOwner = usePermission("PartnerOwner");
  const isPlatformOwner = usePermission("PlatformOwner");
  const isAgentOwner = usePermission("AgentOwner");
  const canSeePlatform = isPartnerOwner;
  const canSeeAgent = isPartnerOwner || isPlatformOwner;

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("all");
  const [platformId, setPlatformId] = useState<string>("all");
  const [agentId, setAgentId] = useState<string>("all");

  const getAvailableRoles = () => {
    if (isPartnerOwner) {
      return [
        { value: "6", label: "Platform Owner" },
        { value: "7", label: "Platform Staff" },
        { value: "8", label: "Agent Owner" },
        { value: "9", label: "Agent Staff" },
      ];
    }
    if (isPlatformOwner) {
      return [
        { value: "7", label: "Platform Staff" },
        { value: "8", label: "Agent Owner" },
        { value: "9", label: "Agent Staff" },
      ];
    }
    if (isAgentOwner) {
      return [{ value: "9", label: "Agent Staff" }];
    }
    return [
      { value: "5", label: "Partner Owner" },
      { value: "6", label: "Platform Owner" },
      { value: "7", label: "Platform Staff" },
      { value: "8", label: "Agent Owner" },
      { value: "9", label: "Agent Staff" },
    ];
  };

  useEffect(() => {
    if (canSeePlatform && showAdvanced) {
      fetchPlatforms();
    }
  }, [canSeePlatform, showAdvanced]);

  useEffect(() => {
    if (canSeeAgent && showAdvanced) {
      fetchAgents(platformId);
    }
  }, [canSeeAgent, showAdvanced, platformId]);

  const handlePlatformChange = (value: string) => {
    setPlatformId(value);
    setAgentId("all"); // Reset agent selection saat platform berubah
  };

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

  const fetchAgents = async (platformIdFilter?: string) => {
    try {
      setLoadingAgents(true);
      const data = await agentService.getAgentsForSelect();

      // Filter di frontend jika ada platform_id
      if (platformIdFilter && platformIdFilter !== "all") {
        const filtered = data.filter(
          (agent) => agent.platform_id === Number(platformIdFilter)
        );
        setAgents(filtered);
      } else {
        setAgents(data);
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error);
    } finally {
      setLoadingAgents(false);
    }
  };

  const applyFilters = () => {
    const filters: UserQueryParams = {
      page: 1,
      limit: 100,
    };

    if (search.trim()) filters.search = search.trim();
    if (role !== "all") filters.role = role;
    if (platformId !== "all") filters.platform_id = platformId;
    if (agentId !== "all") filters.agent_id = agentId;

    onApplyFilters(filters);
  };

  const handleClear = () => {
    setSearch("");
    setRole("all");
    setPlatformId("all");
    setAgentId("all");
    onApplyFilters({ page: 1, limit: 100 });
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
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
              placeholder="Search by name, email, or phone..."
              className="pl-10 bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="w-[200px]">
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger
              id="role"
              className="mt-2 bg-white/50 backdrop-blur-sm"
            >
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {getAvailableRoles().map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
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
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant="outline"
          className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-200 text-blue-700"
        >
          <Filter className="w-4 h-4 mr-2" />
          Advanced
          <ChevronDown
            className={`w-4 h-4 ml-2 transition-transform ${
              showAdvanced ? "rotate-180" : ""
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
          {canSeePlatform && (
            <div className="w-[250px]">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={platformId}
                onValueChange={handlePlatformChange}
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
                    <SelectItem
                      key={p.platform_id}
                      value={String(p.platform_id)}
                    >
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loadingPlatforms && (
                <p className="text-xs text-gray-500 mt-1">
                  Loading platforms...
                </p>
              )}
            </div>
          )}

          {canSeeAgent && (
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
          )}
        </div>
      )}
    </div>
  );
};
