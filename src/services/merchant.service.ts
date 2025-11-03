import { apiClient } from "@/lib/axios";
import {
  Merchant,
  MerchantResponse,
  MerchantDetailResponse,
  CreateMerchantPayload,
  CreateMerchantResponse,
  MerchantQueryParams,
} from "@/types/merchant";

class MerchantService {
  async getMerchants(params?: MerchantQueryParams): Promise<Merchant[]> {
    const { data } = await apiClient.get<MerchantResponse>(
      "/api/v1/merchants",
      {
        params: params || { page: 1, limit: 100 },
      }
    );

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Failed to fetch merchants");
  }

  async getMerchantforSelect(): Promise<Merchant[]> {
    const { data } = await apiClient.get<MerchantResponse>(
      "/api/v1/merchants",
      {
        params: { page: 1, limit: 1000 },
      }
    );
    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Failed to fetch merchants for select");
  }

  async getMerchantById(merchantId: string): Promise<Merchant> {
    const { data } = await apiClient.get<MerchantDetailResponse>(
      `/api/v1/merchants/${merchantId}`
    );

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Failed to fetch merchant details");
  }

  async createMerchant(payload: CreateMerchantPayload): Promise<Merchant> {
    const { data } = await apiClient.post<CreateMerchantResponse>(
      "/api/v1/merchants",
      payload
    );

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Failed to create merchant");
  }
}

export const merchantService = new MerchantService();
