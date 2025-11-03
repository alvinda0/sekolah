import { apiClient } from '@/lib/axios';
import { Vendor, VendorResponse } from '@/types/vendor';


class VendorService {
    async getVendors(limit: number = 100): Promise<Vendor[]> {
        const { data } = await apiClient.get<VendorResponse>(
            `/api/v1/vendors?limit=${limit}`
        );

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch vendors');
    }
}

export const vendorService = new VendorService();


