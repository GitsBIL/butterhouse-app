import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useShop } from "../../context/ShopContext";

export default function ProfileScreen() {
  const { logout, user, purchases, fetchPurchases } = useShop();
  const router = useRouter();

  useEffect(() => {
    fetchPurchases();
  }, []);

  const namaUser = user?.name || "Nabil Putra Alamsyah";
  const emailUser = user?.email || "nabil.alamsyah@example.com";
  
  const orderCount = purchases.length;
  const totalSpent = purchases.reduce((sum, p) => sum + p.totalPrice, 0);
  const completedOrders = purchases.filter((p) => {
    const s = p.status?.toLowerCase() || "";
    return s === "selesai" || s === "completed" || s === "success";
  }).length;

  // --- FUNGSI BANTUAN (WHATSAPP REDIRECT) ---
  const handleBantuan = () => {
    // Nomor WA dummy (bisa lu ganti nomor lu sendiri kalau mau ngetes)
    const phoneNumber = "6281234567890"; 
    const message = "Halo CS ButterHouse, saya butuh bantuan terkait pesanan saya.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Error", "Aplikasi WhatsApp tidak ditemukan di perangkat ini.");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {namaUser.split(" ")[0]}</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{namaUser.substring(0, 2).toUpperCase()}</Text>
          </View>
          
          <Text style={styles.name}>{namaUser}</Text>
          <Text style={styles.email}>{emailUser}</Text>
          
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Club Member</Text>
          </View>
          
          <Text style={styles.tagline}>Enjoying freshly baked goodness since 2025</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{orderCount}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Rp {totalSpent.toLocaleString("id-ID")}</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akun Saya</Text>
          
          <View style={styles.menuContainer}>
            {/* 1. Riwayat Pembelian (Sudah Jalan) */}
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/history")}>
              <View style={styles.menuIconBox}>
                <MaterialIcons name="receipt-long" size={24} color="#735948" />
              </View>
              <View style={styles.menuTextContent}>
                <Text style={styles.menuTitle}>Riwayat Pembelian</Text>
                <Text style={styles.menuSubtitle}>
                  {completedOrders > 0 ? `${completedOrders} pesanan selesai` : "Belum ada pesanan selesai"}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#D5C3B6" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* 2. Alamat Pengiriman (Akan Diarahkan ke halaman baru) */}
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/address")}>
              <View style={styles.menuIconBox}>
                <MaterialIcons name="location-on" size={24} color="#735948" />
              </View>
              <View style={styles.menuTextContent}>
                <Text style={styles.menuTitle}>Alamat Pengiriman</Text>
                <Text style={styles.menuSubtitle}>Atur lokasi pengiriman</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#D5C3B6" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* 3. Bantuan (Buka WhatsApp) */}
            <TouchableOpacity style={styles.menuItem} onPress={handleBantuan}>
              <View style={styles.menuIconBox}>
                <MaterialIcons name="help-outline" size={24} color="#735948" />
              </View>
              <View style={styles.menuTextContent}>
                <Text style={styles.menuTitle}>Bantuan</Text>
                <Text style={styles.menuSubtitle}>Pusat bantuan pelanggan (WA)</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#D5C3B6" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionContainer}>
          {/* 4. Edit Profile (Akan Diarahkan ke halaman baru) */}
          <TouchableOpacity style={styles.editBtn} onPress={() => router.push("/edit-profile")}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>

          {/* 5. Sign Out (Sudah Jalan) */}
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FDF9F4" },
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 16 },
  greeting: { fontSize: 28, fontWeight: "bold", color: "#594232" },
  profileCard: {
    backgroundColor: "#FFFFFF", marginHorizontal: 20, borderRadius: 24, padding: 24,
    alignItems: "center", marginBottom: 32, shadowColor: "#594232", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06, shadowRadius: 16, elevation: 3,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: "#6F4315",
    alignItems: "center", justifyContent: "center", marginBottom: 16,
  },
  avatarText: { color: "#FFFFFF", fontSize: 28, fontWeight: "bold" },
  name: { fontSize: 20, fontWeight: "bold", color: "#1C1C19", marginBottom: 4 },
  email: { fontSize: 14, color: "#735948", marginBottom: 12 },
  badge: { backgroundColor: "#F5E6D3", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginBottom: 16 },
  badgeText: { color: "#A25F15", fontSize: 12, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.5 },
  tagline: { fontSize: 12, color: "#837469", fontStyle: "italic", marginBottom: 24, textAlign: "center" },
  statsRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#F4F0EB", paddingTop: 20, width: "100%" },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 16, fontWeight: "bold", color: "#594232", marginBottom: 4 },
  statLabel: { fontSize: 12, color: "#A89F91" },
  statDivider: { width: 1, backgroundColor: "#F4F0EB" },
  section: { paddingHorizontal: 20, marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1C1C19", marginBottom: 16, paddingLeft: 4 },
  menuContainer: { backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: "#E6E2DD", overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 16 },
  menuIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: "#FDF9F4", alignItems: "center", justifyContent: "center", marginRight: 16 },
  menuTextContent: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: "bold", color: "#594232", marginBottom: 2 },
  menuSubtitle: { fontSize: 12, color: "#A89F91" },
  menuDivider: { height: 1, backgroundColor: "#F4F0EB", marginLeft: 72 },
  actionContainer: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  editBtn: { backgroundColor: "#6F4315", paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  editBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
  logoutBtn: { alignItems: "center", paddingVertical: 12 },
  logoutText: { color: "#EF4444", fontSize: 15, fontWeight: "600" },
});