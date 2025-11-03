
// types/fee.ts
export interface Fee {
    agent_id: string;
    name: string;
    platform_id: number;
    platform_name: string;
    status: "ACTIVE" | "INACTIVE";
    total_fee: number;
}

export interface FeeResponse {
    success: boolean;
    message: string;
    data: Fee[];
    metadata?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface FeeDetailResponse {
    success: boolean;
    message: string;
    data: Fee;
}