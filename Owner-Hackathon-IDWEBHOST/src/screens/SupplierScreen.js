import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/colors';
import { StatusBadge } from '../components/DataTable';

const suppliers = [
  { name: 'PT Indofood CBP Sukses M...', kontak: 'Budi Santoso', telepon: '0811928374', email: 'sales@indofood.com', produk: '45 SKU', status: 'AKTIF' },
  { name: 'PT Unilever Indonesia Tbk', kontak: 'Siti Rahma', telepon: '0812837492', email: 'b2b@unilever.co.id', produk: '112 SKU', status: 'AKTIF' },
  { name: 'PT Wings Surya', kontak: 'Hendra Wijaya', telepon: '0813928172', email: 'order@wingscorp.com', produk: '68 SKU', status: 'AKTIF' },
  { name: 'PT Mayora Indah Tbk', kontak: 'Diana Lestari', telepon: '0811728391', email: 'diana@mayora.co.id', produk: '32 SKU', status: 'AKTIF' },
  { name: 'PT Frisian Flag Indonesia', kontak: 'Agus Setiawan', telepon: '0812928311', email: 'frisian@ff.co.id', produk: '18 SKU', status: 'NONAKTIF' },
  { name: 'CV Sinar Pangan', kontak: 'Yanto Kusuma', telepon: '0852839182', email: 'sinarpangan@gmail.co...', produk: '14 SKU', status: 'AKTIF' },
  { name: 'PT Nestle Indonesia', kontak: 'Rina Amelia', telepon: '0811239482', email: 'nestle@b2b.nestle.id', produk: '29 SKU', status: 'AKTIF' },
];

const SupplierScreen = () => {
  const [showPanel, setShowPanel] = useState(true);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Daftar Supplier Utama</Text>
            <Text style={styles.pageSubtitle}>Hubungan langsung dan pengadaan produk minimarket</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowPanel(true)}>
            <i className="fa-solid fa-plus" style={{ fontSize: 14, color: '#FFFFFF', marginRight: 8 }} />
            <Text style={styles.addButtonText}>Tambah Supplier</Text>
          </TouchableOpacity>
        </View>

        {/* Table */}
        <View style={styles.tableContainer}>
          {/* Header row */}
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 1.8 }]}>NAMA SUPPLIER</Text>
            <Text style={[styles.th, { flex: 1.2 }]}>KONTAK PERSON</Text>
            <Text style={[styles.th, { flex: 1 }]}>TELEPON</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>EMAIL</Text>
            <Text style={[styles.th, { flex: 0.8 }]}>PRODUK TERKAIT</Text>
            <Text style={[styles.th, { flex: 0.7 }]}>STATUS</Text>
            <Text style={[styles.th, { flex: 0.5 }]}>AKSI</Text>
          </View>
          {suppliers.map((s, idx) => (
            <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowEven]}>
              <Text style={[styles.td, styles.tdBold, { flex: 1.8 }]}>{s.name}</Text>
              <Text style={[styles.td, { flex: 1.2 }]}>{s.kontak}</Text>
              <Text style={[styles.td, { flex: 1 }]}>{s.telepon}</Text>
              <Text style={[styles.td, { flex: 1.5 }]}>{s.email}</Text>
              <View style={{ flex: 0.8, justifyContent: 'center' }}>
                <View style={styles.skuBadge}>
                  <Text style={styles.skuBadgeText}>{s.produk}</Text>
                </View>
              </View>
              <View style={{ flex: 0.7, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <StatusBadge status={s.status} />
                <i className="fa-regular fa-comment" style={{ fontSize: 14, color: colors.textMuted }} />
              </View>
              <View style={{ flex: 0.5, justifyContent: 'center' }}>
                <TouchableOpacity>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Side Panel */}
      {showPanel && (
        <View style={styles.sidePanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Tambah Supplier Baru</Text>
            <TouchableOpacity onPress={() => setShowPanel(false)}>
              <i className="fa-solid fa-xmark" style={{ fontSize: 18, color: colors.textSecondary }} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nama Perusahaan</Text>
              <TextInput style={styles.formInput} defaultValue="PT Indomilk Indonesia" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nama Kontak (PIC)</Text>
              <TextInput style={styles.formInput} defaultValue="Yusuf Wijaya" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>No. Telepon / WhatsApp</Text>
              <TextInput style={styles.formInput} defaultValue="081293847291" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email</Text>
              <TextInput style={styles.formInput} defaultValue="yusuf@indomilk.com" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Alamat Kantor</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                defaultValue="Jl. Sudirman Kav. 21, Jakarta Selatan"
                multiline
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Hubungkan Kategori Produk</Text>
              <View style={styles.tagsRow}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Susu & Olahan Dairy</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Minuman Dingin</Text>
                </View>
                <TouchableOpacity style={styles.tagAdd}>
                  <Text style={styles.tagAddText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowPanel(false)}>
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Simpan Supplier</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  mainContent: {
    flex: 1,
    padding: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  pageTitle: {
    fontSize: fonts.sizes.xxl,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  pageSubtitle: {
    fontSize: fonts.sizes.base,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: '#FFFFFF',
    fontFamily: fonts.regular,
  },
  // Table
  tableContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  th: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    alignItems: 'center',
  },
  tableRowEven: {
    backgroundColor: '#FAFBFC',
  },
  td: {
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  tdBold: {
    fontWeight: fonts.weights.semibold,
  },
  skuBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
    alignSelf: 'flex-start',
  },
  skuBadgeText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.primary,
    fontFamily: fonts.regular,
  },
  editText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  // Side Panel
  sidePanel: {
    width: 320,
    backgroundColor: colors.cardBg,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    padding: spacing.lg,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  panelTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  formGroup: {
    marginBottom: spacing.base,
  },
  formLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginBottom: spacing.xs,
  },
  formInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    backgroundColor: colors.cardBg,
    outlineStyle: 'none',
  },
  formTextArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  tagText: {
    fontSize: fonts.sizes.sm,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  tagAdd: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagAddText: {
    fontSize: fonts.sizes.lg,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  formActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  saveButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: '#FFFFFF',
    fontFamily: fonts.regular,
  },
});

export default SupplierScreen;
