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
    UserPlus,
    Mail,
    Phone,
    Lock,
    User,
    Shield,
    Loader2,
    CheckCircle,
    XCircle,
    Eye,
    EyeOff
} from 'lucide-react';
import { userService } from '@/services/user.service';
import { roleService } from '@/services/role.service';
import { Role } from '@/types/role';
import { CreateUserPayload } from '@/types/user';
import { usePageTitle } from '@/hooks/usePageTitle';
import { withRoleProtection } from '@/components/ProtectedRoles';

const CreateUserPage = () => {
    usePageTitle("Create User")
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [rolesLoading, setRolesLoading] = useState(true);
    const [roles, setRoles] = useState<Role[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState<CreateUserPayload>({
        email: '',
        phone: '',
        name: '',
        password: '',
        role: ''
    });

    const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateUserPayload, string>>>({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            setRolesLoading(true);
            const data = await roleService.getRoles();
            setRoles(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch roles');
        } finally {
            setRolesLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<Record<keyof CreateUserPayload, string>> = {};

        if (!formData.name || !formData.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.email || !formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }

        if (!formData.phone || !formData.phone.trim()) {
            errors.phone = 'Phone is required';
        } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
            errors.phone = 'Invalid phone format';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        if (!formData.role || formData.role === '') {
            errors.role = 'Role is required';
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

            await userService.createUser(formData);
            setSuccess(true);
            setTimeout(() => {
                router.push('/users');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof CreateUserPayload, value: string | number) => {
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
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">User Created Successfully!</h3>
                            <p className="text-gray-600 mb-4">Redirecting to user list...</p>
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
                            <UserPlus className="w-6 h-6 text-[#007BFF]" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Create New User</CardTitle>
                            <CardDescription>Add a new user to the system</CardDescription>
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
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    Name
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className={formErrors.name ? 'border-red-500' : ''}
                                />
                                {formErrors.name && (
                                    <p className="text-sm text-red-600">{formErrors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    Email
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className={formErrors.email ? 'border-red-500' : ''}
                                    autoComplete="off"
                                />
                                {formErrors.email && (
                                    <p className="text-sm text-red-600">{formErrors.email}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    Phone
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="08xxxxxxxxxx"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className={formErrors.phone ? 'border-red-500' : ''}
                                />
                                {formErrors.phone && (
                                    <p className="text-sm text-red-600">{formErrors.phone}</p>
                                )}
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <Label htmlFor="role" className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-gray-500" />
                                    Role
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => handleInputChange('role', value)}
                                    disabled={rolesLoading}
                                >
                                    <SelectTrigger className={formErrors.role ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles
                                            .filter(role => role.role_id != null) // Filter out roles without id
                                            .map((role) => (
                                                <SelectItem
                                                    key={role.role_id}
                                                    value={String(role.role_id)} // Use String() instead of toString()
                                                >
                                                    {role.role_name}
                                                </SelectItem>
                                            ))
                                        }
                                        {roles.length === 0 && !rolesLoading && (
                                            <div className="p-2 text-sm text-gray-500 text-center">
                                                No roles available
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                                {formErrors.role && (
                                    <p className="text-sm text-red-600">{formErrors.role}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="password" className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-gray-500" />
                                    Password
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 8 characters"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className={`pr-10 ${formErrors.password ? 'border-red-500' : ''}`}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {formErrors.password && (
                                    <p className="text-sm text-red-600">{formErrors.password}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Password must be at least 8 characters long
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading || rolesLoading}
                                className="bg-[#007BFF] hover:bg-[#0066DD] text-white px-8"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Create User
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

export default withRoleProtection(CreateUserPage, [
    "PartnerOwner",
    "PlatformOwner",
    "AgentOwner"
]);