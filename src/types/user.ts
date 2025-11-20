// types/user.ts
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  email?: string;
  search?: string;
  role?: string;
  is_active?: boolean;
}

export interface UserResponse {
  status: number;
  message: string;
  data: User | User[];
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  role: string;
  full_name: string;
  employee_id: string;
}

export interface UpdateUserPayload {
  username: string;
  email: string;
  password?: string;
  role: string;
  full_name: string;
  employee_id: string;
}