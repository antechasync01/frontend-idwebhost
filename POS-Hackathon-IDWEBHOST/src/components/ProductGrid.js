import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onProductPress, onProductLongPress }) => {
  // Create rows of 3 items
  const rows = [];
  for (let i = 0; i < products.length; i += 3) {
    rows.push(products.slice(i, i + 3));
  }

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((product) => (
            <View key={product.id} style={styles.cardWrapper}>
              <ProductCard
                product={product}
                onPress={onProductPress}
                onLongPress={onProductLongPress}
              />
            </View>
          ))}
          {/* Fill empty slots to maintain grid */}
          {row.length < 3 &&
            Array.from({ length: 3 - row.length }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.cardWrapper} />
            ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
  },
});

export default ProductGrid;
