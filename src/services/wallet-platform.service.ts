// services/wallet-platform.service.ts
import { apiClient } from '@/lib/axios';
import {
    WalletPlatform,
    WalletPlatformResponse,
    WalletPlatformDetailResponse,
    WalletPlatformQueryParams
} from '@/types/wallet-platform';

class WalletService {
    async getWalletPlatforms(params?: WalletPlatformQueryParams): Promise<WalletPlatform[]> {
        const { data } = await apiClient.get<WalletPlatformResponse>(
            '/api/v1/wallet/platform',
            { params }
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch wallet platforms');
    }

    async getWalletPlatformById(walletId: string): Promise<WalletPlatform> {
        const { data } = await apiClient.get<WalletPlatformDetailResponse>(
            `/api/v1/wallet/platform/${walletId}`
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch wallet platform details');
    }
}

export const walletService = new WalletService();