"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Modal } from "@/components/Modal";
import { bankMerchantService } from "@/services/bank-merchant.service";
import { BankMerchant } from "@/types/bank-merchant";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import PinInputDialog from "@/components/PinInputDialog";

interface EditBankMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankMerchantId: string;
  onSuccess?: () => void;
}

interface ApiErrorResponse {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export function EditBankMerchantModal({
  isOpen,
  onClose,
  bankMerchantId,
  onSuccess,
}: EditBankMerchantModalProps) {
  const [bankMerchant, setBankMerchant] = useState<BankMerchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const [showPinDialog, setShowPinDialog] = useState(false);
  const [formData, setFormData] = useState<{
    account_number: string;
    account_name: string;
  } | null>(null);

  const fetchBankMerchant = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bankMerchantService.getBankMerchantById(
        bankMerchantId
      );
      setBankMerchant(data);
      setAccountNumber(data.account_number);
      setAccountName(data.account_name);
    } catch (err) {
      const error = err as ApiErrorResponse;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch bank merchant";
      toast.error(errorMessage);
      onClose();
    } finally {
      setLoading(false);
    }
  }, [bankMerchantId, onClose]);

  useEffect(() => {
    if (isOpen && bankMerchantId) {
      fetchBankMerchant();
    }
  }, [isOpen, bankMerchantId, fetchBankMerchant]);

  useEffect(() => {
    if (bankMerchant) {
      const hasChanged =
        accountNumber !== bankMerchant.account_number ||
        accountName !== bankMerchant.account_name;
      setHasChanges(hasChanged);
    }
  }, [accountNumber, accountName, bankMerchant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountNumber.trim()) {
      toast.error("Please enter account number");
      return;
    }

    if (!accountName.trim()) {
      toast.error("Please enter account name");
      return;
    }

    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }

    setFormData({
      account_number: accountNumber,
      account_name: accountName,
    });

    setShowPinDialog(true);
  };

  const handleConfirmPin = async (pin: string) => {
    if (!formData) return;

    try {
      setSubmitting(true);
      await bankMerchantService.updateBankMerchant(bankMerchantId, {
        ...formData,
        pin,
      });

      toast.success("Bank merchant updated successfully");
      setShowPinDialog(false);
      onClose();
      onSuccess?.();
    } catch (err) {
      const error = err as ApiErrorResponse;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update bank merchant";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
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

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Edit Bank Merchant"
        size="xl"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Loading bank merchant...</p>
            </div>
          </div>
        ) : bankMerchant ? (
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-5 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-1">
                    Bank Name
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {bankMerchant.bank_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-1">
                    Merchant Name
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {bankMerchant.merchant_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(
                      bankMerchant.status
                    )}`}
                  >
                    {bankMerchant.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-1">
                    Created At
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(bankMerchant.created_at).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 p-5 space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-semibold text-gray-900">
                    Account Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Enter account number"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name
                    </label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Enter account holder name"
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              {hasChanges && (
                <div className="p-3 bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-700 font-medium">
                    ⚠️ You have unsaved changes
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting || !hasChanges}
                  className="flex-1 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 text-sm shadow-sm hover:shadow-md"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-900 font-semibold rounded-lg transition-colors duration-200 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Bank merchant not found</p>
          </div>
        )}
      </Modal>

      <PinInputDialog
        isOpen={showPinDialog}
        onClose={() => setShowPinDialog(false)}
        onConfirm={handleConfirmPin}
        title="Confirm Update Bank Merchant"
        itemName={bankMerchant?.bank_name || ""}
        isLoading={submitting}
      />
    </>
  );
}