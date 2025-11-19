// types/auth.ts

// User Type
export interface User {
  id: number
  username: string
  email: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
  name?: string // Optional untuk backward compatibility
  role_name?: string // Optional untuk backward compatibility
}


// Login Types
export interface LoginCredentials {
  email: string
  password: string
}

// API Response Types
export interface LoginResponse {
  status: number
  message: string
  data: {
    token: string
    expires_at: string
  }
}

export interface UserResponse {
  status: number
  message: string
  data: User
}

// Change Password Types
export interface ChangePasswordPayload {
  current_password: string
  new_password: string
}

export interface ChangePasswordResponse {
  status: number
  message: string
}

// Forgot Password Types
export interface ForgotPasswordPayload {
  email: string
}

export interface ForgotPasswordResponse {
  status: number
  message: string
}

// Reset Password Types
export interface ResetPasswordPayload {
  email: string
  otp: string
  new_password: string
}

export interface ResetPasswordResponse {
  status: number
  message: string
}