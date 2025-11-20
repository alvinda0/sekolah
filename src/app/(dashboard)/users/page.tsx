"use client";

import { useEffect, useState, useCallback } from "react";
import CustomDataTable from "@/components/CustomDataTable";
import { userService } from "@/services/user.service";
import { User, CreateUserPayload, UpdateUserPayload } from "@/types/user";
import { CheckCircle, XCircle, Calendar, User as UserIcon, Plus, Trash2, Edit } from "lucide-react";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import CreateUserModal from "@/components/CreateUserModal";
import EditUserModal from "@/components/EditUserModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (userData: CreateUserPayload) => {
    await userService.createUser(userData);
    fetchUsers();
  };

  const handleEditUser = async (userData: UpdateUserPayload) => {
    if (!selectedUser) return;
    await userService.updateUser(selectedUser.id, userData);
    setSelectedUser(null);
    fetchUsers();
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    try {
      setIsDeleting(true);
      await userService.deleteUser(deleteUserId);
      setDeleteUserId(null);
      fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete user";
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleColor = (role: string): string => {
    const colors: { [key: string]: string } = {
      system_admin: "bg-red-500/20 text-red-700 border-red-500/40",
      teacher: "bg-blue-500/20 text-blue-700 border-blue-500/40",
      student: "bg-green-500/20 text-green-700 border-green-500/40",
    };
    return colors[role] || "bg-gray-500/20 text-gray-700 border-gray-500/40";
  };

  const getRoleLabel = (role: string): string => {
    const labels: { [key: string]: string } = {
      system_admin: "System Admin",
      teacher: "Teacher",
      student: "Student",
    };
    return labels[role] || role;
  };

  const userColumns = [
    {
      name: "ID",
      selector: (row: User) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Username",
      selector: (row: User) => row.username,
      sortable: true,
      cell: (row: User) => (
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{row.username}</span>
        </div>
      ),
    },
    {
      name: "Email",
      selector: (row: User) => row.email,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row: User) => row.role,
      sortable: true,
      cell: (row: User) => (
        <span
          className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border ${getRoleColor(
            row.role
          )}`}
        >
          {getRoleLabel(row.role)}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: User) => row.is_active,
      sortable: true,
      cell: (row: User) => (
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
      width: "130px",
    },
    {
      name: "Created At",
      selector: (row: User) => row.created_at,
      sortable: true,
      cell: (row: User) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {new Date(row.created_at).toLocaleDateString("id-ID")}
          </span>
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row: User) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedUser(row);
              setIsEditModalOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteUserId(row.id)}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      ),
      width: "200px",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        code={500}
        description={error}
        onAction={() => fetchUsers()}
        actionLabel="Retry"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage and view all system users</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#007BFF] hover:bg-[#0056b3]"
        >
          <Plus className="w-4 h-4" />
          Create User
        </Button>
      </div>

      <CustomDataTable
        title="User List"
        description="View all registered users"
        columns={userColumns}
        data={users}
      />

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleEditUser}
        user={selectedUser}
      />

      <AlertDialog open={deleteUserId !== null} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default withRoleProtection(UserListPage, ["system_admin"]);
