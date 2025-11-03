// services/disbursement-merchant.service.ts
import { apiClient } from "@/lib/axios";
import {
  DisbursementMerchant,
  DisbursementMerchantResponse,
  SingleDisbursementMerchantResponse,
  CreateDisbursementMerchantRequest,
} from "@/types/disbursement-merchant";

class DisbursementMerchantService {
  async getDisbursementMerchants(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
    merchant_id?: string;
  }): Promise<DisbursementMerchant[]> {
    const { data } = await apiClient.get<DisbursementMerchantResponse>(
      "/api/v1/disbursement/merchant",
      { params }
    );

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Failed to fetch disbursement merchants");
  }

  async getDisbursementMerchantById(
    disbursementId: string
  ): Promise<DisbursementMerchant> {
    const { data } = await apiClient.get<SingleDisbursementMerchantResponse>(
      `/api/v1/disbursement/merchant/${disbursementId}`
    );

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Failed to fetch disbursement merchant");
  }

  async createDisbursementMerchant(
    payload: CreateDisbursementMerchantRequest
  ): Promise<DisbursementMerchant> {
    const { data } = await apiClient.post<SingleDisbursementMerchantResponse>(
      "/api/v1/disbursement/merchant",
      payload
    );

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Failed to create disbursement merchant");
  }
}

export const disbursementMerchantService = new DisbursementMerchantService();
