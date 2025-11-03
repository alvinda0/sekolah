// services/wallet-merchant.service.ts
import { apiClient } from '@/lib/axios';
import {
    WalletMerchant,
    WalletMerchantResponse,
    WalletMerchantDetailResponse,
    WalletMerchantQueryParams
} from '@/types/wallet-merchant';

class WalletMerchantService {
    async getWalletMerchants(params?: WalletMerchantQueryParams): Promise<WalletMerchant[]> {
        const { data } = await apiClient.get<WalletMerchantResponse>(
            '/api/v1/wallet/merchant',
            { params: params || { page: 1, limit: 100 } }
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch wallet merchants');
    }

    async getWalletMerchantById(walletId: string): Promise<WalletMerchant> {
        const { data } = await apiClient.get<WalletMerchantDetailResponse>(
            `/api/v1/wallet/merchant/${walletId}`
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch wallet merchant details');
    }
}

export const walletMerchantService = new WalletMerchantService();