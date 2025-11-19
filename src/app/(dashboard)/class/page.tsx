"use client";

import { useState, useEffect, useCallback } from "react";
import { classService } from "@/services/class.service";
import { Class, CreateClassRequest } from "@/types/class";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ErrorState } from "@/components/ErrorState";
import CustomDataTable from "@/components/CustomDataTable";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import CreateClassModal from "@/components/CreateClassModal";

const ClassPage = () => {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classService.getClasses();
      setClasses(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch classes";
      setError(errorMessage);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleCreateClass = async (classData: CreateClassRequest) => {
    try {
      await classService.createClass(classData);
      setIsModalOpen(false);
      fetchClasses();
    } catch (err) {
      throw err;
    }
  };

  const classColumns = [
    {
      name: "ID",
      selector: (row: Class) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Class Name",
      selector: (row: Class) => row.name,
      sortable: true,
      cell: (row: Class) => (
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      name: "Grade",
      selector: (row: Class) => row.grade,
      sortable: true,
      width: "100px",
    },
    {
      name: "Stream",
      selector: (row: Class) => row.stream,
      sortable: true,
      width: "100px",
    },
    {
      name: "Section",
      selector: (row: Class) => row.section,
      sortable: true,
      width: "100px",
    },
    {
      name: "Description",
      selector: (row: Class) => row.description,
      sortable: false,
    },
    {
      name: "Status",
      selector: (row: Class) => row.is_active,
      sortable: true,
      cell: (row: Class) => (
        <span
          className={`px-3 py-1.5 rounded-xl text-xs font-bold ${row.is_active
            ? "bg-green-500/20 text-green-700 border border-green-500/40"
            : "bg-red-500/20 text-red-700 border border-red-500/40"
            }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row: Class) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/class/${row.id}/roster`)}
          className="flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          View Roster
        </Button>
      ),
      width: "150px",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        code={500}
        description={error}
        onAction={() => fetchClasses()}
        actionLabel="Retry"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
          <p className="text-gray-600 mt-1">Manage all classes in the system</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#007BFF] hover:bg-[#0056b3]"
        >
          <Plus className="w-4 h-4" />
          Create Class
        </Button>
      </div>

      <CustomDataTable
        title="Class List"
        description="View and manage all classes"
        columns={classColumns}
        data={classes}
      />

      <CreateClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateClass}
      />
    </div>
  );
};

export default withRoleProtection(ClassPage, ["system_admin"]);
