// AURA SMART POS - Shift Closing & Cash Reconciliation API Services
import { apiClient } from './client.js';

export const closingApi = {
  // Get closing status for today
  getTodayStatus: async () => {
    return apiClient('/closing/today');
  },

  // Get cash closing summary based on opening cash
  getCashSummary: async (openingCash = 0) => {
    return apiClient(`/closing/cash/summary?opening_cash=${encodeURIComponent(openingCash)}`);
  },

  // Submit physical cash count and reconciliation
  submitCashClosing: async (closingData) => {
    // closingData: { opening_cash, actual_cash, cash_adjustment, adjustment_notes, notes }
    return apiClient('/closing/cash', {
      method: 'POST',
      body: JSON.stringify(closingData),
    });
  },

  // Finalize closing
  finalizeDailyClosing: async () => {
    return apiClient('/closing/daily/finalize', {
      method: 'POST',
    });
  },
};

export default closingApi;
