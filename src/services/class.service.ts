// services/class.service.ts
import { apiClient } from '@/lib/axios';
import { Class, CreateClassRequest, ClassResponse, ClassRosterResponse, ClassRosterStudent } from '@/types/class';

class ClassService {
  async getClasses(): Promise<Class[]> {
    const { data } = await apiClient.get<ClassResponse>('/api/admin/classes');
    
    if (data.status === 200 && Array.isArray(data.data)) {
      return data.data;
    }
    
    throw new Error(data.message || 'Failed to fetch classes');
  }

  async createClass(classData: CreateClassRequest): Promise<Class> {
    const { data } = await apiClient.post<ClassResponse>('/api/admin/classes', classData);
    
    if (data.status === 200 && !Array.isArray(data.data)) {
      return data.data;
    }
    
    throw new Error(data.message || 'Failed to create class');
  }

  async getClassRoster(classId: number): Promise<ClassRosterStudent[]> {
    const { data } = await apiClient.get<ClassRosterResponse>(`/api/admin/classes/${classId}/roster`);
    
    if (data.status === 200 && data.data) {
      return data.data;
    }
    
    throw new Error(data.message || 'Failed to fetch class roster');
  }
}

export const classService = new ClassService();
