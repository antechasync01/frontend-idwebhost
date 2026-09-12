// AURA SMART POS - Sales & Checkout API Services
import { apiClient } from './client';

export const salesApi = {
  // Submit cash sale transaction
  createSale: async (saleData) => {
    // saleData: { items: [{ product_id, quantity, unit_price }], cash_paid, payment_method: "CASH", idempotency_key }
    return apiClient('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  },

  // Get receipt details by receipt number
  getReceipt: async (receiptNumber) => {
    return apiClient(`/sales/receipt/${encodeURIComponent(receiptNumber)}`);
  },

  // List recent sales
  listSales: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.start_date) query.append('start_date', params.start_date);
    if (params.end_date) query.append('end_date', params.end_date);
    query.append('skip', String(params.skip || 0));
    query.append('limit', String(params.limit || 20));
    const qs = query.toString();
    return apiClient(`/sales${qs ? `?${qs}` : ''}`);
  },
};

export default salesApi;
