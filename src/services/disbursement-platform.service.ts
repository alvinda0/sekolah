// services/disbursement-platform.service.ts
import { apiClient } from '@/lib/axios';
import { 
    DisbursementPlatform, 
    DisbursementPlatformResponse, 
    SingleDisbursementPlatformResponse,
    CreateDisbursementPlatformRequest,
    CreateDisbursementPlatformResponse
} from '@/types/disbursement-platform';

class DisbursementPlatformService {
    async getDisbursementPlatforms(params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        type?: string;
        platform_id?: string;
    }): Promise<DisbursementPlatform[]> {
        const { data } = await apiClient.get<DisbursementPlatformResponse>(
            '/api/v1/disbursement/platform',
            { params }
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch disbursement platforms');
    }

    async getDisbursementPlatformById(disbursementId: string): Promise<DisbursementPlatform> {
        const { data } = await apiClient.get<SingleDisbursementPlatformResponse>(
            `/api/v1/disbursement/platform/${disbursementId}`
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch disbursement platform');
    }

    async createDisbursementPlatform(payload: CreateDisbursementPlatformRequest): Promise<DisbursementPlatform> {
        const { data } = await apiClient.post<CreateDisbursementPlatformResponse>(
            '/api/v1/disbursement/platform',
            payload
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to create disbursement platform');
    }
}

export const disbursementPlatformService = new DisbursementPlatformService();