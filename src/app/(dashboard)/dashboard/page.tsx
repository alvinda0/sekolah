"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthMe } from '@/hooks/useAuthMe'

const DashboardPage = () => {
  const router = useRouter()
  const { data: user, isLoading } = useAuthMe()

  useEffect(() => {
    if (isLoading) {
      console.log('Dashboard: Still loading user data...')
      return
    }

    if (!user) {
      console.log('Dashboard: No user data, redirecting to login')
      router.replace('/auth/login')
      return
    }

    console.log('Dashboard: User loaded with role:', user.role)

    // Define roles and their destinations
    const roleRedirects = {
      'system_admin': '/dashboard/owner',

      'student': '/dashboard/staff',
      'teacher': '/dashboard/owner'
    }

    // Get redirect path based on role
    const redirectPath = roleRedirects[user.role as keyof typeof roleRedirects]

    if (redirectPath) {
      console.log(`Dashboard: Redirecting ${user.role} to ${redirectPath}`)
      // Small delay to prevent race conditions
      setTimeout(() => {
        router.replace(redirectPath)
      }, 100)
    } else {
      // If role not recognized, redirect to login
      console.warn(`Dashboard: Unknown role: ${user.role}`)
      localStorage.removeItem('token')
      router.replace('/auth/login')
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