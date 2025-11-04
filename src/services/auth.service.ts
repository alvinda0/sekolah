// services/auth.service.ts
import { apiClient } from '@/lib/axios'
import {
  LoginCredentials,
  LoginResponse,
  User,
  UserResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse
} from '@/types/auth'

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const { data } = await apiClient.post<LoginResponse>(
        '/api/auth/login',
        credentials
      )

      if (data.status === 200 && data.data.token) {
        // Save token to localStorage
        localStorage.setItem('token', data.data.token)
        return data
      }

      throw new Error(data.message || 'Login failed')
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error(error.message || 'Network error occurred')
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const { data } = await apiClient.get<UserResponse>('/api/auth/profile')

      if (data.status === 200 && data.data) {
        return data.data
      }

      throw new Error(data.message || 'Failed to fetch user')
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw error
      }

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error(error.message || 'Failed to fetch user data')
    }
  }
  async forgotPassword(payload: ForgotPasswordPayload): Promise<string> {
    const { data } = await apiClient.post<ForgotPasswordResponse>(
      '/api/v1/auth/forget-password',
      payload
    )

    if (data.status === 200) {
      return data.message
    }

    throw new Error(data.message || 'Failed to send reset email')
  }

  async resetPassword(payload: ResetPasswordPayload): Promise<string> {
    const { data } = await apiClient.post<ResetPasswordResponse>(
      '/api/v1/auth/reset-password',
      payload
    )

    if (data.status === 200) {
      return data.message
    }

    throw new Error(data.message || 'Failed to reset password')
  }

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    try {
      const { data } = await apiClient.post<ChangePasswordResponse>(
        '/api/v1/auth/change-password',
        payload
      )

      if (data.status !== 200) {
        throw new Error(data.message || 'Failed to change password')
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error(error.message || 'Failed to change password')
    }
  }

  logout(): void {
    localStorage.removeItem('token')
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()