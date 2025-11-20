"use client";

import { useState } from "react";
import { CreateSubjectRequest } from "@/types/subject";
import { Modal } from "./Modal";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubjectRequest) => Promise<void>;
}

const CreateSubjectModal = ({ isOpen, onClose, onSubmit }: CreateSubjectModalProps) => {
  const [formData, setFormData] = useState<CreateSubjectRequest>({
    name: "",
    code: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      setFormData({
        name: "",
        code: "",
        description: "",
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat mata pelajaran");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        code: "",
        description: "",
      });
      setError(null);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Tambah Mata Pelajaran">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="code">Kode Mata Pelajaran</Label>
          <Input
            id="code"
            type="text"
            placeholder="Contoh: MTK, BIND, BING"
            value={formData.code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nama Mata Pelajaran</Label>
          <Input
            id="name"
            type="text"
            placeholder="Contoh: Matematika"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            placeholder="Deskripsi mata pelajaran"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
            required
            disabled={loading}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#007BFF] hover:bg-[#0056b3]"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSubjectModal;
