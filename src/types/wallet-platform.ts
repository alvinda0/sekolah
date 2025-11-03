// types/wallet-platform.ts
export interface WalletPlatform {
    wallet_id: string;
    platform_id: string;
    platform_name: string;
    pending_balance: number;
    available_balance: number;
    created_at: string;
    updated_at: string;
}

export interface WalletPlatformQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    platform_id?: string;
}

export interface WalletPlatformResponse {
    success: boolean;
    message: string;
    data: WalletPlatform[];
    metadata?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface WalletPlatformDetailResponse {
    success: boolean;
    message: string;
    data: WalletPlatform;
}