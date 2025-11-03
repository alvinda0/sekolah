// services/fee.service.ts
import { apiClient } from '@/lib/axios';
import { Fee, FeeResponse, FeeDetailResponse } from '@/types/fee';

export interface FeeQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    platform_id?: number;
    status?: string;
}

class FeeService {
    async getFees(params?: FeeQueryParams): Promise<Fee[]> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.platform_id) queryParams.append('platform_id', params.platform_id.toString());
        if (params?.status) queryParams.append('status', params.status);

        const queryString = queryParams.toString();
        const url = queryString ? `/api/v1/fees?${queryString}` : '/api/v1/fees';

        const { data } = await apiClient.get<FeeResponse>(url);

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch fees');
    }

    async getFeeById(agentId: string): Promise<Fee> {
        const { data } = await apiClient.get<FeeDetailResponse>(
            `/api/v1/fees/${agentId}`
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch fee details');
    }
}

export const feeService = new FeeService();