// services/platform.service.ts
import { apiClient } from '@/lib/axios';
import { Platform, PlatformResponse, SinglePlatformResponse } from '@/types/platform';

class PlatformService {
    async getPlatforms(): Promise<Platform[]> {
        const { data } = await apiClient.get<PlatformResponse>('/api/v1/platforms');

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch platforms');
    }

    async getPlatformsForSelect(): Promise<Platform[]> {
        const { data } = await apiClient.get<PlatformResponse>('/api/v1/platforms', {
            params: { limit: 256 }
        });

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch platforms');
    }

    async getPlatformById(platformId: string): Promise<Platform> {
        const { data } = await apiClient.get<SinglePlatformResponse>(
            `/api/v1/platforms/${platformId}`
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch platform');
    }
}

export const platformService = new PlatformService();