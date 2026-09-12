import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import { PRODUCTS, CATEGORIES } from '../constants/products';
import { useCart } from '../context/CartContext';
import { productApi } from '../api/productApi';
import Header from '../components/Header';
import BarcodeScanner from '../components/BarcodeScanner';
import CategoryTabs from '../components/CategoryTabs';
import ProductGrid from '../components/ProductGrid';
import ActiveOrder from '../components/ActiveOrder';
import CashPaymentModal from '../components/CashPaymentModal';
import ConfirmModal from '../components/ConfirmModal';
import ProductDetailModal from '../components/ProductDetailModal';
import CameraScannerModal from '../components/CameraScannerModal';

const POSScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('Semua Produk');
  const [productsList, setProductsList] = useState(PRODUCTS);
  const [categoriesList, setCategoriesList] = useState(CATEGORIES);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { addItem, items, total, totalItems, orderId, clearCart } = useCart();

  useEffect(() => {
    loadBackendData();
  }, []);

  const loadBackendData = async () => {
    try {
      // Fetch categories from backend
      const catsRes = await productApi.getCategories().catch(() => null);
      if (catsRes && Array.isArray(catsRes)) {
        const catNames = catsRes.map((c) => c.name);
        const uniqueCats = Array.from(new Set(['Semua Produk', ...catNames, ...CATEGORIES]));
        setCategoriesList(uniqueCats);
      }

      // Fetch active products from backend
      const prodsRes = await productApi.getProducts({ limit: 100 }).catch(() => null);
      if (prodsRes && Array.isArray(prodsRes)) {
        const backendMapped = prodsRes.map((p) => ({
          id: p.id,
          backendId: p.id,
          name: p.name,
          sku: p.sku || `SKU-${(p.gtin || '').slice(-6)}`,
          barcode: p.gtin,
          gtin: p.gtin,
          price: p.selling_price || 0,
          costPrice: p.purchase_price || 0,
          category: p.category_name || 'Bahan Pokok & Makanan',
          status: p.status === 'ACTIVE' ? 'NORMAL' : p.status || 'NORMAL',
          unit: p.unit || 'pcs',
          brand: p.brand || 'AURA',
          isBackend: true,
        }));

        // Keep local products (such as 9556001295248) that are not already present in backend
        const backendGtins = new Set(backendMapped.map((p) => p.barcode).filter(Boolean));
        const remainingLocal = PRODUCTS.filter((lp) => !backendGtins.has(lp.barcode));

        setProductsList([...backendMapped, ...remainingLocal]);
      }
    } catch (err) {
      console.log('POSScreen backend load error:', err.message);
    }
  };

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Semua Produk') return productsList;
    return productsList.filter((p) => p.category === activeCategory);
  }, [activeCategory, productsList]);

  const handleProductPress = (product) => {
    if (product.status !== 'OUT OF STOCK') {
      addItem(product);
    }
  };

  const handleProductLongPress = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleBarcodeScan = async (barcode) => {
    if (!barcode) return;
    const cleanBarcode = String(barcode).trim();

    // 1. Search in-memory list
    const product = productsList.find((p) => p.barcode === cleanBarcode || p.gtin === cleanBarcode);
    if (product) {
      if (product.status !== 'OUT OF STOCK') {
        addItem(product);
      }
      return;
    }

    // 2. Query backend by GTIN
    try {
      const backendProd = await productApi.getProductByGtin(cleanBarcode);
      if (backendProd) {
        const mapped = {
          id: backendProd.id,
          backendId: backendProd.id,
          name: backendProd.name,
          sku: backendProd.sku || `SKU-${(backendProd.gtin || '').slice(-6)}`,
          barcode: backendProd.gtin,
          gtin: backendProd.gtin,
          price: backendProd.selling_price || 0,
          costPrice: backendProd.purchase_price || 0,
          category: backendProd.category_name || 'Umum',
          status: backendProd.status === 'ACTIVE' ? 'NORMAL' : backendProd.status || 'NORMAL',
          unit: backendProd.unit || 'pcs',
          brand: backendProd.brand || 'AURA',
          isBackend: true,
        };
        setProductsList((prev) => [mapped, ...prev.filter((p) => p.barcode !== cleanBarcode)]);
        addItem(mapped);
      }
    } catch (err) {
      console.log('Product GTIN search error:', err.message);
    }
  };

  const handleEndShift = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmEndShift = () => {
    setShowConfirmModal(false);
    if (navigation) {
      navigation.navigate('CashierClosing');
    }
  };

  const handleNewTransaction = () => {
    clearCart();
    setShowPaymentModal(false);
  };

  const handleCameraBarcodeDetected = (productOrCode) => {
    if (typeof productOrCode === 'object' && productOrCode.name) {
      if (productOrCode.status !== 'OUT OF STOCK') {
        addItem(productOrCode);
      }
    } else if (typeof productOrCode === 'string') {
      handleBarcodeScan(productOrCode);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        onEndShift={handleEndShift}
        showEndShift={true}
      />

      <View style={styles.body}>
        {/* Left: Products */}
        <ScrollView
          style={styles.productsSection}
          contentContainerStyle={styles.productsContent}
          showsVerticalScrollIndicator={false}
        >
          <BarcodeScanner
            onScan={handleBarcodeScan}
            onSearch={handleBarcodeScan}
            onOpenCamera={() => setShowCameraScanner(true)}
          />
          <CategoryTabs
            categories={categoriesList}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
          <ProductGrid
            products={filteredProducts}
            onProductPress={handleProductPress}
            onProductLongPress={handleProductLongPress}
          />
        </ScrollView>

        {/* Right: Active Order */}
        <View style={styles.orderSection}>
          <ActiveOrder onPayPress={() => setShowPaymentModal(true)} />
        </View>
      </View>

      {/* Modals */}
      <CashPaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={total}
        totalItems={totalItems}
        orderId={orderId}
        cartItems={items}
        onNewTransaction={handleNewTransaction}
      />

      <ConfirmModal
        visible={showConfirmModal}
        onConfirm={handleConfirmEndShift}
        onCancel={() => setShowConfirmModal(false)}
      />

      <ProductDetailModal
        visible={showProductDetail}
        product={selectedProduct}
        onClose={() => setShowProductDetail(false)}
      />

      <CameraScannerModal
        visible={showCameraScanner}
        onClose={() => setShowCameraScanner(false)}
        onBarcodeDetected={handleCameraBarcodeDetected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPage,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    gap: 20,
  },
  productsSection: {
    flex: 2,
  },
  productsContent: {
    paddingBottom: 20,
  },
  orderSection: {
    flex: 0.85,
  },
});

export default POSScreen;
