import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import { CATEGORIES } from '../constants/products';

const CategoryTabs = ({ categories = CATEGORIES, activeCategory, onSelectCategory }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {categories.map((category) => {
        const isActive = category === activeCategory;
        return (
          <TouchableOpacity
            key={category}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onSelectCategory(category)}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    maxHeight: 42,
  },
  content: {
    gap: 8,
    paddingVertical: 2,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  tabActive: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  tabTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
});

export default CategoryTabs;
