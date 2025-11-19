// services/student.service.ts
import { apiClient } from '@/lib/axios';
import { Student, StudentResponse, StudentQueryParams } from '@/types/student';

class StudentService {
    async getStudents(params?: StudentQueryParams): Promise<Student[]> {
        const { data } = await apiClient.get<StudentResponse>('/api/admin/users', { params });
        
        if (data.status === 200 && data.data) {
            // Filter hanya student
            return data.data.filter(user => user.role === 'student');
        }

        throw new Error(data.message || 'Failed to fetch students');
    }
}

export const studentService = new StudentService();
