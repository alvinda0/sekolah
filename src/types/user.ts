// types/user.ts
export interface User {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  role_id: string;
  is_verified: boolean;
  is_internal: boolean;
  is_2fa: boolean;
  created_at: string;
  updated_at: string;
  partner_id?: string;
  platform_id?: string;
  agent_id?: string;
  pin?: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  email?: string;
  phone?: string;
  search?: string;
  role?: string;
  platform_id?: string;
  agent_id?: string;
  is_verified?: boolean;
  is_internal?: boolean;
}

export interface UserResponse {
  success: boolean;
  message?: string;
  data: User | User[];
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: string;

}