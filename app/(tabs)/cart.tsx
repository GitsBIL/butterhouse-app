import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CartItemCard from "../../components/CartItemCard";
import { useShop } from "../../context/ShopContext";

export default function CartScreen() {
  const { cart, updateCartQty, removeFromCart, fetchCart } = useShop();
  const router = useRouter();

  // Tarik data keranjang dari API saat halaman aktif
  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = cart.reduce((sum, item) => {
    const harga = item.product?.productPrice || 0;
    return sum + harga * item.quantity;
  }, 0);

  // Tambahan UI: Simulasi Pajak 10% biar mirip desain premium
  const tax = subtotal * 0.10;
  const total = subtotal + tax;

  // Tampilan ketika keranjang kosong (Empty State Premium)
  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <MaterialIcons name="shopping-basket" size={80} color="#E6E2DD" style={{ marginBottom: 20 }} />
          <Text style={styles.emptyTitle}>Your Basket is Empty</Text>
          <Text style={styles.emptyText}>Looks like you haven't added any fresh pastries yet.</Text>
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/" })}
            style={styles.shopBtn}
          >
            <Text style={styles.shopBtnText}>Explore Pastries</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Basket</Text>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CartItemCard
            item={item}
            onUpdateQty={updateCartQty}
            onRemove={removeFromCart}
          />
        )}
        ListFooterComponent={
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>Rp {subtotal.toLocaleString("id-ID")}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (10%)</Text>
              <Text style={styles.summaryValue}>Rp {tax.toLocaleString("id-ID")}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>Rp {total.toLocaleString("id-ID")}</Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push({ pathname: "/checkout" })}
              style={styles.checkoutBtn}
            >
              <Text style={styles.checkoutBtnText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FDF9F4" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#FDF9F4",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#92400E", // Warna cokelat sekunder
    fontStyle: "italic",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  
  // Empty State Styles
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDF9F4",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#594232",
    marginBottom: 8,
  },
  emptyText: { 
    color: "#735948", 
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  shopBtn: {
    backgroundColor: "#D97706",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  shopBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
  
  // Order Summary Styles
  summaryBox: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 16,
    marginTop: 16,
    shadowColor: "#594232",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C19",
    marginBottom: 20,
    fontStyle: "italic",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: { color: "#735948", fontSize: 14 },
  summaryValue: { color: "#594232", fontSize: 14, fontWeight: "500" },
  divider: {
    height: 1,
    backgroundColor: "#E6E2DD",
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  totalLabel: { color: "#594232", fontSize: 16, fontWeight: "bold" },
  totalPrice: { fontSize: 18, fontWeight: "bold", color: "#92400E" },
  checkoutBtn: {
    backgroundColor: "#D97706",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutBtnText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});