// types/class.ts
export interface Class {
  id: number;
  name: string;
  grade: number;
  stream: string;
  section: string;
  description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ClassRosterStudent {
  id: number;
  student_id: string;
  full_name: string;
  phone: string;
  user: {
    username: string;
    email: string;
  };
}

export interface CreateClassRequest {
  name: string;
  grade: number;
  stream: string;
  section: string;
  description: string;
}

export interface ClassResponse {
  status: number;
  message: string;
  data: Class | Class[];
}

export interface ClassRosterResponse {
  status: number;
  message: string;
  data: ClassRosterStudent[];
}
