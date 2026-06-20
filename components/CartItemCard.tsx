import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CartItem } from "../context/ShopContext";

// Interface untuk properti yang diterima oleh CartItemCard
interface CartItemCardProps {
  item: CartItem;
  onUpdateQty: (cartId: number, qty: number) => void;
  onRemove: (cartId: number) => void;
}

export default function CartItemCard({ item, onUpdateQty, onRemove }: CartItemCardProps) {
  return (
    <View style={styles.cartCard} testID={`cart-item-card-${item.id}`}>
      
      {/* 1. Gambar Produk ala Desain Stich */}
      <View style={styles.imageContainer}>
        {item.product?.productImage ? (
          <Image 
            source={{ uri: item.product?.productImage }} 
            style={styles.image} 
            resizeMode="cover" 
          />
        ) : (
          <MaterialIcons name="image" size={24} color="#A89F91" />
        )}
      </View>

      {/* 2. Informasi Detail Produk */}
      <View style={styles.cartInfo}>
        <Text style={styles.cartName} numberOfLines={2}>
          {item.product?.productName || "Unknown Pastry"}
        </Text>
        <Text style={styles.cartPrice}>
          Rp {((item.product?.productPrice || 0) * item.quantity).toLocaleString("id-ID")}
        </Text>
      </View>

      {/* 3. Kontrol Kuantitas & Hapus (Action Row) */}
      <View style={styles.actionRow}>
        
        {/* Kapsul Kuantitas (+ / -) */}
        <View style={styles.qtyWrapper}>
          <TouchableOpacity
            onPress={() => onUpdateQty(item.id, item.quantity - 1)}
            style={styles.qtyActionBtn}
            testID={`btn-decrease-${item.id}`}
          >
            <Text style={styles.qtyActionText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.qtyText} testID={`qty-text-${item.id}`}>
            {item.quantity}
          </Text>

          <TouchableOpacity
            onPress={() => onUpdateQty(item.id, item.quantity + 1)}
            style={styles.qtyActionBtn}
            testID={`btn-increase-${item.id}`}
          >
            <Text style={styles.qtyActionText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Ikon Hapus (Tong Sampah Merah) */}
        <TouchableOpacity
          onPress={() => onRemove(item.id)}
          style={styles.deleteBtn}
          testID={`btn-delete-${item.id}`}
        >
          <MaterialIcons name="delete-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartCard: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    // Shadow estetik halus
    shadowColor: "#594232",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: "#E6E2DD",
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cartInfo: { 
    flex: 1, 
    paddingRight: 8,
    justifyContent: "center"
  },
  cartName: { 
    fontWeight: "600", 
    color: "#594232", 
    fontSize: 15,
    marginBottom: 4,
  },
  cartPrice: {
    color: "#735948",
    fontSize: 14,
  },
  actionRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  qtyWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F0EB", // Warna krem lembut
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginRight: 12,
  },
  qtyActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qtyActionText: { 
    fontSize: 16, 
    fontWeight: "500", 
    color: "#594232" 
  },
  qtyText: { 
    minWidth: 20,
    textAlign: "center",
    fontSize: 14, 
    fontWeight: "600",
    color: "#1C1C19",
  },
  deleteBtn: {
    padding: 4,
  },
});