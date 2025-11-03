"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { bankPlatformService } from "@/services/bank-platform.service";
import { usePageTitle } from "@/hooks/usePageTitle";
import { toast } from "sonner";
import { Building2, CreditCard, User, ArrowLeft, Lock } from "lucide-react";
import { Bank } from "@/types/bank";
import { bankService } from "@/services/bank.service";
import { withRoleProtection } from "@/components/ProtectedRoles";

const CreateBankPlatformPage = () => {
  usePageTitle("Create Bank Platform");
  const router = useRouter();

  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(true);

  const [formData, setFormData] = useState({
    bank_id: "",
    account_number: "",
    account_name: "",
    pin: "",
  });

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setLoadingBanks(true);
      const data = await bankService.getBanks();
      setBanks(data);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to fetch banks");
    } finally {
      setLoadingBanks(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.bank_id ||
      !formData.account_number ||
      !formData.account_name ||
      !formData.pin
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      // Ubah key dari bank_id menjadi bank_uuid
      const payload = {
        bank_uuid: formData.bank_id,
        account_number: formData.account_number,
        account_name: formData.account_name,
        pin: formData.pin,
      };
      await bankPlatformService.createBankPlatform(payload);
      toast.success("Bank platform created successfully");
      router.push("/bank/platform");
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create bank platform";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingBanks) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading banks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create Bank Platform
          </h1>
          <p className="text-sm text-gray-600">
            Add a new bank platform account
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bank Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4" />
              Bank / Wallet <span className="text-red-500">*</span>
            </label>
            <select
              name="bank_id"
              value={formData.bank_id}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select Bank</option>
              {banks.map((bank) => (
                <option key={bank.bank_id} value={bank.bank_id}>
                  {bank.name} ({bank.code})
                </option>
              ))}
            </select>
          </div>

          {/* Account Number */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="w-4 h-4" />
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleInputChange}
              placeholder="Enter account number"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Account Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4" />
              Account Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="account_name"
              value={formData.account_name}
              onChange={handleInputChange}
              placeholder="Enter account name"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* PIN */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4" />
              PIN <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="pin"
              value={formData.pin}
              onChange={handleInputChange}
              placeholder="Enter your PIN"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              maxLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your 6-digit PIN to confirm this action
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Bank Platform"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withRoleProtection(CreateBankPlatformPage, [
  "PartnerOwner",
  "PlatformOwner",
]);
