
export interface PinCheckResponse {
    success: boolean
    message: string
    data: {
        has_pin: boolean
    }
}

export interface PinActionResponse {
    success: boolean
    message: string
    data: {
        pin_exists: boolean
    }
}

export interface CreatePinPayload {
    pin: string
    password: string
}

export interface UpdatePinPayload {
    old_pin: string
    new_pin: string
    password: string
}

export interface DeletePinPayload {
    pin: string
    password: string
}