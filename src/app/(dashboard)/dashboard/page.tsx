"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthMe } from '@/hooks/useAuthMe'

const DashboardPage = () => {
  const router = useRouter()
  const { data: user, isLoading } = useAuthMe()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push('/auth/login')
      return
    }

    // Define owner roles
    const ownerRoles = ['PartnerOwner', 'PlatformOwner', 'AgentOwner']
    const staffRoles = ['PlatformStaff', 'AgentStaff']

    // Redirect based on role
    if (ownerRoles.includes(user.role_name)) {
      router.push('/dashboard/owner')
    } else if (staffRoles.includes(user.role_name)) {
      router.push('/dashboard/staff')
    } else {
      // If role not recognized, redirect to login
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  // Loading state
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  )
}

export default DashboardPage