// services/transaction.service.ts
import { apiClient } from '@/lib/axios';
import {
    Transaction,
    TransactionResponse,
    TransactionDetailResponse,
    TransactionQueryParams
} from '@/types/transaction';

class TransactionService {
    async getTransactions(params?: TransactionQueryParams): Promise<Transaction[]> {
        const { data } = await apiClient.get<TransactionResponse>(
            '/api/v1/transactions',
            { params }
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch transactions');
    }

    async getTransactionById(transactionUuid: string): Promise<Transaction> {
        const { data } = await apiClient.get<TransactionDetailResponse>(
            `/api/v1/transactions/${transactionUuid}`
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch transaction details');
    }
}

export const transactionService = new TransactionService();