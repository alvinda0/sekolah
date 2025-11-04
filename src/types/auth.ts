// types/auth.ts

// User Type
export interface User {
  role: string
  user_id: number
  username: string
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