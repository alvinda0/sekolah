"use client";

import React, { useState } from "react";
import CustomDataTable from "@/components/CustomDataTable";
import { credentialsService } from "@/services/credentials.service";
import { MerchantCredentials } from "@/types/credentials";
import { Key, Lock, Store } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { withRoleProtection } from "@/components/ProtectedRoles";

const CredentialsMerchantPage = () => {
  usePageTitle("Merchant Credentials");
  const [pin, setPin] = useState("");
  const [merchants, setMerchants] = useState<MerchantCredentials[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmitPin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pin || pin.length !== 6) {
      setError("PIN must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await credentialsService.getMerchantCredentials(pin);
      setMerchants(response.data.merchants);
      setIsAuthenticated(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch credentials";
      setError(errorMessage);
      setMerchants([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Store className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Merchant Credentials
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Enter your 6-digit PIN to view credentials
            </p>

            <form onSubmit={handleSubmitPin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PIN
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) =>
                    setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit PIN"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl tracking-widest"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || pin.length !== 6}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    <span>View Credentials</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (merchants.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">No merchant credentials found</p>
      </div>
    );
  }

  const merchantColumns = [

    {
      name: "Name",
      selector: (row: MerchantCredentials) => row.name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: MerchantCredentials) => row.status,
      sortable: true,
    },
    {
      name: "Environment",
      selector: (row: MerchantCredentials) => row.environment,
      sortable: true,
    },
    {
      name: "Production API Key",
      selector: (row: MerchantCredentials) => row.prod_api_key,
    },
    {
      name: "Production Callback Key",
      selector: (row: MerchantCredentials) => row.prod_callback_key,
    },
    {
      name: "Development API Key",
      selector: (row: MerchantCredentials) => row.dev_api_key,
    },
    {
      name: "Development Callback Key",
      selector: (row: MerchantCredentials) => row.dev_callback_key,
    },

  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Merchant Credentials
          </h1>
          <p className="text-gray-600 mt-1">
            Secure API credentials for merchant integration ({merchants.length}{" "}
            merchant{merchants.length !== 1 ? "s" : ""})
          </p>
        </div>
        <button
          onClick={() => {
            setIsAuthenticated(false);
            setMerchants([]);
            setPin("");
          }}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          <span className="font-semibold">Lock</span>
        </button>
      </div>

      <CustomDataTable
        title="Merchant API Credentials"
        description="View and manage your merchant API credentials for both production and development environments"
        columns={merchantColumns}
        data={merchants}
      />
    </div>
  );
};

export default withRoleProtection(CredentialsMerchantPage, ["AgentOwner"]);
