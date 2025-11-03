// types/bank-merchant.ts
export interface BankMerchant {
    bank_merchant_id: string;
    account_number: string;
    bank_name: string;
    account_name: string;
    bank_code: string;
    status: string;
    merchant_id: string;
    merchant_name: string;
    created_by: string;
    created_by_name: string;
    accepted_by: string;
    accepted_by_name: string;
    reason: string | null;
    created_at: string;
    updated_at: string;
}

export interface BankMerchantResponse {
    success: boolean;
    message: string;
    data: BankMerchant[];
    metadata?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface BankMerchantDetailResponse {
    success: boolean;
    message: string;
    data: BankMerchant;
}

export interface CreateBankMerchantPayload {
    merchant_id: string[];
    bank_uuid: string;
    account_number: string;
    account_name: string;
    pin: string;
}

export interface UpdateBankMerchantPayload {
    account_number: string;
    account_name: string;
    pin: string;
}

export interface BankMerchantQueryParams {
    search?: string;
    status?: string;
    merchant_id?: string;
    page?: number;
    limit?: number;
}

export interface CreateBankMerchantResponse {
    success: boolean;
    message: string;
    data: {
        bank_merchants: BankMerchant[];
        total_created: number;
    };
}