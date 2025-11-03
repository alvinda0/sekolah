"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Store,
    Building2,
    Loader2,
    CheckCircle,
    XCircle,
    Tag,
    Users
} from 'lucide-react';
import { merchantService } from '@/services/merchant.service';
import { vendorService } from '@/services/vendor.service';
import { agentService } from '@/services/agent.service';
import { merchantTypeService } from '@/services/merchantType.service';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Vendor } from '@/types/vendor';
import { Agent } from '@/types/agent';
import { MerchantType } from '@/types/merchantType';
import { withRoleProtection } from '@/components/ProtectedRoles';

interface CreateMerchantPayload {
    vendor_id: string;
    agent_id: string;
    name: string;
    merchant_type_id: string;
}

const CreateMerchantPage = () => {
    usePageTitle("Create Merchant");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [vendorsLoading, setVendorsLoading] = useState(true);
    const [agentsLoading, setAgentsLoading] = useState(true);
    const [merchantTypesLoading, setMerchantTypesLoading] = useState(true);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [merchantTypes, setMerchantTypes] = useState<MerchantType[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState<CreateMerchantPayload>({
        vendor_id: '',
        agent_id: '',
        name: '',
        merchant_type_id: ''
    });

    const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateMerchantPayload, string>>>({});

    useEffect(() => {
        fetchVendors();
        fetchAgents();
        fetchMerchantTypes();
    }, []);

    const fetchVendors = async () => {
        try {
            setVendorsLoading(true);
            const data = await vendorService.getVendors(100);
            setVendors(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch vendors');
        } finally {
            setVendorsLoading(false);
        }
    };

    const fetchAgents = async () => {
        try {
            setAgentsLoading(true);
            const data = await agentService.getAgentsForSelect();
            setAgents(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch agents');
        } finally {
            setAgentsLoading(false);
        }
    };

    const fetchMerchantTypes = async () => {
        try {
            setMerchantTypesLoading(true);
            const data = await merchantTypeService.getMerchantTypes({ page: 1, limit: 100 });
            setMerchantTypes(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch merchant types');
        } finally {
            setMerchantTypesLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<Record<keyof CreateMerchantPayload, string>> = {};

        if (!formData.name.trim()) {
            errors.name = 'Merchant name is required';
        }

        if (!formData.vendor_id || formData.vendor_id === '') {
            errors.vendor_id = 'Vendor is required';
        }

        if (!formData.agent_id || formData.agent_id === '') {
            errors.agent_id = 'Agent is required';
        }

        if (!formData.merchant_type_id || formData.merchant_type_id === '') {
            errors.merchant_type_id = 'Merchant type is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await merchantService.createMerchant(formData);
            setSuccess(true);
            setTimeout(() => {
                router.push('/merchant/list');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create merchant');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof CreateMerchantPayload, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Merchant Created Successfully!</h3>
                            <p className="text-gray-600 mb-4">Redirecting to merchant list...</p>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007BFF] mx-auto"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full p-6">
            <Card className="w-full">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#007BFF]/10 rounded-lg">
                            <Store className="w-6 h-6 text-[#007BFF]" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Create New Merchant</CardTitle>
                            <CardDescription>Add a new merchant to the system</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-red-800">Error</p>
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Merchant Name */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <Store className="w-4 h-4 text-gray-500" />
                                    Merchant Name
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter merchant name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className={formErrors.name ? 'border-red-500' : ''}
                                />
                                {formErrors.name && (
                                    <p className="text-sm text-red-600">{formErrors.name}</p>
                                )}
                            </div>

                            {/* Vendor */}
                            <div className="space-y-2">
                                <Label htmlFor="vendor" className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-gray-500" />
                                    Vendor
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.vendor_id}
                                    onValueChange={(value) => handleInputChange('vendor_id', value)}
                                    disabled={vendorsLoading}
                                >
                                    <SelectTrigger className={formErrors.vendor_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder={vendorsLoading ? "Loading vendors..." : "Select a vendor"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vendors.map((vendor) => (
                                            <SelectItem key={vendor.vendor_id} value={vendor.vendor_id}>
                                                {vendor.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {formErrors.vendor_id && (
                                    <p className="text-sm text-red-600">{formErrors.vendor_id}</p>
                                )}
                            </div>

                            {/* Agent */}
                            <div className="space-y-2">
                                <Label htmlFor="agent" className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    Agent
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.agent_id}
                                    onValueChange={(value) => handleInputChange('agent_id', value)}
                                    disabled={agentsLoading}
                                >
                                    <SelectTrigger className={formErrors.agent_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder={agentsLoading ? "Loading agents..." : "Select an agent"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agents.map((agent) => (
                                            <SelectItem key={agent.agent_id} value={agent.agent_id}>
                                                {agent.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {formErrors.agent_id && (
                                    <p className="text-sm text-red-600">{formErrors.agent_id}</p>
                                )}
                            </div>

                            {/* Merchant Type */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="merchantType" className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-gray-500" />
                                    Merchant Type
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.merchant_type_id}
                                    onValueChange={(value) => handleInputChange('merchant_type_id', value)}
                                    disabled={merchantTypesLoading}
                                >
                                    <SelectTrigger className={formErrors.merchant_type_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder={merchantTypesLoading ? "Loading merchant types..." : "Select a merchant type"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {merchantTypes.map((type) => (
                                            <SelectItem key={type.merchant_type_id} value={type.merchant_type_id}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {formErrors.merchant_type_id && (
                                    <p className="text-sm text-red-600">{formErrors.merchant_type_id}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading || vendorsLoading || agentsLoading || merchantTypesLoading}
                                className="bg-[#007BFF] hover:bg-[#0066DD] text-white px-8"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Store className="w-4 h-4 mr-2" />
                                        Create Merchant
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default withRoleProtection(CreateMerchantPage, [
    "PartnerOwner",
    "PlatformOwner",
    "AgentOwner",
]);