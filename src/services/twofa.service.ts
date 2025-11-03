// services/twofa.service.ts
import { apiClient } from '@/lib/axios'
import {
    TwoFASetupPayload,
    TwoFASetupResponse,
    TwoFAVerifyPayload,
    TwoFAVerifyResponse,
    TwoFADisableResponse,
    TwoFASetupData,
    TwoFAData,
    TwoFAStatusResponse,
    TwoFAStatusData
} from '@/types/twofa'

class TwoFAService {
    async getStatus(): Promise<TwoFAStatusData> {
        try {
            const { data } = await apiClient.get<TwoFAStatusResponse>(
                '/api/v1/2fa/status'
            )

            if (data.success && data.data) {
                return data.data
            }

            throw new Error(data.message || 'Failed to get 2FA status')
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error(error.message || 'Failed to get 2FA status')
        }
    }

    async setup(payload: TwoFASetupPayload): Promise<TwoFASetupData> {
        try {
            const { data } = await apiClient.post<TwoFASetupResponse>(
                '/api/v1/2fa/setup',
                payload
            )

            if (data.success && data.data) {
                return data.data
            }

            throw new Error(data.message || 'Failed to setup 2FA')
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error(error.message || 'Failed to setup 2FA')
        }
    }

    async verify(payload: TwoFAVerifyPayload): Promise<TwoFAData> {
        try {
            const { data } = await apiClient.post<TwoFAVerifyResponse>(
                '/api/v1/2fa/verify',
                payload
            )

            if (data.success && data.data.twofa) {
                return data.data.twofa
            }

            throw new Error(data.message || 'Failed to verify 2FA')
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error(error.message || 'Failed to verify 2FA token')
        }
    }

    async disable(token: string): Promise<boolean> {
        try {
            const { data } = await apiClient.post<TwoFADisableResponse>(
                '/api/v1/2fa/disable',
                {
                    method: 'totp',
                    token: token
                }
            )

            if (data.success && data.data.disabled) {
                return data.data.disabled
            }

            throw new Error(data.message || 'Failed to disable 2FA')
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error(error.message || 'Failed to disable 2FA')
        }
    }
}

export const twoFAService = new TwoFAService()