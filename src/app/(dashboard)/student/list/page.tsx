"use client";

import React, { useEffect, useState, useCallback } from "react";
import CustomDataTable from "@/components/CustomDataTable";
import { studentService } from "@/services/student.service";
import { Student, StudentQueryParams } from "@/types/student";
import { CheckCircle, XCircle, Calendar, User } from "lucide-react";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ErrorState } from "@/components/ErrorState";

const StudentListPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async (filters?: StudentQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getStudents(filters);
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch students";
      setError(errorMessage);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const getErrorCode = (): 400 | 401 | 403 | 404 | 500 => {
    if (!error) return 500;
    if (
      error.toLowerCase().includes("unauthorized") ||
      error.toLowerCase().includes("authentication")
    )
      return 401;
    if (
      error.toLowerCase().includes("forbidden") ||
      error.toLowerCase().includes("permission")
    )
      return 403;
    if (error.toLowerCase().includes("not found")) return 404;
    if (
      error.toLowerCase().includes("bad request") ||
      error.toLowerCase().includes("invalid")
    )
      return 400;
    return 500;
  };

  const studentColumns = [
    {
      name: "ID",
      selector: (row: Student) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Username",
      selector: (row: Student) => row.username,
      sortable: true,
      cell: (row: Student) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{row.username}</span>
        </div>
      ),
    },
    {
      name: "Email",
      selector: (row: Student) => row.email,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row: Student) => row.role,
      sortable: true,
      cell: (row: Student) => (
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border bg-blue-500/20 text-blue-700 border-blue-500/40">
          {row.role.toUpperCase()}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: Student) => row.is_active,
      sortable: true,
      cell: (row: Student) => (
        <div className="flex items-center gap-2">
          {row.is_active ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold text-green-600">Active</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-red-600">Inactive</span>
            </>
          )}
        </div>
      ),
    },
    {
      name: "Created At",
      selector: (row: Student) => row.created_at,
      sortable: true,
      cell: (row: Student) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {new Date(row.created_at).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      ),
    },
    {
      name: "Updated At",
      selector: (row: Student) => row.updated_at,
      sortable: true,
      cell: (row: Student) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {new Date(row.updated_at).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        code={getErrorCode()}
        description={error}
        onAction={() => fetchStudents()}
        actionLabel="Retry"
      />
    );
  }

  return (
    <div className="space-y-6">
      <CustomDataTable
        title="Student List"
        description="Manage and view all students in the system"
        columns={studentColumns}
        data={students}
      />
    </div>
  );
};

export default withRoleProtection(StudentListPage, ["admin", "system_admin", "teacher"]);
