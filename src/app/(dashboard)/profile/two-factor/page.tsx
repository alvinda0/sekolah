'use client'
// pages/TwoFactorAuthPage.tsx
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { twoFAService } from '@/services/twofa.service'
import { TwoFASetupData, TwoFAStatusData } from '@/types/twofa'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function TwoFactorAuthPage() {
    usePageTitle('2FA')
    const [statusData, setStatusData] = useState<TwoFAStatusData | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)

    // Setup states
    const [setupData, setSetupData] = useState<TwoFASetupData | null>(null)
    const [verifyToken, setVerifyToken] = useState('')
    const [verifyError, setVerifyError] = useState('')

    // Disable states
    const [showDisableModal, setShowDisableModal] = useState(false)
    const [disableToken, setDisableToken] = useState('')
    const [disableError, setDisableError] = useState('')

    // Success states
    const [backupCodes, setBackupCodes] = useState<string[]>([])
    const [showBackupCodes, setShowBackupCodes] = useState(false)

    useEffect(() => {
        fetchStatus()
    }, [])

    const fetchStatus = async () => {
        try {
            setLoading(true)
            const data = await twoFAService.getStatus()
            setStatusData(data)
        } catch (error) {
            console.error('Failed to fetch 2FA status:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSetup2FA = async () => {
        try {
            setActionLoading(true)
            setVerifyError('')
            const data = await twoFAService.setup({ method: 'totp' })
            setSetupData(data)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to setup 2FA'
            alert(message)
        } finally {
            setActionLoading(false)
        }
    }

    const handleVerify2FA = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!verifyToken || verifyToken.length !== 6) {
            setVerifyError('Please enter a valid 6-digit code')
            return
        }

        try {
            setActionLoading(true)
            setVerifyError('')
            const data = await twoFAService.verify({
                method: 'totp',
                token: verifyToken
            })

            setBackupCodes(data.backup_codes)
            setShowBackupCodes(true)
            setSetupData(null)
            setVerifyToken('')

            // Refresh status data
            await fetchStatus()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Verification failed'
            setVerifyError(message)
        } finally {
            setActionLoading(false)
        }
    }

    const handleDisable2FA = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!disableToken || disableToken.length !== 6) {
            setDisableError('Please enter a valid 6-digit code')
            return
        }

        try {
            setActionLoading(true)
            setDisableError('')
            await twoFAService.disable(disableToken)

            setShowDisableModal(false)
            setDisableToken('')
            alert('2FA has been disabled successfully')

            // Refresh status data
            await fetchStatus()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to disable 2FA'
            setDisableError(message)
        } finally {
            setActionLoading(false)
        }
    }

    const downloadBackupCodes = () => {
        const text = backupCodes.join('\n')
        const blob = new Blob([text], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = '2fa-backup-codes.txt'
        a.click()
        URL.revokeObjectURL(url)
    }

    const copyBackupCodes = () => {
        const text = backupCodes.join('\n')
        navigator.clipboard.writeText(text)
        alert('Backup codes copied to clipboard!')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    // Check if 2FA is enabled
    const is2FAEnabled = statusData?.enabled || false

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-7xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6 sm:p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        Two-Factor Authentication
                    </h1>

                    {/* Status Info */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            2FA Status:
                            <span className={`ml-2 font-medium ${is2FAEnabled ? 'text-green-600' : 'text-yellow-600'}`}>
                                {is2FAEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                        </p>
                        {is2FAEnabled && statusData?.backup_status && (
                            <div className="mt-2 text-sm text-gray-600">
                                <p>Backup Codes: <span className="font-medium">{statusData.backup_status.remaining}/{statusData.backup_status.total} remaining</span></p>
                            </div>
                        )}
                    </div>

                    {/* Show Backup Codes Modal */}
                    {showBackupCodes && (
                        <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                            <h2 className="text-lg font-semibold text-green-900 mb-2">
                                ✅ 2FA Enabled Successfully!
                            </h2>
                            <p className="text-sm text-green-800 mb-4">
                                Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
                            </p>

                            <div className="bg-white p-4 rounded border border-green-300 mb-4">
                                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                                    {backupCodes.map((code, idx) => (
                                        <div key={idx} className="text-gray-700">{code}</div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={downloadBackupCodes}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    Download Codes
                                </button>
                                <button
                                    onClick={copyBackupCodes}
                                    className="px-4 py-2 bg-white border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
                                >
                                    Copy to Clipboard
                                </button>
                                <button
                                    onClick={() => setShowBackupCodes(false)}
                                    className="ml-auto px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Enable 2FA Section */}
                    {!is2FAEnabled && !setupData && (
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h3 className="font-medium text-blue-900 mb-2">
                                    Enhance Your Account Security
                                </h3>
                                <p className="text-sm text-blue-800">
                                    Two-factor authentication adds an extra layer of security to your account by requiring a verification code from your authenticator app.
                                </p>
                            </div>

                            <button
                                onClick={handleSetup2FA}
                                disabled={actionLoading}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                            >
                                {actionLoading ? 'Setting up...' : 'Enable Two-Factor Authentication'}
                            </button>
                        </div>
                    )}

                    {/* Setup QR Code Section */}
                    {setupData && (
                        <div className="space-y-6">
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <h3 className="font-medium text-yellow-900 mb-2">
                                    Step 1: Scan QR Code
                                </h3>
                                <p className="text-sm text-yellow-800">
                                    Use your authenticator app (Google Authenticator, Authy, etc.) to scan this QR code.
                                </p>
                            </div>

                            <div className="flex justify-center p-6 bg-white border-2 border-gray-200 rounded-lg">
                                <Image
                                    src={`data:image/png;base64,${setupData.qr_code_base64}`}
                                    alt="2FA QR Code"
                                    width={256}
                                    height={256}
                                    className="w-64 h-64"
                                />
                            </div>

                            <form onSubmit={handleVerify2FA} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Step 2: Enter Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        value={verifyToken}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                                            setVerifyToken(value)
                                            setVerifyError('')
                                        }}
                                        placeholder="000000"
                                        maxLength={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                                    />
                                    {verifyError && (
                                        <p className="mt-2 text-sm text-red-600">{verifyError}</p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={actionLoading || verifyToken.length !== 6}
                                        className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                                    >
                                        {actionLoading ? 'Verifying...' : 'Verify and Enable 2FA'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSetupData(null)
                                            setVerifyToken('')
                                            setVerifyError('')
                                        }}
                                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Disable 2FA Section */}
                    {is2FAEnabled && !showDisableModal && (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h3 className="font-medium text-green-900 mb-2">
                                    ✅ Two-Factor Authentication is Active
                                </h3>
                                <p className="text-sm text-green-800">
                                    Your account is protected with an additional layer of security.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowDisableModal(true)}
                                className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
                            >
                                Disable Two-Factor Authentication
                            </button>
                        </div>
                    )}

                    {/* Disable Modal */}
                    {showDisableModal && (
                        <div className="space-y-4">
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <h3 className="font-medium text-red-900 mb-2">
                                    ⚠️ Disable Two-Factor Authentication
                                </h3>
                                <p className="text-sm text-red-800">
                                    Disabling 2FA will make your account less secure. Enter a verification code from your authenticator app to confirm.
                                </p>
                            </div>

                            <form onSubmit={handleDisable2FA} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        value={disableToken}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                                            setDisableToken(value)
                                            setDisableError('')
                                        }}
                                        placeholder="000000"
                                        maxLength={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                                    />
                                    {disableError && (
                                        <p className="mt-2 text-sm text-red-600">{disableError}</p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={actionLoading || disableToken.length !== 6}
                                        className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                                    >
                                        {actionLoading ? 'Disabling...' : 'Confirm Disable 2FA'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowDisableModal(false)
                                            setDisableToken('')
                                            setDisableError('')
                                        }}
                                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="mt-6 bg-white shadow rounded-lg p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About Two-Factor Authentication
                    </h2>
                    <div className="space-y-3 text-sm text-gray-600">
                        <p>
                            Two-factor authentication (2FA) requires you to provide a verification code from your authenticator app in addition to your password when logging in.
                        </p>
                        <p>
                            <strong>Recommended authenticator apps:</strong>
                        </p>
                        <ul className="list-disc list-inside pl-4 space-y-1">
                            <li>Google Authenticator</li>
                            <li>Microsoft Authenticator</li>
                            <li>Authy</li>
                            <li>1Password</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}