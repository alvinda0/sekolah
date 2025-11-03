// types/credentials.ts
export interface AgentCredentials {
    agent_id: string;
    name: string;
    status: "ACTIVE" | "INACTIVE";
    api_key: string;
    secret_key: string;
    created_at: string;
    updated_at: string;
}

export interface AgentCredentialsResponse {
    success: boolean;
    message: string;
    data: AgentCredentials;
}

export interface MerchantCredentials {
    merchant_id: string;
    name: string;
    status: "ACTIVE" | "INACTIVE";
    environment: "LIVE" | "SANDBOX";
    prod_api_key: string;
    prod_callback_key: string;
    dev_api_key: string;
    dev_callback_key: string;
    merchant_token: string;
    created_at: string;
    updated_at: string;
}

export interface MerchantCredentialsResponse {
    success: boolean;
    message: string;
    data: {
        merchants: MerchantCredentials[];
        total: number;
    };
}