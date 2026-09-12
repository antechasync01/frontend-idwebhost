// AURA SMART POS - Products & Categories API Services
import { apiClient } from './client';

export const productApi = {
  // Get list of categories from backend
  getCategories: async () => {
    return apiClient('/products/categories');
  },

  // Get list of active products from backend
  getProducts: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.query) query.append('query', params.query);
    if (params.category_id) query.append('category_id', params.category_id);
    if (params.status) query.append('status', params.status);
    query.append('skip', String(params.skip || 0));
    query.append('limit', String(params.limit || 50));

    const qs = query.toString();
    return apiClient(`/products${qs ? `?${qs}` : ''}`);
  },

  // Lookup product directly by barcode / GTIN (used by DroidCam scanner)
  getProductByGtin: async (gtin) => {
    try {
      return await apiClient(`/products/gtin/${encodeURIComponent(gtin)}`);
    } catch (err) {
      if (err.status === 404) return null;
      throw err;
    }
  },

  // Get product by UUID
  getProductById: async (productId) => {
    return apiClient(`/products/${productId}`);
  },
};

export default productApi;
