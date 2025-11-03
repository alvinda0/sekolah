export interface Bank {
    bank_id: string;
    name: string;
    code: string;
    type: 'bank' | 'wallet';
    created_at: string;
    updated_at: string;
}

export interface BankResponse {
    success: boolean;
    message: string;
    data: Bank[];
    metadata?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}