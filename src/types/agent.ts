// types/agent.ts
export interface Agent {
  agent_id: string;
  name: string;
  agent_type_id: number;
  email: string;
  phone_number: string;
  platform_id: number;
  platform_name: string;
  fee: number;
  status: "ACTIVE" | "PENDING" | "REJECTED" | "INACTIVE";
  created_at: string;
  updated_at: string;
}

export interface AgentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  agent_type_id?: number;
  platform_id?: number;
  status?: string;
}

export interface AgentResponse {
  success: boolean;
  message: string;
  data: Agent[];
  metadata?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface AgentDetailResponse {
  success: boolean;
  message: string;
  data: Agent;
}
