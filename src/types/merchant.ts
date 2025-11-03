// types/merchant.ts (UPDATED)
export interface Merchant {
    merchant_id: string;
    vendor_id: string;
    vendor_name: string;
    agent_id: string;
    agent_name: string;
    name: string;
    status: string;
    merchant_type_id: string; // Changed from number to string (UUID)
    environment: string;
    created_at: string;
    updated_at: string;
}

export interface MerchantResponse {
    success: boolean;
    message: string;
    data: Merchant[];
    metadata: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface MerchantDetailResponse {
    success: boolean;
    message: string;
    data: Merchant;
}

export interface CreateMerchantPayload {
    vendor_id: string;
    agent_id: string; // Added agent_id field (required)
    name: string;
    merchant_type_id: string; // Changed from number to string (UUID)
}

export interface CreateMerchantResponse {
    success: boolean;
    message: string;
    data: Merchant;
}

export interface BankMerchantQueryParams {
    search?: string;
    status?: string;
    merchant_id?: number;
    page?: number;
    limit?: number;
}

export interface MerchantQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    vendor_id?: string;
    agent_id?: string;
    status?: string;
    environment?: string;
}