// types/disbursement-merchant.ts

export interface DisbursementMerchant {
  disbursement_id: string;
  merchant_id: string;
  merchant_name: string;
  amount: number;
  bank_name: string;
  bank_code: string;
  account_name: string;
  account_number: string;
  status: string;
  type: string;
  admin_cost: number;
  total_disbursements: number;
  created_at: string;
  updated_at: string;
}

export interface CreateDisbursementMerchantRequest {
  merchant_id: string;
  amount: number;
  bank_merchant_id: string;
  type: string;
  pin?: string;
}

export interface DisbursementMerchantResponse {
  success: boolean;
  message: string;
  data: DisbursementMerchant[];
}

export interface SingleDisbursementMerchantResponse {
  success: boolean;
  message: string;
  data: DisbursementMerchant;
}