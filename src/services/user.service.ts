// services/user.service.ts
import { apiClient } from '@/lib/axios';
import { User, UserResponse, UserQueryParams, CreateUserPayload, UpdateUserPayload } from '@/types/user';

class UserService {
    async getUsers(params?: UserQueryParams): Promise<User[]> {
        const { data } = await apiClient.get<UserResponse>('/api/admin/users', { params });
        
        if (data.status === 200 && Array.isArray(data.data)) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to fetch users');
    }

    async createUser(payload: CreateUserPayload): Promise<User> {
        const { data } = await apiClient.post<UserResponse>('/api/admin/users', payload);

        if ((data.status === 200 || data.status === 201) && !Array.isArray(data.data)) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to create user');
    }

    async deleteUser(userId: number): Promise<void> {
        const { data } = await apiClient.delete(`/api/admin/users/${userId}`);

        if (data.status !== 200) {
            throw new Error(data.message || 'Failed to delete user');
        }
    }

    async updateUser(userId: number, payload: UpdateUserPayload): Promise<User> {
        const { data } = await apiClient.put<UserResponse>(`/api/admin/users/${userId}`, payload);

        if (data.status === 200 && !Array.isArray(data.data)) {
            return data.data;
        }

        throw new Error(data.message || 'Failed to update user');
    }
}

export const userService = new UserService();