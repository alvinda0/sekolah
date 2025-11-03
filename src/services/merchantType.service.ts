// services/merchantType.service.ts
import { apiClient } from "@/lib/axios";
import {
    MerchantType,
    MerchantTypeResponse,
    MerchantTypeQueryParams,
} from "@/types/merchantType";

class MerchantTypeService {
    async getMerchantTypes(params?: MerchantTypeQueryParams): Promise<MerchantType[]> {
        const { data } = await apiClient.get<MerchantTypeResponse>(
            "/api/v1/merchant/types",
            {
                params: params || { page: 1, limit: 100 },
            }
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || "Failed to fetch merchant types");
    }
}

export const merchantTypeService = new MerchantTypeService();