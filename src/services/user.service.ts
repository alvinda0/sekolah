// services/user.service.ts
import { apiClient } from '@/lib/axios';
import { User, UserResponse, UserQueryParams, CreateUserPayload } from '@/types/user';

class UserService {
    async getUsers(params?: UserQueryParams): Promise<User[]> {
        const { data } = await apiClient.get<UserResponse>('/api/v1/users', { params });
        
        if (data.success && data.data) {
            return Array.isArray(data.data) ? data.data : [data.data];
        }

        throw new Error(data.message || 'Failed to fetch users');
    }

    async createUser(payload: CreateUserPayload): Promise<User> {
        const { data } = await apiClient.post<UserResponse>('/api/v1/users', payload);

        if (data.success && data.data) {
            return Array.isArray(data.data) ? data.data[0] : data.data;
        }

        throw new Error(data.message || 'Failed to create user');
    }
}

export const userService = new UserService();