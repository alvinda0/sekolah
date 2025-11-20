import { apiClient } from '@/lib/axios';
import { Subject, CreateSubjectRequest, SubjectResponse } from '@/types/subject';

class SubjectService {
  async getSubjects(): Promise<Subject[]> {
    const { data } = await apiClient.get<SubjectResponse>('/api/admin/subjects');
    
    if (data.status === 200 && Array.isArray(data.data)) {
      return data.data;
    }
    
    throw new Error(data.message || 'Failed to fetch subjects');
  }

  async createSubject(subjectData: CreateSubjectRequest): Promise<Subject> {
    const { data } = await apiClient.post<SubjectResponse>('/api/admin/subjects', subjectData);
    
    if (data.status === 200 && !Array.isArray(data.data)) {
      return data.data;
    }
    
    throw new Error(data.message || 'Failed to create subject');
  }
}

export const subjectService = new SubjectService();
