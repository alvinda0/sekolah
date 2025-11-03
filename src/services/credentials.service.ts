// services/credentials.service.ts
import { apiClient } from '@/lib/axios';
import {
    AgentCredentialsResponse,
    MerchantCredentialsResponse
} from '@/types/credentials';

class CredentialsService {
    async getAgentCredentials(pin: string): Promise<AgentCredentialsResponse> {
        const { data } = await apiClient.post<AgentCredentialsResponse>(
            '/api/v1/credentials/agent',
            { pin }
        );

        if (data.success) {
            return data;
        }

        throw new Error(data.message || 'Failed to fetch agent credentials');
    }

    async getMerchantCredentials(pin: string): Promise<MerchantCredentialsResponse> {
        const { data } = await apiClient.post<MerchantCredentialsResponse>(
            '/api/v1/credentials/merchant',
            { pin }
        );

        if (data.success) {
            return data;
        }

        throw new Error(data.message || 'Failed to fetch merchant credentials');
    }
}

export const credentialsService = new CredentialsService();