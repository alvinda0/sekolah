// types/transaction.ts
export interface Transaction {
    transaction_uuid: string;
    order_id: string;
    created_at: string;
    updated_at: string;
    expired_at: string | null;
    paid_at: string | null;
    username: string;
    reference_number: string | null;
    amount: number;
    final_amount: number;
    currency: string;
    method: string;
    status: string;
    process_status: string | null;
    creator_name: string;
    description: string | null;
}

// types/transaction.ts
export interface TransactionQueryParams {
    page?: number;
    limit?: number;
    transaction_uuid?: string;
    order_id?: string;
    reference_number?: string;
    username?: string;
    status?: string;
    search?: string;
    method?: string;
    start_date?: string;
    end_date?: string;
}

export interface TransactionResponse {
    success: boolean;
    message: string;
    data: Transaction[];
    metadata?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export interface TransactionDetailResponse {
    success: boolean;
    message: string;
    data: Transaction;
}