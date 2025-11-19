// types/student.ts
export interface Student {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentResponse {
  status: number;
  message: string;
  data: Student[];
}

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
}
