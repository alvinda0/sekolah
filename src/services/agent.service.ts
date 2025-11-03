// services/agent.service.ts
import { apiClient } from "@/lib/axios";
import {
  Agent,
  AgentResponse,
  AgentDetailResponse,
  AgentQueryParams,
} from "@/types/agent";

class AgentService {
  async getAgents(params?: AgentQueryParams): Promise<Agent[]> {
    const { data } = await apiClient.get<AgentResponse>("/api/v1/agents", {
      params,
    });

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Failed to fetch agents");
  }

  async getAgentsForSelect(): Promise<Agent[]> {
    const { data } = await apiClient.get<AgentResponse>("/api/v1/agents", {
      params: { limit: 256 },
    });

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Failed to fetch agents");
  }

  async getAgentById(agentId: string): Promise<Agent> {
    const { data } = await apiClient.get<AgentDetailResponse>(
      `/api/v1/agents/${agentId}`
    );

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Failed to fetch agent details");
  }
}

export const agentService = new AgentService();
