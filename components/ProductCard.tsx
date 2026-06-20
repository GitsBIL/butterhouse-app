import React from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Product } from "../context/ShopContext";

const { width } = Dimensions.get("window");
// Lebar default untuk grid 2 kolom
const defaultCardWidth = (width - 52) / 2;

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  isBestSeller?: boolean; // Parameter untuk nentuin dia best seller atau bukan
  customWidth?: number;   // Parameter buat ngatur lebar khusus (buat horizontal scroll)
}

export default function ProductCard({ 
  product, 
  onPress, 
  isBestSeller = false, 
  customWidth 
}: ProductCardProps) {
  
  const cardWidth = customWidth || defaultCardWidth;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.productCard, { width: cardWidth }]}
      testID={`product-card-${product.id}`}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {product.productImage ? (
          <Image 
            source={{ uri: product.productImage }} 
            style={styles.image} 
            resizeMode="cover" 
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>No Image</Text>
          </View>
        )}

        {/* Badge Best Seller HANYA muncul kalau isBestSeller == true */}
        {isBestSeller && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>BEST SELLER</Text>
          </View>
        )}
      </View>

      <Text style={styles.productName} numberOfLines={1}>
        {product.productName}
      </Text>
      <Text style={styles.productPrice}>
        Rp {product.productPrice.toLocaleString("id-ID")}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productCard: {
    marginBottom: 24,
    marginRight: 12, // Jarak kanan biar aman pas di horizontal scroll
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1, 
    borderRadius: 12, 
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#E6E2DD",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E6E2DD",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: { color: "#837469", fontSize: 11 },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FDF9F4",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: "#D97706", 
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1, 
  },
  productName: { 
    fontWeight: "bold", 
    color: "#594232", 
    fontSize: 15, 
    marginBottom: 4 
  },
  productPrice: {
    color: "#735948", 
    fontSize: 14,
  },
});