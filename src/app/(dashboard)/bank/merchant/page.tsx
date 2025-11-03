// app/bank/merchant/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CustomDataTable from "@/components/CustomDataTable";
import { bankMerchantService } from "@/services/bank-merchant.service";
import { BankMerchant, BankMerchantQueryParams } from "@/types/bank-merchant";
import {
  Eye,
  Calendar,
  Building2,
  CreditCard,
  User,
  Trash2,
  Edit2,
  Plus,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import PinInputDialog from "@/components/PinInputDialog";
import { toast } from "sonner";
import { ErrorState } from "@/components/ErrorState";
import { BankMerchantFilter } from "@/components/merchant/BankMerchantFilter";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { usePermission } from "@/components/ProtectedRoles";
import { EditBankMerchantModal } from "@/components/bank/merchant/EditBankMerchantModal";

interface ApiErrorResponse {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const ListBankMerchantPage = () => {
  usePageTitle("Bank Merchant List");
  const router = useRouter();
  const [bankMerchants, setBankMerchants] = useState<BankMerchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    code: 400 | 401 | 403 | 404 | 500;
    message: string;
  } | null>(null);

  // Permission check untuk Edit & Delete
  const canEditDelete = usePermission(["PartnerOwner", "AgentOwner"]);

  // Edit Modal State
  const [editModal, setEditModal] = useState({
    isOpen: false,
    bankMerchantId: "",
  });

  // Delete Dialog State
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    bankMerchantId: "",
    bankName: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBankMerchants = useCallback(
    async (filters?: BankMerchantQueryParams) => {
      try {
        setLoading(true);
        setError(null);
        const data = await bankMerchantService.getBankMerchants(filters);
        setBankMerchants(Array.isArray(data) ? data : []);
      } catch (err) {
        const error = err as ApiErrorResponse;

        let errorCode: 400 | 401 | 403 | 404 | 500 = 500;
        let errorMessage = "Failed to fetch bank merchants";

        if (error.response) {
          const status = error.response.status;

          if (status === 400) {
            errorCode = 400;
            errorMessage = error.response.data?.message || "Invalid request";
          } else if (status === 401) {
            errorCode = 401;
            errorMessage =
              error.response.data?.message || "Authentication required";
          } else if (status === 403) {
            errorCode = 403;
            errorMessage = error.response.data?.message || "Access denied";
          } else if (status === 404) {
            errorCode = 404;
            errorMessage = error.response.data?.message || "Resource not found";
          } else {
            errorCode = 500;
            errorMessage =
              error.response.data?.message || "Server error occurred";
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        setError({ code: errorCode, message: errorMessage });
        setBankMerchants([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchBankMerchants({ page: 1, limit: 100 });
  }, [fetchBankMerchants]);

  const handleApplyFilters = (filters: BankMerchantQueryParams) => {
    fetchBankMerchants(filters);
  };

  const handleViewDetails = (bankMerchantId: string) => {
    router.push(`/bank/merchant/detail/${bankMerchantId}`);
  };

  const openEditModal = (bankMerchantId: string) => {
    setEditModal({
      isOpen: true,
      bankMerchantId,
    });
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      bankMerchantId: "",
    });
  };

  const handleEditSuccess = () => {
    fetchBankMerchants({ page: 1, limit: 100 });
  };

  const openDeleteDialog = (bankMerchantId: string, bankName: string) => {
    setDeleteDialog({
      isOpen: true,
      bankMerchantId,
      bankName,
    });
  };

  const closeDeleteDialog = () => {
    if (!deleteLoading) {
      setDeleteDialog({
        isOpen: false,
        bankMerchantId: "",
        bankName: "",
      });
    }
  };

  const handleDelete = async (pin: string) => {
    try {
      setDeleteLoading(true);
      await bankMerchantService.deleteBankMerchant(
        deleteDialog.bankMerchantId,
        pin
      );

      toast.success("Bank merchant deleted successfully");
      closeDeleteDialog();
      await fetchBankMerchants({ page: 1, limit: 100 });
    } catch (err) {
      const error = err as ApiErrorResponse;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete bank merchant";
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

  const bankMerchantColumns = [
    {
      name: "Created At",
      selector: (row: BankMerchant) => row.created_at,
      sortable: true,
      cell: (row: BankMerchant) => (
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
      selector: (row: BankMerchant) => row.bank_name,
      sortable: true,
      cell: (row: BankMerchant) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-gray-700">
            {row.bank_name}
          </span>
        </div>
      ),
    },
    {
      name: "Account Number",
      selector: (row: BankMerchant) => row.account_number,
      sortable: true,
      cell: (row: BankMerchant) => (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-mono font-semibold text-gray-700">
            {row.account_number}
          </span>
        </div>
      ),
    },
    {
      name: "Account Name",
      selector: (row: BankMerchant) => row.account_name,
      sortable: true,
      cell: (row: BankMerchant) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-gray-700">
            {row.account_name}
          </span>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row: BankMerchant) => row.status,
      sortable: true,
      cell: (row: BankMerchant) => (
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
      name: "Merchant",
      selector: (row: BankMerchant) => row.merchant_name,
      sortable: true,
    },
    {
      name: "Created By",
      selector: (row: BankMerchant) => row.created_by_name,
      sortable: true,
    },
    {
      name: "Accepted By",
      selector: (row: BankMerchant) => row.accepted_by_name || "-",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: BankMerchant) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleViewDetails(row.bank_merchant_id)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 rounded-lg transition-all duration-200 border border-blue-500/30 cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {canEditDelete && (
            <>
              <button
                onClick={() => openEditModal(row.bank_merchant_id)}
                className="flex items-center gap-2 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-700 rounded-lg transition-all duration-200 border border-green-500/30 cursor-pointer"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  openDeleteDialog(row.bank_merchant_id, row.bank_name)
                }
                className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-700 rounded-lg transition-all duration-200 border border-red-500/30 cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bank merchants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        code={error.code}
        description={error.message}
        onAction={() => fetchBankMerchants({ page: 1, limit: 100 })}
        actionLabel="Try Again"
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bank Merchant Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and view all merchant bank accounts
            </p>
          </div>
          <button
            onClick={() => router.push("/bank/merchant/create")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Create New
          </button>
        </div>

        <BankMerchantFilter onApplyFilters={handleApplyFilters} />

        <CustomDataTable
          title="Bank Merchant List"
          description="All merchant bank accounts"
          columns={bankMerchantColumns}
          data={bankMerchants}
        />
      </div>

      {/* Edit Modal */}
      <EditBankMerchantModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        bankMerchantId={editModal.bankMerchantId}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Dialog */}
      <PinInputDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Bank Merchant"
        itemName={deleteDialog.bankName}
        isLoading={deleteLoading}
      />
    </>
  );
};

export default withRoleProtection(ListBankMerchantPage, [
  "PartnerOwner",
  "AgentOwner",
]);