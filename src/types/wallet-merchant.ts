// types/wallet-merchant.ts
export interface WalletMerchant {
    wallet_id: string;
    merchant_id: string;
    merchant_name: string;
    agent_id: number;
    agent_name: string;
    pending_balance: number;
    available_balance: number;
    created_at: string;
    updated_at: string;
}

export interface WalletMerchantResponse {
    success: boolean;
    message: string;
    data: WalletMerchant[];
    metadata?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface WalletMerchantDetailResponse {
    success: boolean;
    message: string;
    data: WalletMerchant;
}

export interface WalletMerchantQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    merchant_id?: string;
    agent_id?: string;
}
