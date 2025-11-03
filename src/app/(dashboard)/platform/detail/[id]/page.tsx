"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { platformService } from "@/services/platform.service";
import { Platform } from "@/types/platform";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Activity,
  Tag,
  Hash,
  CheckCircle,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { withRoleProtection } from "@/components/ProtectedRoles";

export const runtime = 'edge';

const PlatformDetailPage = () => {
  usePageTitle("Platform Details");
  const params = useParams();
  const router = useRouter();
  const platformId = params.id as string;

  const [platform, setPlatform] = useState<Platform | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlatformDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await platformService.getPlatformById(platformId);
      setPlatform(data);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch platform details";
      setError(errorMessage);
      setPlatform(null);
    } finally {
      setLoading(false);
    }
  }, [platformId]);

  useEffect(() => {
    if (platformId) {
      fetchPlatformDetails();
    }
  }, [platformId, fetchPlatformDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading platform details...</p>
        </div>
      </div>
    );
  }

  if (error || !platform) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 text-red-500 mx-auto mb-4">❌</div>
          <p className="text-red-600 font-bold">{error || "Platform not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
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
          className="p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 hover:bg-white/80 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Platform Details</h1>
          <p className="text-sm text-gray-600">
            View complete information about the platform
          </p>
        </div>
      </div>

      {/* Platform Information Card */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{platform.name}</h2>
              <p className="text-blue-100 text-sm mt-1">ID: {platform.platform_id}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm border ${platform.status === "ACTIVE"
                ? "bg-green-500/20 text-white border-green-300"
                : platform.status === "INACTIVE"
                  ? "bg-red-500/20 text-white border-red-300"
                  : "bg-yellow-500/20 text-white border-yellow-300"
                }`}
            >
              {platform.status}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Platform Information
            </h3>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Tag className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Referral Code</p>
                <p className="text-sm font-semibold text-gray-800">
                  {platform.referral}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Hash className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Partner Name</p>
                <p className="text-sm font-semibold text-gray-800">
                  {platform.partner_name}
                </p>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Business Information
            </h3>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Platform Fee</p>
                <p className="text-sm font-semibold text-gray-800">
                  {(platform.fee)}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Status</p>
                <p className="text-sm font-semibold text-gray-800">
                  {platform.status}
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Timeline Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Created At</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(platform.created_at).toLocaleString("en-US", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Updated At</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(platform.updated_at).toLocaleString("en-US", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRoleProtection(PlatformDetailPage, ["PartnerOwner"]);