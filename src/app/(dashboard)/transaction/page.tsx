"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CustomDataTable from "@/components/CustomDataTable";
import { transactionService } from "@/services/transaction.service";
import { Transaction, TransactionQueryParams } from "@/types/transaction";
import { TransactionFilter } from "@/components/transaction/TransactionFilter";
import {
  Eye,
  Calendar,
  CreditCard,
  Copy,
  Check,
  FileText,
  Clock,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { ErrorState } from "@/components/ErrorState";

const TransactionPage = () => {
  usePageTitle("Transaction List");
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<TransactionQueryParams>({
    page: 1,
    limit: 10,
  });

  const fetchTransactions = useCallback(
    async (filters?: TransactionQueryParams) => {
      try {
        setLoading(true);
        setError(null);
        const data = await transactionService.getTransactions(filters);
        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch transactions";
        setError(errorMessage);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchTransactions({ page: 1, limit: 10 });
  }, [fetchTransactions]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchTransactions(currentFilters);
    }, 30000); // Refresh setiap 30 detik

    return () => clearInterval(interval);
  }, [autoRefresh, currentFilters, fetchTransactions]);

  const handleApplyFilters = (filters: TransactionQueryParams) => {
    setCurrentFilters(filters);
    fetchTransactions(filters);
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh((prev) => !prev);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (
    dateString: string | null
  ): { date: string; time: string } => {
    if (!dateString) return { date: "-", time: "-" };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("id-ID"),
      time: date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { bg: string; text: string; label: string }
    > = {
      pending: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        label: "Pending",
      },
      paid: { bg: "bg-green-100", text: "text-green-700", label: "Paid" },
      expired: { bg: "bg-gray-100", text: "text-gray-700", label: "Expired" },
      failed: { bg: "bg-red-100", text: "text-red-700", label: "Failed" },
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const handleViewDetails = (transactionUuid: string) => {
    router.push(`/transaction/detail/${transactionUuid}`);
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

  const transactionColumns = [
    {
      name: "Created At",
      selector: (row: Transaction) => row.created_at,
      sortable: true,
      width: "160px",
      cell: (row: Transaction) => {
        const dateTime = formatDateTime(row.created_at);
        return (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-slate-700">
                {dateTime.date}
              </div>
              <div className="text-xs text-gray-500">{dateTime.time}</div>
            </div>
          </div>
        );
      },
    },
    {
      name: "Transaction ID",
      selector: (row: Transaction) => row.transaction_uuid,
      sortable: true,
      width: "200px",
      cell: (row: Transaction) => (
        <div className="flex items-center gap-2 group">
          <div className="flex-1 min-w-0">
            <div className="max-w-[140px] truncate">{row.transaction_uuid}</div>
          </div>
          <button
            onClick={() =>
              copyToClipboard(row.transaction_uuid, row.transaction_uuid)
            }
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all opacity-0 group-hover:opacity-100"
            title="Copy Transaction ID"
          >
            {copiedId === row.transaction_uuid ? (
              <Check className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-600" />
            )}
          </button>
        </div>
      ),
    },
    {
      name: "Order ID",
      selector: (row: Transaction) => row.order_id,
      sortable: true,
      width: "140px",
      cell: (row: Transaction) => (
        <div className="text-sm font-semibold text-indigo-700">
          {row.order_id}
        </div>
      ),
    },
    {
      name: "Amount",
      selector: (row: Transaction) => row.final_amount,
      sortable: true,
      width: "150px",
      cell: (row: Transaction) => (
        <div className="flex items-center gap-2">
          <div>
            <div className="text-sm font-bold text-green-700">
              {formatCurrency(row.final_amount)}
            </div>
            {row.amount !== row.final_amount && (
              <div className="text-xs text-gray-500 line-through">
                {formatCurrency(row.amount)}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      name: "Username",
      selector: (row: Transaction) => row.username,
      sortable: true,
      width: "180px",
    },
    {
      name: "Method",
      selector: (row: Transaction) => row.method,
      sortable: true,
      width: "140px",
      cell: (row: Transaction) => (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="text-sm font-medium text-slate-700">
            {row.method}
          </span>
        </div>
      ),
    },
    {
      name: "RRN",
      selector: (row: Transaction) => row.reference_number || "-",
      sortable: true,
      width: "150px",
      cell: (row: Transaction) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-500 flex-shrink-0" />
          <span className="text-sm text-slate-600">
            {row.reference_number || "-"}
          </span>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row: Transaction) => row.status,
      sortable: true,
      width: "150px",
      cell: (row: Transaction) => (
        <div className="space-y-1">{getStatusBadge(row.status)}</div>
      ),
    },
    {
      name: "Paid At",
      selector: (row: Transaction) => row.paid_at || "",
      sortable: true,
      width: "140px",
      cell: (row: Transaction) => {
        const dateTime = formatDateTime(row.paid_at);
        return row.paid_at ? (
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            <div>
              <div className="text-xs font-medium text-slate-700">
                {dateTime.date}
              </div>
              <div className="text-xs text-gray-500">{dateTime.time}</div>
            </div>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Not paid yet</span>
        );
      },
    },
    {
      name: "Actions",
      width: "150px",
      cell: (row: Transaction) => (
        <button
          onClick={() => handleViewDetails(row.transaction_uuid)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 rounded-lg transition-all duration-200 border border-blue-500/30"
        >
          <Eye className="w-4 h-4" />
          <span className="text-xs font-bold">Details</span>
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        code={getErrorCode()}
        description={error}
        onAction={() => fetchTransactions({ page: 1, limit: 10 })}
        actionLabel="Retry"
      />
    );
  }

  return (
    <div className="space-y-6">
      <TransactionFilter
        onApplyFilters={handleApplyFilters}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={toggleAutoRefresh}
      />

      <CustomDataTable
        title="Transaction Management"
        description="Manage and view all transactions"
        columns={transactionColumns}
        data={transactions}
      />
    </div>
  );
};

export default withRoleProtection(TransactionPage, [
  "PartnerOwner",
  "PlatformOwner",
  "PlatformStaff",
  "AgentOwner",
  "AgentStaff",
]);