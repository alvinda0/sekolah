// app/bank/merchant/create/page.tsx
"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePageTitle } from "@/hooks/usePageTitle";
import { bankMerchantService } from "@/services/bank-merchant.service";
import { merchantService } from "@/services/merchant.service";
import { bankService } from "@/services/bank.service";
import { Merchant } from "@/types/merchant";
import { Bank } from "@/types/bank";
import {
  Building2,
  ShoppingCart,
  CreditCard,
  ChevronDown,
  X,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import PinInputDialog from "@/components/PinInputDialog";
import { withRoleProtection } from "@/components/ProtectedRoles";

const CreateBankMerchantPage = () => {
  usePageTitle("Create Bank Merchant");
  const router = useRouter();

  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [showPinDialog, setShowPinDialog] = useState(false);
  const [formData, setFormData] = useState<{
    merchant_id: string[];
    bank_uuid: string;
    account_number: string;
    account_name: string;
  } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [merchantsData, banksData] = await Promise.all([
        merchantService.getMerchants({ limit: 100 }),
        bankService.getBanks(),
      ]);
      setMerchants(merchantsData);
      setBanks(banksData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch data";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMerchantToggle = (merchantId: string) => {
    setSelectedMerchants((prev) =>
      prev.includes(merchantId)
        ? prev.filter((id) => id !== merchantId)
        : [...prev, merchantId]
    );
  };

  const handleRemoveMerchant = (merchantId: string) => {
    setSelectedMerchants((prev) => prev.filter((id) => id !== merchantId));
  };

  const filteredMerchants = merchants.filter(
    (merchant) =>
      merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.vendor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedMerchantNames = () => {
    return merchants
      .filter((m) => selectedMerchants.includes(m.merchant_id))
      .map((m) => m.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBank) {
      toast.error("Please select a bank");
      return;
    }

    if (!accountNumber.trim()) {
      toast.error("Please enter account number");
      return;
    }

    if (!accountName.trim()) {
      toast.error("Please enter account name");
      return;
    }

    if (selectedMerchants.length === 0) {
      toast.error("Please select at least one merchant");
      return;
    }

    setFormData({
      merchant_id: selectedMerchants,
      bank_uuid: selectedBank,
      account_number: accountNumber,
      account_name: accountName,
    });

    setShowPinDialog(true);
  };

  const handleConfirmPin = async (pin: string) => {
    if (!formData) return;

    try {
      setSubmitting(true);
      await bankMerchantService.createBankMerchants({
        ...formData,
        pin,
      });

      toast.success("Bank merchants created successfully");
      setShowPinDialog(false);
      router.push("/bank/merchant");
    } catch (err) {
      let errorMessage = "Failed to create bank merchant";

      if (err && typeof err === "object" && "response" in err) {
        const response = (err as { response?: { data?: { message?: string } } })
          .response;
        errorMessage = response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-6 px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create Bank Merchant
            </h1>
            <p className="text-gray-600 mt-1">
              Add bank account information for merchants
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bank Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Select Bank
              </h2>
            </div>

            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">-- Select Bank --</option>
              {banks.map((bank) => (
                <option key={bank.bank_id} value={bank.bank_id}>
                  {bank.name} ({bank.code})
                </option>
              ))}
            </select>
          </div>

          {/* Bank Account Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Account Information
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Merchant Selection - Multi Select Dropdown */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Select Merchants
              </h2>
            </div>

            {merchants.length === 0 ? (
              <p className="text-gray-500">No merchants available</p>
            ) : (
              <div className="relative" ref={dropdownRef}>
                {/* Dropdown Trigger */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700">
                    {selectedMerchants.length === 0
                      ? "Select merchants..."
                      : `${selectedMerchants.length} merchant(s) selected`}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Search merchants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Options */}
                    <div className="max-h-80 overflow-y-auto">
                      {filteredMerchants.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No merchants found
                        </div>
                      ) : (
                        filteredMerchants.map((merchant) => (
                          <label
                            key={merchant.merchant_id}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              checked={selectedMerchants.includes(
                                merchant.merchant_id
                              )}
                              onChange={() =>
                                handleMerchantToggle(merchant.merchant_id)
                              }
                              className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {merchant.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {merchant.vendor_name} • {merchant.agent_name}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                merchant.status === "Active"
                                  ? "bg-green-500/20 text-green-700"
                                  : "bg-gray-500/20 text-gray-700"
                              }`}
                            >
                              {merchant.status}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Selected Tags */}
            {selectedMerchants.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3">
                {getSelectedMerchantNames().map((name, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveMerchant(selectedMerchants[idx])
                      }
                      className="hover:text-blue-900 focus:outline-none"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Create Bank Merchant
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <PinInputDialog
        isOpen={showPinDialog}
        onClose={() => setShowPinDialog(false)}
        onConfirm={handleConfirmPin}
        title="Confirm Create Bank Merchant"
        itemName="bank merchant account"
        isLoading={submitting}
        actionType="create"
      />
    </>
  );
};

export default withRoleProtection(CreateBankMerchantPage, [
  "PartnerOwner",
  "AgentOwner",
]);
