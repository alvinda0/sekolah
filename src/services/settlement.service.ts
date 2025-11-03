// services/settlement.service.ts
import { apiClient } from '@/lib/axios';
import {
    Settlement,
    SettlementResponse,
    SettlementDetailResponse,
    SettlementQueryParams
} from '@/types/settlement';

class SettlementService {
    async getSettlements(params?: SettlementQueryParams): Promise<Settlement[]> {
        const { data } = await apiClient.get<SettlementResponse>(
            '/api/v1/settlement/merchant',
            { params: params || { page: 1, limit: 10 } }
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch settlements');
    }

    async getSettlementById(settlementId: string): Promise<Settlement> {
        const { data } = await apiClient.get<SettlementDetailResponse>(
            `/api/v1/settlement/merchant/${settlementId}`
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch settlement details');
    }
}

export const settlementService = new SettlementService();