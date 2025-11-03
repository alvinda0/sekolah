"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { bankPlatformService } from "@/services/bank-platform.service";
import { BankPlatform } from "@/types/bank-platform";
import { usePageTitle } from "@/hooks/usePageTitle";
import { toast } from "sonner";
import { Building2, CreditCard, User, ArrowLeft, Lock } from "lucide-react";
import { Bank } from "@/types/bank";
import { bankService } from "@/services/bank.service";
import { withRoleProtection } from "@/components/ProtectedRoles";

export const runtime = 'edge';

const EditBankPlatformPage = () => {
    usePageTitle("Edit Bank Platform");
    const router = useRouter();
    const params = useParams();
    const bankPlatformId = params.id as string;

    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [bankPlatform, setBankPlatform] = useState<BankPlatform | null>(null);

    const [formData, setFormData] = useState({
        bank_uuid: "",
        account_number: "",
        account_name: "",
        pin: "",
    });

    const fetchInitialData = useCallback(async () => {
        try {
            setLoadingData(true);
            const [banksData, platformData] = await Promise.all([
                bankService.getBanks(),
                bankPlatformService.getBankPlatformById(bankPlatformId),
            ]);

            setBanks(banksData);
            setBankPlatform(platformData);

            // Find bank by bank_code
            const selectedBank = banksData.find(b => b.code === platformData.bank_code);

            setFormData({
                bank_uuid: selectedBank?.bank_id || "",
                account_number: platformData.account_number,
                account_name: platformData.account_name,
                pin: "",
            });
        } catch (err) {
            const error = err as Error & { message?: string };
            toast.error(error.message || "Failed to fetch data");
            router.back();
        } finally {
            setLoadingData(false);
        }
    }, [bankPlatformId, router]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

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

        if (!formData.bank_uuid || !formData.account_number ||
            !formData.account_name || !formData.pin) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);
            await bankPlatformService.updateBankPlatform(bankPlatformId, formData);
            toast.success("Bank platform updated successfully");
            router.push("/bank/platform");
        } catch (err) {
            const error = err as Error & {
                response?: { data?: { message?: string } };
                message?: string;
            };
            const errorMessage =
                error.response?.data?.message || error.message || "Failed to update bank platform";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading data...</p>
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
                    <h1 className="text-2xl font-bold text-gray-900">Edit Bank Platform</h1>
                    <p className="text-sm text-gray-600">Update bank platform account details</p>
                </div>
            </div>

            {/* Status Badge */}
            {bankPlatform && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        Current Status: <span className="font-semibold">{bankPlatform.status}</span>
                    </p>
                </div>
            )}

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
                            name="bank_uuid"
                            value={formData.bank_uuid}
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
                            {loading ? "Updating..." : "Update Bank Platform"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default withRoleProtection(EditBankPlatformPage, [
  "PartnerOwner",
  "PlatformOwner",
]);

