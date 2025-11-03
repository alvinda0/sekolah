// services/bank-platform.service.ts
import { apiClient } from "@/lib/axios";
import {
  BankPlatform,
  BankPlatformResponse,
  BankPlatformDetailResponse,
  UpdateBankPlatformRequest,
  CreateBankPlatformRequest,
  BankPlatformSelect,
  BankPlatformQueryParams,
} from "@/types/bank-platform";

class BankPlatformService {
  async getBankPlatforms(
    params?: BankPlatformQueryParams
  ): Promise<BankPlatform[]> {
    const queryParams = new URLSearchParams();

    if (params?.search) {
      queryParams.append("search", params.search);
    }
    if (params?.status) {
      queryParams.append("status", params.status);
    }
    if (params?.platform_id) {
      queryParams.append("platform_id", params.platform_id.toString());
    }

    const queryString = queryParams.toString();
    const { data } = await apiClient.get<BankPlatformResponse>(
      `/api/v1/bank/platforms?${queryString}`
    );

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Failed to fetch bank platforms");
  }

  async getBankPlatformsForSelect(
    params?: BankPlatformQueryParams
  ): Promise<BankPlatformSelect[]> {
    const bankPlatforms = await this.getBankPlatforms(params);

    return bankPlatforms.map((bank) => ({
      value: bank.bank_platform_id,
      label: `${bank.bank_name} - ${bank.account_number}`,
      bank_name: bank.bank_name,
      bank_code: bank.bank_code,
      account_name: bank.account_name,
      account_number: bank.account_number,
    }));
  }

  async getBankPlatformById(bankPlatformId: string): Promise<BankPlatform> {
    const { data } = await apiClient.get<BankPlatformDetailResponse>(
      `/api/v1/bank/platforms/${bankPlatformId}`
    );

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Failed to fetch bank platform details");
  }

  async deleteBankPlatform(bankPlatformId: string, pin: string): Promise<void> {
    const { data } = await apiClient.delete(
      `/api/v1/bank/platforms/${bankPlatformId}`,
      {
        data: { pin },
      }
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to delete bank platform");
    }
  }

  async createBankPlatform(
    payload: CreateBankPlatformRequest
  ): Promise<BankPlatform> {
    const { data } = await apiClient.post<BankPlatformDetailResponse>(
      "/api/v1/bank/platforms",
      payload
    );

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Failed to create bank platform");
  }

  async updateBankPlatform(
    bankPlatformId: string,
    payload: UpdateBankPlatformRequest
  ): Promise<BankPlatform> {
    const { data } = await apiClient.put<BankPlatformDetailResponse>(
      `/api/v1/bank/platforms/${bankPlatformId}`,
      payload
    );

    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.message || "Failed to update bank platform");
  }
}

export const bankPlatformService = new BankPlatformService();
