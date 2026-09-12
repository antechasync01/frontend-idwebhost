import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows } from '../styles/colors';

const consultations = [
  { title: 'Analisis Restock Mingguan', time: 'Baru saja', active: true },
  { title: 'Sesi Audit Selisih Stok Toko', time: 'Kemarin' },
  { title: 'Evaluasi Margin Supplier Wings', time: '3 hari lalu' },
  { title: 'Prediksi Penjualan Akhir Bulan', time: '1 minggu lalu' },
];

const HermesAIScreen = () => {
  const [inputText, setInputText] = useState('');

  return (
    <View style={styles.container}>
      {/* Left Panel - Consultations */}
      <View style={styles.leftPanel}>
        <View style={styles.leftHeader}>
          <Text style={styles.leftTitle}>KONSULTASI AKTIF</Text>
          <TouchableOpacity>
            <i className="fa-solid fa-plus" style={{ fontSize: 16, color: colors.primary }} />
          </TouchableOpacity>
        </View>
        {consultations.map((c, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.consultItem, c.active && styles.consultItemActive]}
          >
            {c.active && <View style={styles.consultActiveBar} />}
            <Text style={[styles.consultTitle, c.active && styles.consultTitleActive]}>{c.title}</Text>
            <Text style={styles.consultTime}>{c.time}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Right - Chat Area */}
      <View style={styles.chatArea}>
        <ScrollView style={styles.chatScroll} showsVerticalScrollIndicator={false}>
          {/* User Message */}
          <View style={styles.userMessageRow}>
            <View style={styles.userMessage}>
              <Text style={styles.userMessageText}>
                Analisis tren penjualan mingguan dan identifikasi produk yang perlu restock segera.
              </Text>
              <Text style={styles.messageTime}>14:40</Text>
            </View>
          </View>

          {/* AI Response */}
          <View style={styles.aiResponseRow}>
            <View style={styles.aiAvatar}>
              <Text style={styles.aiAvatarText}>H</Text>
            </View>
            <Text style={styles.aiLabel}>Hermes AI Engine</Text>
          </View>

          {/* Observasi */}
          <View style={styles.aiSection}>
            <Text style={styles.aiSectionTitle}>OBSERVASI HERMES</Text>
            <Text style={styles.aiSectionText}>
              Penjualan kategori "Sembako" (Minyak Goreng & Beras) meningkat sebesar 18.5% dalam 3 hari terakhir akibat promo lokal. Namun, frekuensi pasokan dari supplier Wings terhambat karena keterlambatan logistik. Ada risiko kehabisan stok kritis untuk 2 SKU utama.
            </Text>
          </View>

          {/* Bukti & Data */}
          <View style={styles.aiSection}>
            <Text style={styles.aiSectionTitle}>BUKTI & SUMBER DATA</Text>
            <View style={styles.dataTable}>
              <View style={styles.dataTableHeader}>
                <Text style={[styles.dtH, { flex: 2 }]}>PRODUK</Text>
                <Text style={[styles.dtH, { flex: 1 }]}>STOK KINI</Text>
                <Text style={[styles.dtH, { flex: 1.2 }]}>PREDIKSI OUT (HARI)</Text>
              </View>
              <View style={styles.dataTableRow}>
                <Text style={[styles.dtD, { flex: 2 }]}>Bimoli Minyak Goreng 2L</Text>
                <Text style={[styles.dtD, styles.dtDanger, { flex: 1 }]}>3 Unit</Text>
                <Text style={[styles.dtD, styles.dtDanger, { flex: 1.2 }]}>1.2 Hari lagi</Text>
              </View>
              <View style={styles.dataTableRow}>
                <Text style={[styles.dtD, { flex: 2 }]}>Indomie Mie Goreng 85g</Text>
                <Text style={[styles.dtD, styles.dtDanger, { flex: 1 }]}>15 Unit</Text>
                <Text style={[styles.dtD, styles.dtDanger, { flex: 1.2 }]}>1.8 Hari lagi</Text>
              </View>
            </View>
          </View>

          {/* Confidence */}
          <View style={styles.confidenceRow}>
            <Text style={styles.confidenceLabel}>TINGKAT KEPERCAYAAN REKOMENDASI:</Text>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>TINGGI (96% AKURASI)</Text>
            </View>
          </View>

          {/* Rencana Aksi */}
          <View style={[styles.aiSection, styles.aiSectionAction]}>
            <Text style={[styles.aiSectionTitle, { color: colors.primary }]}>RENCANA AKSI & REKOMENDASI RESTOCK</Text>
            <Text style={styles.aiSectionText}>
              1. Buat PO ke <Text style={styles.boldText}>PT Unilever Indonesia Tbk</Text> untuk Bimoli 2L sebanyak <Text style={styles.boldText}>5 Karton</Text>.
            </Text>
            <Text style={styles.aiSectionText}>
              2. Buat PO ke <Text style={styles.boldText}>PT Indofood CBP</Text> untuk Indomie Goreng sebanyak <Text style={styles.boldText}>10 Karton</Text>.
            </Text>
          </View>
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputArea}>
          <View style={styles.inputBar}>
            <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: 16, color: colors.primary, marginRight: 12 }} />
            <TextInput
              style={styles.chatInput}
              placeholder='Tanya Hermes... (contoh: "Prediksikan penjualan akhir pekan ini")'
              placeholderTextColor={colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity style={styles.sendButton}>
              <i className="fa-solid fa-arrow-right" style={{ fontSize: 16, color: '#FFFFFF' }} />
            </TouchableOpacity>
          </View>
          <View style={styles.disclaimer}>
            <i className="fa-solid fa-circle-info" style={{ fontSize: 12, color: colors.textMuted, marginRight: 6 }} />
            <Text style={styles.disclaimerText}>
              Hermes hanya memberikan rekomendasi operasional. Tidak ada akses atau aksi mutasi langsung ke database minimarket.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  // Left Panel
  leftPanel: {
    width: 280,
    backgroundColor: colors.cardBg,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    padding: spacing.base,
  },
  leftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.base,
  },
  leftTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    letterSpacing: 0.5,
  },
  consultItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: 4,
    position: 'relative',
  },
  consultItemActive: {
    backgroundColor: colors.primaryLight,
  },
  consultActiveBar: {
    position: 'absolute',
    right: 0,
    top: 10,
    bottom: 10,
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  consultTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  consultTitleActive: {
    fontWeight: fonts.weights.semibold,
    color: colors.primary,
  },
  consultTime: {
    fontSize: fonts.sizes.sm,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  // Chat
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  chatScroll: {
    flex: 1,
    padding: spacing.xl,
  },
  userMessageRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.xl,
  },
  userMessage: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    borderBottomRightRadius: 4,
    padding: spacing.base,
    maxWidth: '60%',
  },
  userMessageText: {
    fontSize: fonts.sizes.base,
    color: '#FFFFFF',
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: fonts.sizes.xs,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: fonts.regular,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  aiResponseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: '#FFFFFF',
    fontFamily: fonts.regular,
  },
  aiLabel: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  // AI Sections
  aiSection: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiSectionAction: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  aiSectionTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.primary,
    fontFamily: fonts.regular,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  aiSectionText: {
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  boldText: {
    fontWeight: fonts.weights.bold,
  },
  // Data table inside AI
  dataTable: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  dataTableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dtH: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    letterSpacing: 0.3,
  },
  dataTableRow: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  dtD: {
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
  },
  dtDanger: {
    color: colors.danger,
    fontWeight: fonts.weights.semibold,
  },
  // Confidence
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confidenceLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    letterSpacing: 0.3,
  },
  confidenceBadge: {
    backgroundColor: colors.successBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  confidenceText: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.success,
    fontFamily: fonts.regular,
  },
  // Input Area
  inputArea: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  chatInput: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    outlineStyle: 'none',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    justifyContent: 'center',
  },
  disclaimerText: {
    fontSize: fonts.sizes.xs,
    color: colors.textMuted,
    fontFamily: fonts.regular,
  },
});

export default HermesAIScreen;
