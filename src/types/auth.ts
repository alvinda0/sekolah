// types/auth.ts

// User Type
export interface User {
  user_id: string
  name: string
  role_name: string
  partner_id: string
  platform_id: string
  agent_id: string
  is_internal: boolean
  is_verified: boolean
  is_2fa: boolean
  pin: string | null
}

// Login Types
export interface LoginCredentials {
  email: string
  password: string
}

// API Response Types
export interface LoginResponse {
  success: boolean
  message: string
  data: {
    token?: string
    requires_two_fa?: boolean
    user_id?: string
    method?: string
  }
}

export interface UserResponse {
  success: boolean
  message: string
  data: User
}

// Two Factor Authentication Types
export interface VerifyTwoFactorPayload {
  user_id: string
  token: string
}

export interface TwoFactorResponse {
  success: boolean
  message: string
  data: {
    token: string
  }
}

// Change Password Types
export interface ChangePasswordPayload {
  current_password: string
  new_password: string
}

export interface ChangePasswordResponse {
  success: boolean
  message: string
}

// Forgot Password Types
export interface ForgotPasswordPayload {
  email: string
}

export interface ForgotPasswordResponse {
  success: boolean
  message: string
}

// Reset Password Types
export interface ResetPasswordPayload {
  email: string
  otp: string
  new_password: string
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}