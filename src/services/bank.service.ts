import { apiClient } from '@/lib/axios';
import { Bank, BankResponse } from '@/types/bank';

class BankService {
    async getBanks(): Promise<Bank[]> {
        const { data } = await apiClient.get<BankResponse>('/api/v1/banks?limit=100');

        if (data.success && data.data) {
            // Filter hanya bank, hide wallet
            return data.data.filter(bank => bank.type === 'bank');
        }

        throw new Error(data.message || 'Failed to fetch banks');
    }
}

export const bankService = new BankService();