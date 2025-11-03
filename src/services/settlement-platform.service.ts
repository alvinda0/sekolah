// services/settlement-platform.service.ts
import { apiClient } from '@/lib/axios';
import {
    SettlementPlatform,
    SettlementPlatformResponse,
    SettlementPlatformDetailResponse,
    SettlementPlatformQueryParams
} from '@/types/settlement-platform';

class SettlementPlatformService {
    async getSettlementPlatforms(params?: SettlementPlatformQueryParams): Promise<SettlementPlatform[]> {
        const { data } = await apiClient.get<SettlementPlatformResponse>(
            '/api/v1/settlement/platform',
            { params: params || { page: 1, limit: 10 } }
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch settlement platforms');
    }

    async getSettlementPlatformById(settlementId: string): Promise<SettlementPlatform> {
        const { data } = await apiClient.get<SettlementPlatformDetailResponse>(
            `/api/v1/settlement/platform/${settlementId}`
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch settlement platform details');
    }
}

export const settlementPlatformService = new SettlementPlatformService();