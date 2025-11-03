// types/disbursement-platform.ts
export interface DisbursementPlatform {
    disbursement_id: string;
    platform_id: string;
    platform_name: string;
    amount: number;
    bank_name: string;
    bank_code: string;
    account_name: string;
    account_number: string;
    status: string;
    type: string;
    admin_cost: number;
    total_disbursements: number;
    created_at: string;
    updated_at: string;
}

export interface DisbursementPlatformResponse {
    success: boolean;
    message: string;
    data: DisbursementPlatform[];
    metadata?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface SingleDisbursementPlatformResponse {
    success: boolean;
    message: string;
    data: DisbursementPlatform;
}

export interface CreateDisbursementPlatformRequest {
    platform_id: string;
    amount: number;
    bank_platform_id: string;  // Ubah dari bank_name, bank_code, etc menjadi bank_platform_id saja
    type: string;
    pin?: string;
}

export interface CreateDisbursementPlatformResponse {
    success: boolean;
    message: string;
    data: DisbursementPlatform;
}