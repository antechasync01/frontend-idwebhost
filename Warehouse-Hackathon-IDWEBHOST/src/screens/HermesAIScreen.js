import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../styles/colors';
import { useResponsive } from '../context/ResponsiveContext';
import { useWarehouse } from '../context/WarehouseContext';

const HermesAIScreen = ({ onNavigate }) => {
  const { isMobile, isTablet } = useResponsive();
  const { handleCreatePo, showToast } = useWarehouse();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'hermes',
      time: '14:40',
      observation:
        'Penjualan kategori "Sembako" (Minyak Goreng & Beras) serta "Makanan Instan" meningkat sebesar 18.5% dalam 3 hari terakhir. Pasokan stok Minyak Goreng Bimoli 2L dan Teh Botol Sosro di gudang tersisa sedikit dan berisiko habis total dalam 36-48 jam ke depan.',
      evidence: [
        { name: 'Minyak Goreng Bimoli 2 Liter', stock: '35 pcs (Display)', daysOut: '1.2 Hari lagi' },
        { name: 'Teh Botol Sosro Kotak 250ml', stock: '15 pcs (Display)', daysOut: '1.8 Hari lagi' },
        { name: 'Indomie Goreng Spesial 85g', stock: '120 pcs (Display)', daysOut: '3.5 Hari lagi' },
      ],
      confidence: 'TINGGI (96% AKURASI)',
      actions: [
        {
          supplier: 'PT Salim Ivomas Pratama',
          desc: 'Buat PO ke PT Salim Ivomas Pratama untuk Minyak Goreng Bimoli 2L sebanyak 120 Pouch.',
          items: [{ name: 'Minyak Goreng Bimoli 2 Liter', qty: 120, price: 34000 }],
        },
        {
          supplier: 'PT Sinar Sosro',
          desc: 'Buat PO ke PT Sinar Sosro untuk Teh Botol Sosro Kotak 250ml sebanyak 10 Karton (240 pcs).',
          items: [{ name: 'Teh Botol Sosro Kotak 250ml', qty: 240, price: 2500 }],
        },
      ],
    },
  ]);

  const handleSendQuery = () => {
    if (!inputQuery.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputQuery,
      time: 'Baru saja',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Simulate AI Intelligence response
    setTimeout(() => {
      const aiReply = {
        id: Date.now() + 1,
        sender: 'hermes',
        time: 'Baru saja',
        observation:
          'Berdasarkan pola data transaksi kasir dan mutasi display 7 hari terakhir, permintaan akhir pekan diproyeksikan meningkat 22%. Disarankan melakukan transfer 48 pcs Indomie Goreng ke Display sebelum shift pagi besok.',
        evidence: [
          { name: 'Indomie Goreng Spesial', stock: '120 Disp / 480 Gdg', daysOut: 'Aman (7.5 Hari)' },
          { name: 'Aqua 600ml', stock: '40 Disp / 960 Gdg', daysOut: 'Transfer Disarankan Segera' },
        ],
        confidence: 'TINGGI (94% AKURASI)',
        actions: [
          {
            supplier: 'PT Tirta Investama',
            desc: 'Lakukan transfer display untuk Aqua 600ml dan siapkan pemesanan rutin bulanan.',
            items: [{ name: 'Aqua Air Mineral 600ml', qty: 480, price: 2200 }],
          },
        ],
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 800);
  };

  const handleTriggerPo = (action) => {
    handleCreatePo({
      supplier: action.supplier,
      category: 'Rekomendasi Hermes AI',
      items: action.items,
      totalCost: action.items.reduce((acc, i) => acc + i.price * i.qty, 0),
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiBadge}>
            <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#FFFFFF', fontSize: 14 }} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Hermes AI Engine & Decision Intelligence</Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              Sistem rekomendasi prediksi restock & deteksi anomali gudang
            </Text>
          </View>
        </View>
      </View>

      {/* Chat Messages Stream */}
      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map((m) => {
          if (m.sender === 'user') {
            return (
              <View key={m.id} style={styles.userMsgRow}>
                <View style={styles.userMsgBubble}>
                  <Text style={styles.userMsgText}>{m.text}</Text>
                  <Text style={styles.userMsgTime}>{m.time}</Text>
                </View>
              </View>
            );
          }

          return (
            <View key={m.id} style={styles.aiMsgCard}>
              <View style={styles.aiCardHeader}>
                <View style={styles.aiAvatar}>
                  <Text style={styles.aiAvatarText}>H</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.aiAgentName}>Hermes AI Intelligence Engine</Text>
                  <Text style={styles.aiTimestamp}>{m.time}</Text>
                </View>
                <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceText}>{m.confidence}</Text>
                </View>
              </View>

              {/* Observation */}
              <View style={styles.sectionBlock}>
                <Text style={styles.blockLabel}>OBSERVASI HERMES:</Text>
                <Text style={styles.observationText}>{m.observation}</Text>
              </View>

              {/* Evidence Table with Horizontal Scroll */}
              {m.evidence && (
                <View style={styles.sectionBlock}>
                  <Text style={styles.blockLabel}>BUKTI & SUMBER DATA MUTASI:</Text>
                  <View style={styles.evidenceTableWrap}>
                    <View style={styles.evidenceHeader}>
                      <Text style={[styles.evTh, { flex: 2 }]}>PRODUK</Text>
                      <Text style={[styles.evTh, { flex: 1.2 }]}>STOK KINI</Text>
                      <Text style={[styles.evTh, { flex: 1.2, textAlign: 'right' }]}>PREDIKSI OUT</Text>
                    </View>
                    {m.evidence.map((ev, idx) => (
                      <View key={idx} style={styles.evidenceRow}>
                        <Text style={[styles.evTdName, { flex: 2 }]}>{ev.name}</Text>
                        <Text style={[styles.evTdStock, { flex: 1.2 }]}>{ev.stock}</Text>
                        <Text style={[styles.evTdDays, { flex: 1.2 }]}>{ev.daysOut}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Actionable Recommendations with Direct Buttons */}
              {m.actions && (
                <View style={styles.sectionBlock}>
                  <Text style={styles.blockLabel}>RENCANA AKSI & REKOMENDASI RESTOCK:</Text>
                  <View style={styles.actionsList}>
                    {m.actions.map((act, idx) => (
                      <View key={idx} style={[styles.actionItemCard, isMobile && styles.actionItemCardMobile]}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.actionText}>{idx + 1}. {act.desc}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.btnActionPo}
                          onPress={() => handleTriggerPo(act)}
                          activeOpacity={0.8}
                        >
                          <i className="fa-solid fa-plus" style={{ color: '#FFFFFF', marginRight: 4, fontSize: 10 }} />
                          <Text style={styles.btnActionPoText}>Buat Draft PO</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          );
        })}

        {/* Disclaimer Note */}
        <View style={styles.disclaimerCard}>
          <i className="fa-solid fa-shield-halved" style={{ color: colors.textMuted, fontSize: 13 }} />
          <Text style={styles.disclaimerText}>
            Hermes hanya memberikan rekomendasi operasional. Tidak ada akses atau mutasi langsung ke database minimarket tanpa persetujuan manusia.
          </Text>
        </View>
      </ScrollView>

      {/* Input Prompt Section */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.chatInput}
            placeholder="Tanya Hermes... (contoh: 'Prediksikan restock mingguan')"
            value={inputQuery}
            onChangeText={setInputQuery}
            onSubmitEditing={handleSendQuery}
          />
          <TouchableOpacity style={styles.btnSend} onPress={handleSendQuery}>
            <i className="fa-solid fa-arrow-up" style={{ color: '#FFFFFF', fontSize: 14 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.base,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  aiBadge: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
    padding: spacing.base,
  },
  userMsgRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.base,
  },
  userMsgBubble: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    maxWidth: '85%',
  },
  userMsgText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
  },
  userMsgTime: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
    marginTop: 4,
  },
  aiMsgCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.base,
    gap: spacing.base,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  },
  aiCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarText: {
    color: '#FFFFFF',
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
  },
  aiAgentName: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  aiTimestamp: {
    fontSize: 10,
    color: colors.textMuted,
  },
  confidenceBadge: {
    backgroundColor: colors.successBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
  },
  confidenceText: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
    color: colors.success,
  },
  sectionBlock: {
    gap: 4,
  },
  blockLabel: {
    fontSize: 10,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  observationText: {
    fontSize: fonts.sizes.xs,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  evidenceTableWrap: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    overflow: 'auto',
  },
  evidenceHeader: {
    flexDirection: 'row',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
    minWidth: 320,
  },
  evTh: {
    fontSize: 9,
    fontWeight: fonts.weights.bold,
    color: colors.textSecondary,
  },
  evidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    minWidth: 320,
  },
  evTdName: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.semibold,
    color: colors.textPrimary,
  },
  evTdStock: {
    fontSize: fonts.sizes.xs,
    color: colors.textSecondary,
  },
  evTdDays: {
    fontSize: fonts.sizes.xs,
    fontWeight: fonts.weights.bold,
    color: colors.warning,
    textAlign: 'right',
  },
  actionsList: {
    gap: spacing.xs,
  },
  actionItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: spacing.sm,
  },
  actionItemCardMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  actionText: {
    fontSize: fonts.sizes.xs,
    color: colors.primaryDark,
    fontWeight: fonts.weights.semibold,
    lineHeight: 18,
  },
  btnActionPo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  btnActionPoText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: fonts.weights.bold,
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.neutralBg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xxl,
  },
  disclaimerText: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
    flex: 1,
  },
  inputContainer: {
    padding: spacing.base,
    backgroundColor: colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  chatInput: {
    flex: 1,
    fontSize: fonts.sizes.sm,
    color: colors.textPrimary,
  },
  btnSend: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HermesAIScreen;
