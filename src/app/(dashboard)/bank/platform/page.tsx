"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CustomDataTable from "@/components/CustomDataTable";
import { bankPlatformService } from "@/services/bank-platform.service";
import { BankPlatform } from "@/types/bank-platform";
import {
  Eye,
  Calendar,
  Building2,
  User,
  CreditCard,
  Trash2,
  Plus,
  Edit,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import PinInputDialog from "@/components/PinInputDialog";
import { toast } from "sonner";
import { ErrorState } from "@/components/ErrorState";
import {
  BankPlatformFilter,
  BankPlatformQueryParams,
} from "@/components/merchant/BankPlatformFilter";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { Button } from "@/components/ui/button";

const ListBankPlatformPage = () => {
  usePageTitle("Bank Platform List");
  const router = useRouter();
  const [bankPlatforms, setBankPlatforms] = useState<BankPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    code: 400 | 401 | 403 | 404 | 500;
    message: string;
  } | null>(null);

  // Delete Dialog State
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    bankPlatformId: "",
    bankName: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBankPlatforms = useCallback(
    async (filters?: BankPlatformQueryParams) => {
      try {
        setLoading(true);
        setError(null);
        const data = await bankPlatformService.getBankPlatforms(filters);
        setBankPlatforms(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        // Handle different error types
        let errorCode: 400 | 401 | 403 | 404 | 500 = 500;
        let errorMessage = "Failed to fetch bank platforms";

        if (err && typeof err === "object" && "response" in err) {
          const error = err as {
            response?: { status: number; data?: { message?: string } };
          };
          const response = error.response;

          if (response) {
            // HTTP errors from API
            const status = response.status;

            if (status === 400) {
              errorCode = 400;
              errorMessage = response.data?.message || "Invalid request";
            } else if (status === 401) {
              errorCode = 401;
              errorMessage =
                response.data?.message || "Authentication required";
            } else if (status === 403) {
              errorCode = 403;
              errorMessage = response.data?.message || "Access denied";
            } else if (status === 404) {
              errorCode = 404;
              errorMessage = response.data?.message || "Resource not found";
            } else {
              errorCode = 500;
              errorMessage = response.data?.message || "Server error occurred";
            }
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError({ code: errorCode, message: errorMessage });
        setBankPlatforms([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchBankPlatforms();
  }, [fetchBankPlatforms]);

  const handleApplyFilters = (filters: BankPlatformQueryParams) => {
    fetchBankPlatforms(filters);
  };

  const handleViewDetails = (bankPlatformId: string) => {
    router.push(`/bank/platform/detail/${bankPlatformId}`);
  };

  const handleEdit = (bankPlatformId: string) => {
    router.push(`/bank/platform/edit/${bankPlatformId}`);
  };

  const handleCreate = () => {
    router.push("/bank/platform/create");
  };

  const openDeleteDialog = (bankPlatformId: string, bankName: string) => {
    setDeleteDialog({
      isOpen: true,
      bankPlatformId,
      bankName,
    });
  };

  const closeDeleteDialog = () => {
    if (!deleteLoading) {
      setDeleteDialog({
        isOpen: false,
        bankPlatformId: "",
        bankName: "",
      });
    }
  };

  const handleDelete = async (pin: string) => {
    try {
      setDeleteLoading(true);
      await bankPlatformService.deleteBankPlatform(
        deleteDialog.bankPlatformId,
        pin
      );

      toast.success("Bank platform deleted successfully");
      closeDeleteDialog();
      await fetchBankPlatforms();
    } catch (err: unknown) {
      let errorMessage = "Failed to delete bank platform";

      if (err && typeof err === "object" && "response" in err) {
        const error = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        errorMessage =
          error.response?.data?.message || error.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-500/20 text-green-700 border-green-500/40";
      case "Pending":
        return "bg-orange-500/20 text-orange-700 border-orange-500/40";
      case "Revised":
        return "bg-purple-500/20 text-purple-700 border-purple-500/40";
      case "Rejected":
        return "bg-red-500/20 text-red-700 border-red-500/40";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/40";
    }
  };

  const bankPlatformColumns = [
    {
      name: "Created At",
      selector: (row: BankPlatform) => row.created_at,
      sortable: true,
      cell: (row: BankPlatform) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            {new Date(row.created_at).toLocaleDateString("id-ID")}
          </span>
        </div>
      ),
    },
    {
      name: "Bank Name",
      selector: (row: BankPlatform) => row.bank_name,
      sortable: true,
      cell: (row: BankPlatform) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-gray-700">
            {row.bank_name}
          </span>
        </div>
      ),
    },
    {
      name: "Account Name",
      selector: (row: BankPlatform) => row.account_name,
      sortable: true,
      cell: (row: BankPlatform) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-gray-700">
            {row.account_name}
          </span>
        </div>
      ),
    },
    {
      name: "Account Number",
      selector: (row: BankPlatform) => row.account_number,
      sortable: true,
      cell: (row: BankPlatform) => (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-mono text-gray-700">
            {row.account_number}
          </span>
        </div>
      ),
    },
    {
      name: "Platform",
      selector: (row: BankPlatform) => row.platform_name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: BankPlatform) => row.status,
      sortable: true,
      cell: (row: BankPlatform) => (
        <span
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${getStatusColor(
            row.status
          )}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Created By",
      selector: (row: BankPlatform) => row.created_by_name,
      sortable: true,
    },
    {
      name: "Accepted By",
      selector: (row: BankPlatform) => row.accepted_by_name || "-",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: BankPlatform) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleViewDetails(row.bank_platform_id)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 rounded-lg transition-all duration-200 border border-blue-500/30 cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(row.bank_platform_id)}
            className="flex items-center gap-2 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-700 rounded-lg transition-all duration-200 border border-green-500/30 cursor-pointer"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              openDeleteDialog(row.bank_platform_id, row.bank_name)
            }
            className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-700 rounded-lg transition-all duration-200 border border-red-500/30 cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bank platforms...</p>
        </div>
      </div>
    );
  }

  // Error State - Show EmptyState Component
  if (error) {
    return (
      <ErrorState
        code={error.code}
        description={error.message}
        onAction={fetchBankPlatforms}
        actionLabel="Try Again"
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bank Platform Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and view all bank platform accounts
            </p>
          </div>
          <Button
            size="lg"
            onClick={handleCreate}
            className="gap-2 shadow-sm hover:shadow-md bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Bank Platform
          </Button>
        </div>

        {/* Filter Component */}
        <BankPlatformFilter onApplyFilters={handleApplyFilters} />

        <CustomDataTable
          title="Bank Platform List"
          description={`Total ${bankPlatforms.length} bank platform accounts`}
          columns={bankPlatformColumns}
          data={bankPlatforms}
        />
      </div>

      <PinInputDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Bank Platform"
        itemName={deleteDialog.bankName}
        isLoading={deleteLoading}
      />
    </>
  );
};

export default withRoleProtection(ListBankPlatformPage, [
  "PartnerOwner",
  "PlatformOwner",
]);