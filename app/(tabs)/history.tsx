import React, { useEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import OrderCard from "../../components/OrderCard";
import { useShop } from "../../context/ShopContext";

import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HistoryScreen() {
  const { purchases, fetchPurchases } = useShop();
  const router = useRouter();

  useEffect(() => {
    fetchPurchases();
  }, []);

  // Olah Data buat Ringkasan di Header
  const totalOrders = purchases.length;
  const totalSpent = purchases.reduce((sum, p) => sum + p.totalPrice, 0);
  const completedCount = purchases.filter((p) => {
    const s = p.status?.toLowerCase() || "";
    return s === "selesai" || s === "completed" || s === "success";
  }).length;
  const pendingCount = totalOrders - completedCount;

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Header dengan Personality */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color="#594232" />
        </TouchableOpacity>
        
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Riwayat Pembelian</Text>
          <Text style={styles.headerSubtitle}>Lihat pesanan dan pembelian sebelumnya.</Text>
        </View>
        
        <View style={{ width: 40 }} /> {/* Penyeimbang biar tengah */}
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Ringkasan Statistik Lebih Padat */}
        {totalOrders > 0 && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryMain}>
              {totalOrders} Pesanan • Rp {totalSpent.toLocaleString("id-ID")} Total
            </Text>
            <Text style={styles.summarySub}>
              {completedCount} Completed • {pendingCount} Pending
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        {/* Daftar Transaksi */}
        {purchases.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Belum ada riwayat pembelian.</Text>
          </View>
        ) : (
          purchases.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FDF9F4" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FDF9F4",
  },
  backBtn: { padding: 8 },
  headerTextContainer: { alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1C1C19", marginBottom: 2 },
  headerSubtitle: { fontSize: 12, color: "#837469" },
  
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  
  // Ringkasan Header Padat
  summaryContainer: {
    paddingHorizontal: 24,
    marginTop: 4,
    marginBottom: 16, // Jarak dikurangi biar hemat ruang
  },
  summaryMain: { fontSize: 15, fontWeight: "bold", color: "#594232", marginBottom: 4 },
  summarySub: { fontSize: 13, color: "#A89F91", fontWeight: "500" },
  
  divider: { height: 1, backgroundColor: "#E6E2DD", marginHorizontal: 24, marginBottom: 20 },
  
  emptyCard: { backgroundColor: "#F4F0EB", padding: 24, borderRadius: 12, alignItems: "center", marginHorizontal: 24 },
  emptyText: { color: "#837469", fontStyle: "italic" },
});