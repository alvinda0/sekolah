"use client";

import { useState, useEffect, useCallback } from "react";
import { subjectService } from "@/services/subject.service";
import { Subject, CreateSubjectRequest } from "@/types/subject";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ErrorState } from "@/components/ErrorState";
import CustomDataTable from "@/components/CustomDataTable";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import CreateSubjectModal from "@/components/CreateSubjectModal";

const SubjectPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subjectService.getSubjects();
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch subjects";
      setError(errorMessage);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleCreateSubject = async (subjectData: CreateSubjectRequest) => {
    await subjectService.createSubject(subjectData);
    fetchSubjects();
  };

  const subjectColumns = [
    {
      name: "ID",
      selector: (row: Subject) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Kode",
      selector: (row: Subject) => row.code,
      sortable: true,
      width: "120px",
      cell: (row: Subject) => (
        <span className="font-mono font-semibold text-blue-600">{row.code}</span>
      ),
    },
    {
      name: "Nama Mata Pelajaran",
      selector: (row: Subject) => row.name,
      sortable: true,
      cell: (row: Subject) => (
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      name: "Deskripsi",
      selector: (row: Subject) => row.description,
      sortable: false,
    },
    {
      name: "Status",
      selector: (row: Subject) => row.is_active,
      sortable: true,
      cell: (row: Subject) => (
        <span
          className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
            row.is_active
              ? "bg-green-500/20 text-green-700 border border-green-500/40"
              : "bg-red-500/20 text-red-700 border border-red-500/40"
          }`}
        >
          {row.is_active ? "Aktif" : "Tidak Aktif"}
        </span>
      ),
      width: "130px",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat mata pelajaran...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        code={500}
        description={error}
        onAction={() => fetchSubjects()}
        actionLabel="Coba Lagi"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Mata Pelajaran</h1>
          <p className="text-gray-600 mt-1">Kelola semua mata pelajaran dalam sistem</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#007BFF] hover:bg-[#0056b3]"
        >
          <Plus className="w-4 h-4" />
          Tambah Mata Pelajaran
        </Button>
      </div>

      <CustomDataTable
        title="Daftar Mata Pelajaran"
        description="Lihat dan kelola semua mata pelajaran"
        columns={subjectColumns}
        data={subjects}
      />

      <CreateSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSubject}
      />
    </div>
  );
};

export default withRoleProtection(SubjectPage, ["system_admin", "teacher"]);
