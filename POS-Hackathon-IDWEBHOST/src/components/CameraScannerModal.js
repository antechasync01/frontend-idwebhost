import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCamera,
  faXmark,
  faCircleCheck,
  faRotate,
  faBarcode,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import Colors from '../constants/colors';
import { playScannerBeep } from '../utils/scannerSound';
import PRODUCTS from '../constants/products';
import { productApi } from '../api/productApi';

const SCANNER_CONTAINER_ID = 'aura-camera-scanner-viewport';

const CameraScannerModal = ({ visible, onClose, onBarcodeDetected, products = [] }) => {
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastScanned, setLastScanned] = useState(null);
  const [scannedCount, setScannedCount] = useState(0);
  const [flashSuccess, setFlashSuccess] = useState(false);

  const scannerRef = useRef(null);
  const lastScanTimestampRef = useRef(0);
  const lastScanCodeRef = useRef('');

  const initCameras = async () => {
    try {
      setErrorMessage('');
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          // Trigger browser camera permission prompt so device labels (DroidCam) are exposed
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach((track) => track.stop());
        } catch (permErr) {
          console.warn('Camera permission check:', permErr);
        }
      }

      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setCameras(devices);
        const droidCam = devices.find((d) =>
          d.label.toLowerCase().includes('droidcam')
        );
        const initialId = droidCam ? droidCam.id : devices[0].id;
        setSelectedCameraId(initialId);
      } else {
        setErrorMessage('Tidak ada kamera terdeteksi. Pastikan DroidCam aktif lalu klik Coba Lagi.');
      }
    } catch (err) {
      console.error('Error fetching cameras:', err);
      setErrorMessage(
        'Izin kamera belum aktif atau DroidCam belum menyala. Silakan izinkan akses kamera di browser lalu klik Coba Lagi.'
      );
    }
  };

  // Enumerate cameras when modal opens
  useEffect(() => {
    if (!visible) {
      stopCamera();
      return;
    }

    initCameras();

    return () => {
      stopCamera();
    };
  }, [visible]);

  // Start scanning when camera is selected
  useEffect(() => {
    if (visible && selectedCameraId) {
      startCamera(selectedCameraId);
    }
  }, [visible, selectedCameraId]);

  const startCamera = async (cameraId) => {
    try {
      setErrorMessage('');
      await stopCamera();

      // Ensure container element is ready in DOM
      const element = document.getElementById(SCANNER_CONTAINER_ID);
      if (!element) {
        setTimeout(() => startCamera(cameraId), 150);
        return;
      }

      const html5QrCode = new Html5Qrcode(SCANNER_CONTAINER_ID);
      scannerRef.current = html5QrCode;

      const formatsToSupport = [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.QR_CODE,
      ];

      const config = {
        fps: 12,
        qrbox: { width: 320, height: 180 },
        aspectRatio: 1.333333,
        formatsToSupport,
      };

      await html5QrCode.start(
        cameraId,
        config,
        (decodedText) => {
          handleBarcodeDetected(decodedText);
        },
        () => {
          // Frame read fail/in-progress, normal behavior
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error('Failed to start camera scanner:', err);
      setIsScanning(false);
      setErrorMessage(
        'Gagal menyalakan video stream kamera. Pastikan DroidCam sudah menyala dan klik Restart Stream.'
      );
    }
  };

  const stopCamera = async () => {
    try {
      const current = scannerRef.current;
      scannerRef.current = null;
      if (current) {
        if (current.isScanning) {
          await current.stop();
        }
        try {
          current.clear();
        } catch (clearErr) {}
      }
      setIsScanning(false);
    } catch (err) {
      // ignore transition warnings
    }
  };

  const handleBarcodeDetected = (rawCode) => {
    const code = (rawCode || '').trim();
    if (!code) return;

    const now = Date.now();
    // Cooldown 1.5 seconds for identical barcode to prevent accidental rapid repeat
    if (
      code === lastScanCodeRef.current &&
      now - lastScanTimestampRef.current < 1500
    ) {
      return;
    }

    lastScanCodeRef.current = code;
    lastScanTimestampRef.current = now;

    // Trigger supermarket scanner sound
    playScannerBeep();

    // Visual green flash
    setFlashSuccess(true);
    setTimeout(() => setFlashSuccess(false), 800);

    // Look up product in catalog (check active products list first)
    const allProducts = products && products.length > 0 ? products : PRODUCTS;
    const matched = allProducts.find(
      (p) =>
        p.barcode === code ||
        p.gtin === code ||
        (p.sku && p.sku.toLowerCase() === code.toLowerCase())
    );

    if (matched) {
      setLastScanned({
        barcode: code,
        product: matched,
        time: new Date().toLocaleTimeString('id-ID'),
      });
      setScannedCount((prev) => prev + 1);
      if (onBarcodeDetected) {
        onBarcodeDetected(matched);
      }
      return;
    }

    // Try backend GTIN query if not found locally
    productApi
      .getProductByGtin(code)
      .then((backendProd) => {
        let productInfo;
        if (backendProd) {
          productInfo = {
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
        } else {
          productInfo = {
            id: `scan_${code}`,
            sku: `SKU-${code.slice(-6)}`,
            barcode: code,
            name: `Produk Barcode: ${code}`,
            price: 10000,
            stock: 50,
            status: 'NORMAL',
            category: 'Scan Langsung',
          };
        }

        setLastScanned({
          barcode: code,
          product: productInfo,
          time: new Date().toLocaleTimeString('id-ID'),
        });
        setScannedCount((prev) => prev + 1);
        if (onBarcodeDetected) {
          onBarcodeDetected(productInfo);
        }
      })
      .catch(() => {
        const fallbackInfo = {
          id: `scan_${code}`,
          sku: `SKU-${code.slice(-6)}`,
          barcode: code,
          name: `Produk Barcode: ${code}`,
          price: 10000,
          stock: 50,
          status: 'NORMAL',
          category: 'Scan Langsung',
        };
        setLastScanned({
          barcode: code,
          product: fallbackInfo,
          time: new Date().toLocaleTimeString('id-ID'),
        });
        setScannedCount((prev) => prev + 1);
        if (onBarcodeDetected) {
          onBarcodeDetected(fallbackInfo);
        }
      });
  };

  const handleManualTestScan = (product) => {
    handleBarcodeDetected(product.barcode);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.cameraIconBox}>
                <FontAwesomeIcon icon={faCamera} size={18} color={Colors.primaryBlue} />
              </View>
              <View>
                <Text style={styles.title}>Scanner Barcode Kamera (DroidCam)</Text>
                <Text style={styles.subtitle}>
                  Arahkan barcode ke kamera. Produk otomatis masuk ke Active Order.
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <FontAwesomeIcon icon={faXmark} size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Camera Selection Controls */}
          <View style={styles.controlsRow}>
            <View style={styles.selectWrapper}>
              <Text style={styles.selectLabel}>SUMBER KAMERA:</Text>
              {Platform.OS === 'web' ? (
                <select
                  value={selectedCameraId}
                  onChange={(e) => setSelectedCameraId(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#0F172A',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    maxWidth: '340px',
                    cursor: 'pointer',
                  }}
                >
                  {cameras.map((cam) => {
                    const isDroidCam = cam.label.toLowerCase().includes('droidcam');
                    return (
                      <option key={cam.id} value={cam.id}>
                        {isDroidCam ? '📷 [DroidCam] ' : '📹 '}
                        {cam.label || `Kamera ${cam.id.slice(0, 8)}`}
                      </option>
                    );
                  })}
                </select>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={() => {
                if (selectedCameraId) startCamera(selectedCameraId);
              }}
            >
              <FontAwesomeIcon icon={faRotate} size={13} color={Colors.primaryBlue} />
              <Text style={styles.refreshBtnText}>Restart Stream</Text>
            </TouchableOpacity>
          </View>

          {/* Error Notice */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <FontAwesomeIcon icon={faTriangleExclamation} size={15} color={Colors.red} />
              <View style={{ flex: 1 }}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
              <TouchableOpacity style={styles.retryBtn} onPress={initCameras}>
                <Text style={styles.retryBtnText}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Live Viewport Box */}
          <View
            style={[
              styles.viewportContainer,
              flashSuccess && styles.viewportContainerSuccess,
            ]}
          >
            {/* HTML5 QR Scanner container element */}
            <div
              id={SCANNER_CONTAINER_ID}
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                borderRadius: '12px',
              }}
            />

            {/* Scan Reticle & Laser Line Overlay */}
            <View style={styles.reticleOverlay} pointerEvents="none">
              <View style={styles.reticleBox}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
                <View style={styles.laserLine} />
              </View>
            </View>

            {/* Status Pill Badge */}
            <View style={styles.statusPill}>
              <View style={styles.statusDotLive} />
              <Text style={styles.statusPillText}>
                {isScanning ? 'KAMERA LIVE • SIAP SCAN' : 'MENGHUBUNGKAN...'}
              </Text>
            </View>
          </View>

          {/* Success Banner: Last Scanned Product */}
          {lastScanned && (
            <View style={styles.successBanner}>
              <View style={styles.successIconBox}>
                <FontAwesomeIcon icon={faCircleCheck} size={18} color={Colors.green} />
              </View>
              <View style={styles.successDetails}>
                <Text style={styles.successProductName}>
                  ✓ Masuk Order: {lastScanned.product.name}
                </Text>
                <Text style={styles.successProductMeta}>
                  Barcode: {lastScanned.barcode} • Rp {lastScanned.product.price.toLocaleString('id-ID')} • Pukul {lastScanned.time}
                </Text>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{scannedCount} Item</Text>
              </View>
            </View>
          )}

          {/* Quick Presets / Test Barcodes */}
          <View style={styles.testSection}>
            <Text style={styles.testSectionTitle}>
              ⚡ Uji Cepat Barcode Produk (Simulasi Kamera):
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.testChipsRow}
            >
              {PRODUCTS.filter(p => ['13', '1', '2', '3', '4', '6'].includes(p.id)).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.testChip}
                  onPress={() => handleManualTestScan(item)}
                >
                  <FontAwesomeIcon icon={faBarcode} size={12} color={Colors.primaryBlue} />
                  <Text style={styles.testChipText}>{item.name.split(' ')[0]} ({item.barcode.slice(-4)})</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* DroidCam Connection Tips */}
          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>📱 Panduan DroidCam:</Text>
            <Text style={styles.tipText}>
              1. Buka aplikasi DroidCam di HP (Android/iOS) dan software DroidCam Client di Windows.
            </Text>
            <Text style={styles.tipText}>
              2. Sambungkan via WiFi IP atau USB. Di dropdown atas, pilih "DroidCam Source".
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 620,
    maxHeight: '92%',
    borderWidth: 1,
    borderColor: Colors.border,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cameraIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primaryBlueBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: Colors.bgPage,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  selectLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  refreshBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryBlue,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.redBg,
    borderWidth: 1,
    borderColor: Colors.redLight,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: Colors.redText,
    fontWeight: '600',
    flex: 1,
  },
  retryBtn: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.red,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginLeft: 8,
  },
  retryBtnText: {
    color: Colors.redText,
    fontSize: 11,
    fontWeight: '700',
  },
  viewportContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  viewportContainerSuccess: {
    borderColor: Colors.green,
    boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)',
  },
  reticleOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticleBox: {
    width: 280,
    height: 150,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    position: 'relative',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderColor: '#00A3FF',
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  laserLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#EF4444',
    boxShadow: '0 0 8px #EF4444',
  },
  statusPill: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusDotLive: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#22C55E',
  },
  statusPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.greenBg,
    borderWidth: 1.5,
    borderColor: Colors.greenBorder,
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    gap: 12,
  },
  successIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successDetails: {
    flex: 1,
  },
  successProductName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#14532D',
  },
  successProductMeta: {
    fontSize: 11,
    color: '#15803D',
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  testSection: {
    marginTop: 14,
  },
  testSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  testChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  testChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bgPage,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  testChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tipBox: {
    backgroundColor: Colors.bgPage,
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 2,
  },
  tipTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryBlue,
    marginBottom: 2,
  },
  tipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});

export default CameraScannerModal;
