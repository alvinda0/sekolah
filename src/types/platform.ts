// types/platform.ts
export interface Platform {
    platform_id: string;
    partner_id: number;
    partner_name: string;
    fee: number;
    name: string;
    referral: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface PlatformResponse {
    success: boolean;
    message: string;
    data: Platform[];
    metadata?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface SinglePlatformResponse {
    success: boolean;
    message: string;
    data: Platform;
}