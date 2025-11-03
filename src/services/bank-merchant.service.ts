// services/bank-merchant.service.ts
import { apiClient } from '@/lib/axios';
import {
    BankMerchant,
    BankMerchantResponse,
    BankMerchantDetailResponse,
    BankMerchantQueryParams,
    CreateBankMerchantPayload,
    CreateBankMerchantResponse,
    UpdateBankMerchantPayload
} from '@/types/bank-merchant';

class BankMerchantService {
    async getBankMerchants(params?: BankMerchantQueryParams): Promise<BankMerchant[]> {
        const { data } = await apiClient.get<BankMerchantResponse>(
            '/api/v1/bank/merchants',
            { params }
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch bank merchants');
    }

    async getBankMerchantById(bankMerchantId: string): Promise<BankMerchant> {
        const { data } = await apiClient.get<BankMerchantDetailResponse>(
            `/api/v1/bank/merchants/${bankMerchantId}`
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch bank merchant details');
    }

    async createBankMerchants(payload: CreateBankMerchantPayload): Promise<BankMerchant[]> {
        const { data } = await apiClient.post<CreateBankMerchantResponse>(
            '/api/v1/bank/merchants',
            payload
        );

        if (data.success && data.data?.bank_merchants) {
            return data.data.bank_merchants;
        }

        throw new Error(data.message || 'Failed to create bank merchants');
    }

    async updateBankMerchant(
        bankMerchantId: string,
        payload: UpdateBankMerchantPayload
    ): Promise<BankMerchant> {
        const { data } = await apiClient.put<BankMerchantDetailResponse>(
            `/api/v1/bank/merchants/${bankMerchantId}`,
            payload
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to update bank merchant');
    }

    async deleteBankMerchant(bankMerchantId: string, pin: string): Promise<void> {
        const { data } = await apiClient.delete(
            `/api/v1/bank/merchants/${bankMerchantId}`,
            {
                data: { pin }
            }
        );

        if (!data.success) {
            throw new Error(data.message || 'Failed to delete bank merchant');
        }
    }
}

export const bankMerchantService = new BankMerchantService();