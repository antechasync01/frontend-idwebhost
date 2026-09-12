import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faTriangleExclamation,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import Colors from '../constants/colors';

const ConfirmModal = ({ visible, onConfirm, onCancel, title = 'Are you sure?', message = "this action can't be undone. please confirm if you want to proceed" }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeBtnTop} onPress={onCancel}>
            <FontAwesomeIcon icon={faXmark} size={14} color={Colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              size={40}
              color={Colors.primaryBlue}
            />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <FontAwesomeIcon icon={faCheck} size={14} color={Colors.primaryBlue} />
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <FontAwesomeIcon icon={faXmark} size={14} color={Colors.white} />
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: 380,
    maxWidth: '85%',
    padding: 32,
    alignItems: 'center',
  },
  closeBtnTop: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  confirmBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primaryBlue,
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: Colors.primaryBlue,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});

export default ConfirmModal;
