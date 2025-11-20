export interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSubjectRequest {
  name: string;
  code: string;
  description: string;
}

export interface SubjectResponse {
  status: number;
  message: string;
  data: Subject | Subject[];
}
