// types/settlement.ts
export interface Settlement {
    settlement_id: string;
    merchant_id: string;
    merchant_name: string;
    amount: number;
    reference: string;
    settle_by: string;
    settle_by_name: string;
    created_at: string;
    updated_at: string;
}

export interface SettlementResponse {
    success: boolean;
    message: string;
    data: Settlement[];
    metadata?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface SettlementDetailResponse {
    success: boolean;
    message: string;
    data: Settlement;
}

export interface SettlementQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    merchant_id?: string;
    settle_by?: string;
    start_date?: string;
    end_date?: string;
}