// types/role.ts
export interface Role {
    role_id: string;
    role_name: string; // Changed from 'name' to 'role_name'
    priority: number;
    is_internal: boolean;
    is_staff: boolean;
    is_client: boolean;
    created_at?: string; // Make optional if not always present
    updated_at?: string;
    deleted_at?: string | null;
}

export interface RoleResponse {
    success: boolean;
    message: string;
    data: Role[];
    metadata?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}