"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Wallet,
  Building2,
  CreditCard,
  User,
  Loader2,
  XCircle,
  Send,
  Banknote,
  Hash,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/usePageTitle";
import { withRoleProtection } from "@/components/ProtectedRoles";
import { merchantService } from "@/services/merchant.service";
import { bankMerchantService } from "@/services/bank-merchant.service";
import { disbursementMerchantService } from "@/services/disbursement-merchant.service";
import { walletMerchantService } from "@/services/wallet-merchant.service";
import { Merchant } from "@/types/merchant";
import { BankMerchant } from "@/types/bank-merchant";
import { CreateDisbursementMerchantRequest } from "@/types/disbursement-merchant";
import { WalletMerchant } from "@/types/wallet-merchant";
import LoadingModal from "@/components/disbursement/LoadingModal";
import SuccessModal from "@/components/disbursement/SuccessModal";
import PinInputDialog from "@/components/PinInputDialog";

const RequestDisbursementMerchant = () => {
  usePageTitle("Request Disbursement");
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [merchantsLoading, setMerchantsLoading] = useState(true);
  const [banksLoading, setBanksLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [banks, setBanks] = useState<BankMerchant[]>([]);
  const [wallet, setWallet] = useState<WalletMerchant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>("");
  const [showPinDialog, setShowPinDialog] = useState(false);

  const [formData, setFormData] = useState<CreateDisbursementMerchantRequest>({
    merchant_id: "",
    amount: 0,
    bank_merchant_id: "",
    type: "IDR",
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof CreateDisbursementMerchantRequest, string>>
  >({});

  const fetchMerchants = useCallback(async () => {
    try {
      setMerchantsLoading(true);
      const data = await merchantService.getMerchants({
        limit: 256,
        status: "ACTIVE",
      });
      setMerchants(data);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch merchants";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setMerchantsLoading(false);
    }
  }, []);

  const fetchBankMerchants = useCallback(async (merchantId: string) => {
    try {
      setBanksLoading(true);
      const data = await bankMerchantService.getBankMerchants({
        merchant_id: merchantId,
        status: "Accepted",
      });

      console.log("Bank Merchants Data:", data);
      console.log("Total Bank Merchants:", data.length);

      setBanks(data);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch bank accounts";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setBanksLoading(false);
    }
  }, []);

  const fetchWalletBalance = useCallback(async (merchantId: string) => {
    try {
      setWalletLoading(true);
      const data = await walletMerchantService.getWalletMerchants({
        merchant_id: merchantId,
      });
      if (data && data.length > 0) {
        setWallet(data[0]);
      } else {
        setWallet(null);
      }
    } catch (err) {
      console.error("Failed to fetch wallet balance:", err);
      toast.error("Failed to fetch wallet balance");
      setWallet(null);
    } finally {
      setWalletLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const handleMerchantSelect = (merchantId: string) => {
    setSelectedMerchantId(merchantId);
    setFormData((prev) => ({
      ...prev,
      merchant_id: merchantId,
      bank_merchant_id: "",
    }));
    setBanks([]);
    setWallet(null);

    fetchBankMerchants(merchantId);
    fetchWalletBalance(merchantId);

    if (formErrors.merchant_id) {
      setFormErrors((prev) => ({ ...prev, merchant_id: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<
      Record<keyof CreateDisbursementMerchantRequest, string>
    > = {};

    if (!formData.merchant_id || !formData.merchant_id.trim()) {
      errors.merchant_id = "Merchant is required";
    }

    if (!formData.amount || formData.amount <= 0) {
      errors.amount = "Amount must be greater than 0";
    }

    if (wallet && formData.amount > wallet.available_balance) {
      errors.amount = "Amount exceeds available balance";
    }

    if (!formData.bank_merchant_id || !formData.bank_merchant_id.trim()) {
      errors.bank_merchant_id = "Bank account is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitClick = () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }
    // Show PIN dialog
    setShowPinDialog(true);
  };

  const handlePinConfirm = async (pin: string) => {
    try {
      setLoading(true);
      setError(null);

      // Create payload with PIN
      const payload = {
        ...formData,
        pin: pin,
      };

      await disbursementMerchantService.createDisbursementMerchant(payload);

      // Close PIN dialog
      setShowPinDialog(false);

      // Show success modal
      setShowSuccess(true);
      toast.success("Disbursement request submitted successfully!");

      setTimeout(() => {
        router.push("/disbursement/merchant/list");
      }, 2000);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create disbursement";
      setError(errorMsg);
      toast.error(errorMsg);

      // Close PIN dialog on error
      setShowPinDialog(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateDisbursementMerchantRequest,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBankSelect = (bankMerchantId: string) => {
    setFormData((prev) => ({
      ...prev,
      bank_merchant_id: bankMerchantId,
    }));

    if (formErrors.bank_merchant_id) {
      setFormErrors((prev) => ({ ...prev, bank_merchant_id: undefined }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitClick();
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <LoadingModal
        isOpen={loading}
        message="Processing your disbursement request..."
      />
      <SuccessModal
        isOpen={showSuccess}
        message="Disbursement request submitted successfully!"
        onClose={() => setShowSuccess(false)}
      />
      <PinInputDialog
        isOpen={showPinDialog}
        onClose={() => setShowPinDialog(false)}
        onConfirm={handlePinConfirm}
        title="Confirm Disbursement"
        isLoading={loading}
        actionType="create"
        actionLabel="Submit Disbursement"
        loadingLabel="Submitting..."
      />

      <div className="w-full p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section - Wallet Balance */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <Card className="backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 border border-white/20 shadow-2xl h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg backdrop-blur-sm">
                    <Wallet className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Wallet Balance</CardTitle>
                    <CardDescription className="text-xs">
                      Available funds
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!selectedMerchantId ? (
                  <div className="text-center py-8">
                    <Store className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Please select a merchant first
                    </p>
                  </div>
                ) : walletLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : wallet ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Available Balance
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(wallet.available_balance)}
                      </p>
                    </div>

                    <div className="p-3 backdrop-blur-sm bg-amber-50/50 border border-amber-200/50 rounded-lg">
                      <p className="text-xs text-amber-700 mb-1">
                        Pending Balance
                      </p>
                      <p className="text-lg font-semibold text-amber-800">
                        {formatCurrency(wallet.pending_balance)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No wallet found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Form */}
          <div className="flex-1">
            <Card className="w-full backdrop-blur-xl bg-white/70 border border-white/20 shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-[#007BFF]/20 to-[#0066DD]/20 rounded-lg backdrop-blur-sm">
                    <Wallet className="w-6 h-6 text-[#007BFF]" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      Request Disbursement
                    </CardTitle>
                    <CardDescription>
                      Submit a new disbursement request for merchant
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {error && (
                  <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-lg flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-800">
                        Error
                      </p>
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Merchant Selection */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="merchant"
                      className="flex items-center gap-2"
                    >
                      <Store className="w-4 h-4 text-gray-500" />
                      Merchant
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={handleMerchantSelect}
                      disabled={merchantsLoading}
                      value={selectedMerchantId}
                    >
                      <SelectTrigger
                        className={`backdrop-blur-sm bg-white/50 ${
                          formErrors.merchant_id ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select merchant" />
                      </SelectTrigger>
                      <SelectContent>
                        {merchants.map((merchant) => (
                          <SelectItem
                            key={merchant.merchant_id}
                            value={merchant.merchant_id}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {merchant.name}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.merchant_id && (
                      <p className="text-sm text-red-600">
                        {formErrors.merchant_id}
                      </p>
                    )}
                  </div>

                  {/* Bank Account Selection */}
                  {selectedMerchantId && (
                    <div className="space-y-2">
                      <Label htmlFor="bank" className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        Bank Account
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={handleBankSelect}
                        disabled={banksLoading}
                      >
                        <SelectTrigger
                          className={`backdrop-blur-sm bg-white/50 ${
                            formErrors.bank_merchant_id ? "border-red-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select bank account" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem
                              key={bank.bank_merchant_id}
                              value={bank.bank_merchant_id}
                            >
                              <div className="flex flex-row justify-center items-center gap-2">
                                <span className="font-medium">
                                  {bank.bank_name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({bank.account_name} - {bank.bank_code} -{" "}
                                  {bank.account_number})
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.bank_merchant_id && (
                        <p className="text-sm text-red-600">
                          {formErrors.bank_merchant_id}
                        </p>
                      )}
                      {banks.length === 0 && !banksLoading && (
                        <p className="text-sm text-amber-600">
                          No active bank accounts found. Please add a bank
                          account first.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Selected Bank Details */}
                  {formData.bank_merchant_id &&
                    (() => {
                      const selectedBank = banks.find(
                        (bank) =>
                          bank.bank_merchant_id === formData.bank_merchant_id
                      );

                      return selectedBank ? (
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 space-y-2">
                            <Label
                              htmlFor="account_name"
                              className="flex items-center gap-2"
                            >
                              <User className="w-4 h-4 text-gray-500" />
                              Account Name
                            </Label>
                            <Input
                              id="account_name"
                              type="text"
                              value={selectedBank.account_name}
                              disabled
                              className="backdrop-blur-sm bg-gray-100/50 font-semibold"
                            />
                          </div>

                          <div className="flex-1 space-y-2">
                            <Label
                              htmlFor="bank_code"
                              className="flex items-center gap-2"
                            >
                              <Hash className="w-4 h-4 text-gray-500" />
                              Bank Code
                            </Label>
                            <Input
                              id="bank_code"
                              type="text"
                              value={selectedBank.bank_code}
                              disabled
                              className="backdrop-blur-sm bg-gray-100/50 font-semibold"
                            />
                          </div>

                          <div className="flex-1 space-y-2">
                            <Label
                              htmlFor="account_number"
                              className="flex items-center gap-2"
                            >
                              <CreditCard className="w-4 h-4 text-gray-500" />
                              Account Number
                            </Label>
                            <Input
                              id="account_number"
                              type="text"
                              value={selectedBank.account_number}
                              disabled
                              className="backdrop-blur-sm bg-gray-100/50 font-semibold"
                            />
                          </div>
                        </div>
                      ) : null;
                    })()}

                  {/* Amount */}
                  {selectedMerchantId && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="amount"
                        className="flex items-center gap-2"
                      >
                        <Banknote className="w-4 h-4 text-gray-500" />
                        Amount
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={formData.amount || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "amount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        onKeyPress={handleKeyPress}
                        className={`backdrop-blur-sm bg-white/50 ${
                          formErrors.amount ? "border-red-500" : ""
                        }`}
                        min="0"
                        step="1000"
                      />
                      {formErrors.amount && (
                        <p className="text-sm text-red-600">
                          {formErrors.amount}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={loading}
                      className="backdrop-blur-sm bg-white/50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSubmitClick}
                      disabled={
                        loading ||
                        !selectedMerchantId ||
                        banksLoading ||
                        banks.length === 0
                      }
                      className="bg-gradient-to-r from-[#007BFF] to-[#0066DD] hover:from-[#0066DD] hover:to-[#0052BB] text-white px-8"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRoleProtection(RequestDisbursementMerchant, ["AgentOwner"]);
