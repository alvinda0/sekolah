// services/role.service.ts
import { apiClient } from '@/lib/axios';
import { Role, RoleResponse } from '@/types/role';

class RoleService {
    async getRoles(): Promise<Role[]> {
        const { data } = await apiClient.get<RoleResponse>('/api/v1/roles');

        if (data.success && data.data) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch roles');
    }
}

export const roleService = new RoleService();