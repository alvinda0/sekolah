// types/bank-platform.ts
export interface BankPlatform {
    bank_platform_id: string;
    account_number: string;
    bank_name: string;
    account_name: string;
    bank_code: string;
    status: "Pending" | "Active" | "Rejected";
    platform_id: string;
    platform_name: string;
    created_by: string;
    created_by_name: string;
    accepted_by: string;
    accepted_by_name: string;
    reason: string | null;
    created_at: string;
    updated_at: string;
}

export interface BankPlatformResponse {
    success: boolean;
    message: string;
    data: BankPlatform[];
    metadata?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface BankPlatformDetailResponse {
    success: boolean;
    message: string;
    data: BankPlatform;
}

export interface CreateBankPlatformRequest {
    bank_uuid: string;
    account_number: string;
    account_name: string;
    pin: string;
}

export interface UpdateBankPlatformRequest {
    bank_uuid: string;
    account_number: string;
    account_name: string;
    pin: string;
}

export interface BankPlatformQueryParams {
    search?: string;
    status?: string;
    platform_id?: number;
}

export interface BankPlatformSelect {
    value: string;
    label: string;
    bank_name: string;
    bank_code: string;
    account_name: string;
    account_number: string;
}