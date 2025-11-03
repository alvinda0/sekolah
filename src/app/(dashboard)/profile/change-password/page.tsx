"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Lock,
    Loader2,
    CheckCircle,
    XCircle,
    Eye,
    EyeOff,
    KeyRound
} from 'lucide-react';
import { authService } from '@/services/auth.service';
import { usePageTitle } from '@/hooks/usePageTitle';

interface PasswordFormData {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

const ChangePasswordPage = () => {
    usePageTitle('Change Password')
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState<PasswordFormData>({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [formErrors, setFormErrors] = useState<Partial<Record<keyof PasswordFormData, string>>>({});
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const validateForm = (): boolean => {
        const errors: Partial<Record<keyof PasswordFormData, string>> = {};

        if (!formData.current_password) {
            errors.current_password = 'Current password is required';
        }

        if (!formData.new_password) {
            errors.new_password = 'New password is required';
        } else if (formData.new_password.length < 8) {
            errors.new_password = 'Password must be at least 8 characters';
        } else if (formData.new_password === formData.current_password) {
            errors.new_password = 'New password must be different from current password';
        }

        if (!formData.confirm_password) {
            errors.confirm_password = 'Please confirm your new password';
        } else if (formData.confirm_password !== formData.new_password) {
            errors.confirm_password = 'Passwords do not match';
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

            await authService.changePassword({
                current_password: formData.current_password,
                new_password: formData.new_password
            });

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof PasswordFormData, value: string) => {
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

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Password Changed Successfully!</h3>
                            <p className="text-gray-600 mb-4">Redirecting to dashboard...</p>
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
                            <KeyRound className="w-6 h-6 text-[#007BFF]" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Change Password</CardTitle>
                            <CardDescription>Update your account password</CardDescription>
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
                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label htmlFor="current_password" className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-gray-500" />
                                Current Password
                                <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="current_password"
                                    type={showPasswords.current ? "text" : "password"}
                                    placeholder="Enter your current password"
                                    value={formData.current_password}
                                    onChange={(e) => handleInputChange('current_password', e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className={`pr-10 ${formErrors.current_password ? 'border-red-500' : ''}`}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPasswords.current ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {formErrors.current_password && (
                                <p className="text-sm text-red-600">{formErrors.current_password}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="new_password" className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-gray-500" />
                                New Password
                                <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="new_password"
                                    type={showPasswords.new ? "text" : "password"}
                                    placeholder="Enter your new password"
                                    value={formData.new_password}
                                    onChange={(e) => handleInputChange('new_password', e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className={`pr-10 ${formErrors.new_password ? 'border-red-500' : ''}`}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPasswords.new ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {formErrors.new_password && (
                                <p className="text-sm text-red-600">{formErrors.new_password}</p>
                            )}
                            <p className="text-xs text-gray-500">
                                Password must be at least 8 characters long
                            </p>
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password" className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-gray-500" />
                                Confirm New Password
                                <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirm_password"
                                    type={showPasswords.confirm ? "text" : "password"}
                                    placeholder="Confirm your new password"
                                    value={formData.confirm_password}
                                    onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className={`pr-10 ${formErrors.confirm_password ? 'border-red-500' : ''}`}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPasswords.confirm ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {formErrors.confirm_password && (
                                <p className="text-sm text-red-600">{formErrors.confirm_password}</p>
                            )}
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-[#007BFF] hover:bg-[#0066DD] text-white px-8"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Changing Password...
                                    </>
                                ) : (
                                    <>
                                        <KeyRound className="w-4 h-4 mr-2" />
                                        Change Password
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

export default ChangePasswordPage;