export interface Vendor {
    vendor_id: string;
    name: string;
    endpoint_url: string;
    sandbox_endpoint_url: string;
    created_at: string;
    updated_at: string;
}

export interface VendorResponse {
    success: boolean;
    message: string;
    data: Vendor[];
    metadata: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}