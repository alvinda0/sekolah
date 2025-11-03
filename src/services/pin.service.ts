// services/pin.service.ts
import { apiClient } from '@/lib/axios'
import { CreatePinPayload, DeletePinPayload, PinActionResponse, PinCheckResponse, UpdatePinPayload } from '@/types/pin'

class PinService {
    async checkPinStatus(): Promise<boolean> {
        try {
            const { data } = await apiClient.get<PinCheckResponse>('/api/v1/pin/check')
            return data.data.has_pin
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error(error.message || 'Failed to check PIN status')
        }
    }

    async createPin(payload: CreatePinPayload): Promise<void> {
        try {
            const { data } = await apiClient.post<PinActionResponse>('/api/v1/pin', payload)

            if (!data.success) {
                throw new Error(data.message || 'Failed to create PIN')
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error(error.message || 'Failed to create PIN')
        }
    }

    async updatePin(payload: UpdatePinPayload): Promise<void> {
        try {
            const { data } = await apiClient.put<PinActionResponse>('/api/v1/pin', payload)

            if (!data.success) {
                throw new Error(data.message || 'Failed to update PIN')
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error(error.message || 'Failed to update PIN')
        }
    }

    async deletePin(payload: DeletePinPayload): Promise<void> {
        try {
            const { data } = await apiClient.delete<PinActionResponse>('/api/v1/pin', {
                data: payload
            })

            if (!data.success) {
                throw new Error(data.message || 'Failed to delete PIN')
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error(error.message || 'Failed to delete PIN')
        }
    }
}

export const pinService = new PinService()