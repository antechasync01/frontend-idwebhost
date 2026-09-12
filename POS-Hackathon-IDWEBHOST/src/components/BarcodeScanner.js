import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBarcode, faMagnifyingGlass, faCamera } from '@fortawesome/free-solid-svg-icons';
import Colors from '../constants/colors';

const BarcodeScanner = ({ onSearch, onScan, onOpenCamera }) => {
  const [barcode, setBarcode] = useState('8992224011234');

  const handleSearch = () => {
    if (onSearch) onSearch(barcode);
  };

  const handleSubmit = () => {
    if (onScan) onScan(barcode);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Barcode Scanner & Manual Search Input</Text>
        <TouchableOpacity style={styles.headerCameraLink} onPress={onOpenCamera}>
          <FontAwesomeIcon icon={faCamera} size={12} color={Colors.primaryBlue} />
          <Text style={styles.headerCameraLinkText}>Mode Kamera Aktif</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faBarcode} size={20} color={Colors.textSecondary} style={styles.barcodeIcon} />
          <TextInput
            style={styles.input}
            value={barcode}
            onChangeText={setBarcode}
            onSubmitEditing={handleSubmit}
            placeholder="Scan atau ketik barcode..."
            placeholderTextColor={Colors.textMuted}
          />
          <View style={styles.scanBadge}>
            <Text style={styles.scanBadgeText}>SCAN READY</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} title="Cari Barcode">
          <FontAwesomeIcon icon={faMagnifyingGlass} size={18} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.cameraBtn} onPress={onOpenCamera} activeOpacity={0.85}>
          <FontAwesomeIcon icon={faCamera} size={16} color={Colors.white} />
          <Text style={styles.cameraBtnText}>Scan DroidCam</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  headerCameraLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryBlueBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  headerCameraLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryBlue,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: Colors.white,
  },
  barcodeIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
    outlineStyle: 'none',
  },
  scanBadge: {
    backgroundColor: Colors.greenBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.greenBorder,
  },
  scanBadgeText: {
    color: Colors.green,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  searchBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  cameraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primaryBlue,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  cameraBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
});

export default BarcodeScanner;
