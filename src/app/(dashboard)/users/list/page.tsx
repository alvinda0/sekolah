"use client";

import React, { useEffect, useState, useCallback } from "react";
import CustomDataTable from "@/components/CustomDataTable";
import { userService } from "@/services/user.service";
import { User, UserQueryParams } from "@/types/user";
import { CheckCircle, XCircle, Calendar } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { UserFilter } from "@/components/user/UserFilter";
import { ErrorState } from "@/components/ErrorState";

const UserListPage = () => {
  usePageTitle("User List");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (filters: UserQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers(filters);
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

  // Initial fetch
  useEffect(() => {
    fetchUsers({ page: 1, limit: 100 });
  }, [fetchUsers]);

  const handleApplyFilters = (filters: UserQueryParams) => {
    fetchUsers(filters);
  };

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

  // ✅ Mapping berdasarkan UUID role_id
  const getRoleName = (roleId: string): string => {
    const roles: { [key: string]: string } = {
      "d871483a-b57b-4a4c-84ea-1a21bd66df42": "Partner Owner",
      "efc07a01-1d54-4843-97ec-8365455fde8d": "Platform Owner",
      "17f07374-3cba-47df-bce1-080fed5c0680": "Platform Staff",
      "6452b2bc-066d-4e52-907e-83fc7d61b84e": "Agent Owner",
      "e17908d5-c18e-4c5e-b6c9-b83afe2d49f8": "Agent Staff",
    };
    return roles[roleId] || "Unknown Role";
  };

  const getRoleColor = (roleId: string): string => {
    const colors: { [key: string]: string } = {
      "d871483a-b57b-4a4c-84ea-1a21bd66df42":
        "bg-yellow-500/20 text-yellow-700 border-yellow-500/40",
      "efc07a01-1d54-4843-97ec-8365455fde8d": "bg-indigo-500/20 text-indigo-700 border-indigo-500/40",
      "17f07374-3cba-47df-bce1-080fed5c0680": "bg-cyan-500/20 text-cyan-700 border-cyan-500/40",
      "6452b2bc-066d-4e52-907e-83fc7d61b84e": "bg-purple-500/20 text-purple-700 border-purple-500/40",
      "e17908d5-c18e-4c5e-b6c9-b83afe2d49f8": "bg-pink-500/20 text-pink-700 border-pink-500/40",
    };
    return colors[roleId] || "bg-gray-500/20 text-gray-700 border-gray-500/40";
  };

  const userColumns = [
    {
      name: "Name",
      selector: (row: User) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: User) => row.email,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row: User) => row.phone || "-",
      sortable: true,
    },
    {
      name: "Role",
      selector: (row: User) => row.role_id,
      sortable: true,
      cell: (row: User) => (
        <span
          className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border ${getRoleColor(
            row.role_id
          )}`}
        >
          {getRoleName(row.role_id)}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: User) => row.is_verified,
      sortable: true,
      cell: (row: User) => (
        <div className="flex items-center gap-2">
          {row.is_verified ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold text-green-600">Verified</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-red-600">Unverified</span>
            </>
          )}
        </div>
      ),
    },
    {
      name: "Internal",
      selector: (row: User) => row.is_internal,
      sortable: true,
      cell: (row: User) => (
        <span
          className={`px-2 py-1 rounded-lg text-xs font-bold ${
            row.is_internal
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {row.is_internal ? "Yes" : "No"}
        </span>
      ),
    },
    {
      name: "2FA",
      selector: (row: User) => row.is_2fa,
      sortable: true,
      cell: (row: User) => (
        <span
          className={`px-2 py-1 rounded-lg text-xs font-bold ${
            row.is_2fa
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {row.is_2fa ? "Enabled" : "Disabled"}
        </span>
      ),
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
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <UserFilter onApplyFilters={handleApplyFilters} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <UserFilter onApplyFilters={handleApplyFilters} />
        <ErrorState
          code={getErrorCode()}
          description={error}
          onAction={() => fetchUsers({ page: 1, limit: 100 })}
          actionLabel="Retry"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserFilter onApplyFilters={handleApplyFilters} />
      <CustomDataTable
        title="User Management"
        description="Manage and view all system users"
        columns={userColumns}
        data={users}
      />
    </div>
  );
};

export default withRoleProtection(UserListPage, [
  "PartnerOwner",
  "PlatformOwner",
  "AgentOwner",
]);
