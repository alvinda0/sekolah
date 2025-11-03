"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CustomDataTable from "@/components/CustomDataTable";
import { agentService } from "@/services/agent.service";
import { Agent, AgentQueryParams } from "@/types/agent";
import { AgentFilter } from "@/components/agent/AgentFilter";
import { Eye, Calendar, Mail, Phone } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ErrorState } from "@/components/ErrorState";

const ListAgentPage = () => {
  usePageTitle("Agent List");
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async (filters?: AgentQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await agentService.getAgents(filters);
      setAgents(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch agents";
      setError(errorMessage);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents({ page: 1, limit: 100 });
  }, [fetchAgents]);

  const handleApplyFilters = (filters: AgentQueryParams) => {
    fetchAgents(filters);
  };

  const getErrorCode = (): 400 | 401 | 403 | 404 | 500 => {
    if (!error) return 500;
    if (error.toLowerCase().includes("unauthorized") || error.toLowerCase().includes("authentication")) return 401;
    if (error.toLowerCase().includes("forbidden") || error.toLowerCase().includes("permission")) return 403;
    if (error.toLowerCase().includes("not found")) return 404;
    if (error.toLowerCase().includes("bad request") || error.toLowerCase().includes("invalid")) return 400;
    return 500;
  };

  const getStatusColor = (status: string): string => {
    const statusColors: { [key: string]: string } = {
      ACTIVE: "bg-green-500/20 text-green-700 border-green-500/40",
      PENDING: "bg-yellow-500/20 text-yellow-700 border-yellow-500/40",
      REJECTED: "bg-red-500/20 text-red-700 border-red-500/40",
      INACTIVE: "bg-gray-500/20 text-gray-700 border-gray-500/40",
    };

    return (
      statusColors[status] || "bg-gray-500/20 text-gray-700 border-gray-500/40"
    );
  };

  const getAgentTypeColor = (typeId: number): string => {
    const colors: { [key: number]: string } = {
      1: "bg-blue-500/20 text-blue-700 border-blue-500/40",
      2: "bg-purple-500/20 text-purple-700 border-purple-500/40",
      3: "bg-indigo-500/20 text-indigo-700 border-indigo-500/40",
    };
    return colors[typeId] || "bg-gray-500/20 text-gray-700 border-gray-500/40";
  };

  const handleViewDetails = (agentId: string) => {
    router.push(`/agent/detail/${agentId}`);
  };

  const agentColumns = [
    {
      name: "Name",
      selector: (row: Agent) => row.name,
      sortable: true,
      cell: (row: Agent) => (
        <div className="font-semibold text-gray-800">{row.name}</div>
      ),
    },
    {
      name: "Email",
      selector: (row: Agent) => row.email,
      sortable: true,
      cell: (row: Agent) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="text-sm">{row.email}</span>
        </div>
      ),
    },
    {
      name: "Phone",
      selector: (row: Agent) => row.phone_number,
      sortable: true,
      cell: (row: Agent) => (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span className="text-sm">{row.phone_number}</span>
        </div>
      ),
    },
    {
      name: "Agent Type",
      selector: (row: Agent) => row.agent_type_id,
      sortable: true,
      cell: (row: Agent) => (
        <span
          className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border ${getAgentTypeColor(
            row.agent_type_id
          )}`}
        >
          Type {row.agent_type_id}
        </span>
      ),
    },
    {
      name: "Platform Name",
      selector: (row: Agent) => row.platform_name,
      sortable: true,
    },
    {
      name: "Fee",
      selector: (row: Agent) => row.fee,
      sortable: true,
      cell: (row: Agent) => (
        <span className="text-sm font-semibold text-gray-700">
          {row.fee.toFixed(1)}%
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: Agent) => row.status,
      sortable: true,
      cell: (row: Agent) => (
        <span
          className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border ${getStatusColor(
            row.status
          )}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Created At",
      selector: (row: Agent) => row.created_at,
      sortable: true,
      cell: (row: Agent) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {new Date(row.created_at).toLocaleDateString("id-ID")}
          </span>
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row: Agent) => (
        <button
          onClick={() => handleViewDetails(row.agent_id)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 rounded-lg transition-all duration-200 border border-blue-500/30 cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span className="text-xs font-bold">Details</span>
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        code={getErrorCode()}
        description={error}
        onAction={() => fetchAgents({ page: 1, limit: 100 })}
        actionLabel="Retry"
      />
    );
  }

  return (
    <div className="space-y-6">
      <AgentFilter onApplyFilters={handleApplyFilters} />

      <CustomDataTable
        title="Agent Management"
        description="Manage and view all system agents"
        columns={agentColumns}
        data={agents}
      />
    </div>
  );
};

export default withRoleProtection(ListAgentPage, [
  "PartnerOwner",
  "PlatformOwner",
  "AgentOwner"
]);