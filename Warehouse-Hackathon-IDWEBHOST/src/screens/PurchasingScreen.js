import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, Pressable } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';
import { useResponsive } from '../context/ResponsiveContext';
import { useWarehouse } from '../context/WarehouseContext';
import AccessDenied from '../components/AccessDenied';

const PurchasingScreen = () => {
  const { isMobile } = useResponsive();
  const {
    purchaseOrders,
    userRole,
    products,
    handleCreatePo,
    showToast,
  } = useWarehouse();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [poSupplier, setPoSupplier] = useState('PT Indofood CBP Sukses Makmur');
  const [poCategory, setPoCategory] = useState('Makanan Instan & Sembako');
  const [poItems, setPoItems] = useState([
    { name: 'Indomie Goreng Spesial 85g', qty: 240, price: 2800 },
    { name: 'Minyak Goreng Bimoli 2 Liter', qty: 60, price: 34000 },
  ]);

  // RBAC Guard
  if (userRole === 'WAREHOUSE_STAFF') {
    return <AccessDenied requiredRole="WAREHOUSE_ADMIN" />;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RECEIVED':
        return { bg: colors.successBg, text: colors.success, label: 'DITERIMA' };
      case 'IN_TRANSIT':
        return { bg: colors.infoBg, text: colors.info, label: 'DALAM PENGIRIMAN' };
      case 'SUBMITTED':
        return { bg: colors.warningBg, text: colors.warning, label: 'DIAJUKAN' };
      case 'DRAFT':
        return { bg: colors.neutralBg, text: colors.neutral, label: 'DRAFT' };
      default:
        return { bg: colors.neutralBg, text: colors.neutral, label: status };
    }
  };

  const handleAddItem = () => {
    setPoItems([...poItems, { name: products[0]?.name || 'Produk', qty: 50, price: 5000 }]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...poItems];
    updated[index][field] = field === 'qty' || field === 'price' ? parseInt(value, 10) || 0 : value;
    setPoItems(updated);
  };

  const totalPoCost = poItems.reduce((acc, i) => acc + (i.price * i.qty), 0);

  const handleSubmitPo = () => {
    handleCreatePo({
      supplier: poSupplier,
      category: poCategory,
      items: poItems,
      totalCost: totalPoCost,
    });
    setIsCreateModalOpen(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Create PO Modal */}
      {isCreateModalOpen && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setIsCreateModalOpen(false)}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.backdrop} onPress={() => setIsCreateModalOpen(false)} />
            <View style={[styles.modalCard, isMobile && styles.modalCardMobile]}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Buat Purchase Order (PO) Baru</Text>
                  <Text style={styles.modalSubtitle}>Pengajuan restock resmi ke Supplier rekanan minimarket</Text>
                </View>
                <TouchableOpacity onPress={() => setIsCreateModalOpen(false)}>
                  <i className="fa-solid fa-xmark" style={{ fontSize: 16, color: colors.textMuted }} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>PILIH SUPPLIER</Text>
                  <select
                    style={styles.selectInput}
                    value={poSupplier}
                    onChange={(e) => setPoSupplier(e.target.value)}
                  >
                    <option value="PT Indofood CBP Sukses Makmur">PT Indofood CBP Sukses Makmur</option>
                    <option value="PT Unilever Indonesia Tbk">PT Unilever Indonesia Tbk</option>
                    <option value="PT Salim Ivomas Pratama">PT Salim Ivomas Pratama (Bimoli)</option>
                    <option value="PT Tirta Investama">PT Tirta Investama (Aqua)</option>
                    <option value="PT Sinar Sosro">PT Sinar Sosro</option>
                  </select>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>KATEGORI PENGADAAN</Text>
                  <TextInput
                    style={styles.textInput}
                    value={poCategory}
                    onChangeText={setPoCategory}
                  />
                </View>

                <View style={styles.itemsSection}>
                  <View style={styles.itemsSecHeader}>
                    <Text style={styles.label}>ITEM BARANG YANG DIPESAN</Text>
                    <TouchableOpacity style={styles.btnAddItem} onPress={handleAddItem}>
                      <i className="fa-solid fa-plus" style={{ fontSize: 10, color: colors.primary, marginRight: 4 }} />
                      <Text style={styles.btnAddItemText}>Tambah Baris</Text>
                    </TouchableOpacity>
                  </View>

                  {poItems.map((item, idx) => (
                    <View key={idx} style={styles.itemRow}>
                      <TextInput
                        style={[styles.textInput, { flex: 2 }]}
                        value={item.name}
                        onChangeText={(val) => handleItemChange(idx, 'name', val)}
                        placeholder="Nama Produk"
                      />
                      <TextInput
                        style={[styles.textInput, { flex: 0.8 }]}
                        keyboardType="number-pad"
                        value={item.qty.toString()}
                        onChangeText={(val) => handleItemChange(idx, 'qty', val)}
                        placeholder="Qty"
                      />
                      <TextInput
                        style={[styles.textInput, { flex: 1.2 }]}
                        keyboardType="number-pad"
                        value={item.price.toString()}
                        onChangeText={(val) => handleItemChange(idx, 'price', val)}
                        placeholder="Harga Beli"
                      />
                    </View>
                  ))}
                </View>

                <View style={styles.totalBox}>
                  <Text style={styles.totalBoxLabel}>ESTIMASI TOTAL BIAYA PO:</Text>
                  <Text style={styles.totalBoxVal}>Rp {totalPoCost.toLocaleString('id-ID')}</Text>
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.btnCancel} onPress={() => setIsCreateModalOpen(false)}>
                  <Text style={styles.btnCancelText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmitPo}>
                  <i className="fa-solid fa-paper-plane" style={{ color: '#FFFFFF', marginRight: 6 }} />
                  <Text style={styles.btnSubmitText}>Terbitkan Draft PO</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Page Header */}
      <View style={[styles.headerRow, isMobile && styles.headerRowMobile]}>
        <View>
          <Text style={styles.pageTitle}>Purchasing & Purchase Orders (PO)</Text>
          <Text style={styles.pageSubtitle}>
            Pengadaan barang, penerbitan PO supplier, dan pemantauan status pengiriman logistik
          </Text>
        </View>

        <TouchableOpacity style={styles.btnCreatePo} onPress={() => setIsCreateModalOpen(true)}>
          <i className="fa-solid fa-plus" style={{ color: '#FFFFFF', marginRight: 6 }} />
          <Text style={styles.btnCreatePoText}>Buat Purchase Order Baru</Text>
        </TouchableOpacity>
      </View>

      {/* PO List Card */}
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderTitle}>Daftar Purchase Order ({purchaseOrders.length})</Text>
        </View>

        <View style={styles.poList}>
          {purchaseOrders.map((po) => {
            const sBadge = getStatusBadge(po.status);
            return (
              <View key={po.id} style={styles.poCard}>
                <View style={[styles.poCardTop, isMobile && styles.poCardTopMobile]}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.poBadgeRow}>
                      <Text style={styles.poNumberText}>{po.poNumber}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: sBadge.bg }]}>
                        <Text style={[styles.statusBadgeText, { color: sBadge.text }]}>{sBadge.label}</Text>
                      </View>
                    </View>
                    <Text style={styles.poSupplierName}>{po.supplier}</Text>
                    <Text style={styles.poCatText}>Kategori: {po.category}</Text>
                  </View>

                  <View style={styles.poMetaRight}>
                    <Text style={styles.poTotalCost}>Rp {po.totalCost.toLocaleString('id-ID')}</Text>
                    <Text style={styles.poItemsCount}>{po.totalItems} pcs total</Text>
                    <Text style={styles.poDateText}>Order: {po.orderDate} • Est: {po.deliveryDate}</Text>
                  </View>
                </View>

                <View style={styles.itemsPreview}>
                  {po.items.map((it, idx) => (
                    <Text key={idx} style={styles.itemPreviewText}>
                      • {it.name} ({it.qty} pcs)
                    </Text>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  headerRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  pageTitle: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
  },
  pageSubtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  btnCreatePo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
  },
  btnCreatePoText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
  },
  cardContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.xxxl,
  },
  cardHeader: {
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  cardHeaderTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  poList: {
    gap: spacing.sm,
  },
  poCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
  },
  poCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  poCardTopMobile: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  poBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  poNumberText: {
    fontSize: fonts.sizes.xs,
    fontFamily: fonts.mono,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
  },
  poSupplierName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  poCatText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  poMetaRight: {
    alignItems: 'flex-end',
  },
  poTotalCost: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.extrabold,
    color: colors.textPrimary,
  },
  poItemsCount: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  poDateText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  itemsPreview: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  itemPreviewText: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlayBg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.base,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCard: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '90vh',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    zIndex: 999,
  },
  modalCardMobile: {
    maxWidth: '100%',
    borderRadius: borderRadius.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  modalTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalBody: {
    padding: spacing.lg,
    gap: spacing.base,
  },
  fieldGroup: {
    gap: 4,
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  selectInput: {
    width: '100%',
    height: 38,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
    fontSize: fonts.sizes.sm,
    color: colors.textPrimary,
    outlineStyle: 'none',
    fontFamily: fonts.family,
  },
  textInput: {
    height: 38,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: fonts.sizes.sm,
    color: colors.textPrimary,
  },
  itemsSection: {
    marginTop: spacing.sm,
  },
  itemsSecHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  btnAddItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnAddItemText: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  totalBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalBoxLabel: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.primaryDark,
  },
  totalBoxVal: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.extrabold,
    color: colors.primary,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  btnCancel: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnCancelText: {
    fontSize: fonts.sizes.sm,
    color: colors.textSecondary,
    fontWeight: fonts.weights.semibold,
  },
  btnSubmit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  btnSubmitText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
  },
});

export default PurchasingScreen;
