"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { classService } from "@/services/class.service";
import { ClassRosterStudent } from "@/types/class";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ErrorState } from "@/components/ErrorState";
import CustomDataTable from "@/components/CustomDataTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Phone, Mail } from "lucide-react";

const ClassRosterPage = () => {
  const params = useParams();
  const router = useRouter();
  const classId = Number(params.id);

  const [students, setStudents] = useState<ClassRosterStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoster = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classService.getClassRoster(classId);
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch roster";
      setError(errorMessage);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    if (classId) {
      fetchRoster();
    }
  }, [classId, fetchRoster]);

  const rosterColumns = [
    {
      name: "ID",
      selector: (row: ClassRosterStudent) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Student ID",
      selector: (row: ClassRosterStudent) => row.student_id,
      sortable: true,
      cell: (row: ClassRosterStudent) => (
        <span className="font-mono text-sm">{row.student_id}</span>
      ),
    },
    {
      name: "Full Name",
      selector: (row: ClassRosterStudent) => row.full_name,
      sortable: true,
      cell: (row: ClassRosterStudent) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{row.full_name}</span>
        </div>
      ),
    },
    {
      name: "Phone",
      selector: (row: ClassRosterStudent) => row.phone,
      sortable: true,
      cell: (row: ClassRosterStudent) => (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span>{row.phone}</span>
        </div>
      ),
    },
    {
      name: "Username",
      selector: (row: ClassRosterStudent) => row.user.username,
      sortable: true,
      cell: (row: ClassRosterStudent) => (
        <span className="font-medium">{row.user.username}</span>
      ),
    },
    {
      name: "Email",
      selector: (row: ClassRosterStudent) => row.user.email,
      sortable: true,
      cell: (row: ClassRosterStudent) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span>{row.user.email}</span>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading roster...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        code={500}
        description={error}
        onAction={() => fetchRoster()}
        actionLabel="Retry"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/class")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Classes
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Roster</h1>
          <p className="text-gray-600 mt-1">View all students in this class</p>
        </div>
      </div>

      <CustomDataTable
        title={`Students in Class (${students.length})`}
        description="List of all students enrolled in this class"
        columns={rosterColumns}
        data={students}
      />
    </div>
  );
};

export default withRoleProtection(ClassRosterPage, ["admin", "system_admin"]);
