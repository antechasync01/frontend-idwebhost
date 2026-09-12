import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';

const tabs = ['Profil Toko', 'Pengguna', 'Pembayaran', 'Notifikasi'];

const PengaturanScreen = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        {tabs.map((tab, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.tab, activeTab === idx && styles.tabActive]}
            onPress={() => setActiveTab(idx)}
          >
            <Text style={[styles.tabText, activeTab === idx && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Form Content */}
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Profil Toko</Text>
        <Text style={styles.sectionSubtitle}>Atur identitas, kontak, dan operasional toko minimarket Anda.</Text>

        <View style={styles.formGrid}>
          <View style={styles.formRow}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nama Toko</Text>
              <TextInput style={styles.formInput} defaultValue="AURA Minimarket #01" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Alamat</Text>
              <TextInput style={styles.formInput} defaultValue="Jl. Sudirman Kav. 21, Jakarta Selatan" />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>No. Telepon</Text>
              <TextInput style={styles.formInput} defaultValue="0811-2345-6789" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email</Text>
              <TextInput style={styles.formInput} defaultValue="minimarket@aura.id" />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Jam Operasional</Text>
              <TextInput style={styles.formInput} defaultValue="07:00 - 22:00 WIB" />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Logo Toko</Text>
              <View style={styles.logoInput}>
                <TextInput style={[styles.formInput, { flex: 1, borderWidth: 0 }]} defaultValue="aura-logo.png" editable={false} />
                <TouchableOpacity style={styles.changeButton}>
                  <Text style={styles.changeButtonText}>Ganti</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: fonts.weights.semibold,
  },
  formCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  sectionSubtitle: {
    fontSize: fonts.sizes.base,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginTop: 4,
    marginBottom: spacing.xl,
  },
  formGrid: {
    gap: spacing.lg,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  formGroup: {
    flex: 1,
  },
  formLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    marginBottom: spacing.sm,
  },
  formInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    backgroundColor: colors.cardBg,
    outlineStyle: 'none',
  },
  logoInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  changeButton: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  changeButtonText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.base,
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  saveButtonText: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: '#FFFFFF',
    fontFamily: fonts.regular,
  },
});

export default PengaturanScreen;
