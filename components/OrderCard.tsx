import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Purchase, useShop } from "../context/ShopContext";

interface OrderCardProps {
  order: Purchase;
}

export default function OrderCard({ order }: OrderCardProps) {
  // Kita panggil daftar produk (JSON) lu yang udah ketarik otomatis sama sistem
  const { products } = useShop(); 
  const [isDetailVisible, setDetailVisible] = useState(false);

  // --- LOGIKA STATUS ---
  const statusLower = order.status?.toLowerCase() || "";
  const isPending = statusLower === "pending" || statusLower === "menunggu";
  const isCancelled = statusLower === "batal" || statusLower === "cancelled";
  
  let badgeBg = "#EAF8F1"; 
  let statusColor = "#10B981"; 
  let statusText = "Selesai";
  let statusIcon = "check-circle";

  if (isPending) {
    badgeBg = "#FFF4D6"; 
    statusColor = "#D97706"; 
    statusText = "Menunggu Pembayaran";
    statusIcon = "access-time";
  } else if (isCancelled) {
    badgeBg = "#F3F4F6"; 
    statusColor = "#6B7280"; 
    statusText = "Dibatalkan";
    statusIcon = "cancel";
  }

  const orderDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) 
    : "Hari ini";

  const shortDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) 
    : "Hari ini";

  const invoiceNumber = `INV/BTH/${order.createdAt ? new Date(order.createdAt).getFullYear() : "2026"}/${order.id}`;

  // =====================================================================
  // LOGIKA DETEKTIF: NEBAK BARANG BERDASARKAN TOTAL HARGA
  // =====================================================================
  // Kita cari apakah ada produk yang harganya SAMA PERSIS dengan total belanja
  const matchedProduct = products?.find(p => p.productPrice === order.totalPrice);

  // Kalau ketemu persis 1 barang, tampilin gambar & namanya. Kalau nggak, jadiin Paket Pesanan.
  const displayImage = matchedProduct 
    ? matchedProduct.productImage 
    : "https://images.unsplash.com/photo-1590841366162-d2780e5572b8?w=300&q=80"; // Gambar tas pesanan
    
  const displayName = matchedProduct 
    ? matchedProduct.productName 
    : "Paket Pesanan ButterHouse";
    
  const displaySubtitle = matchedProduct 
    ? "1 barang" 
    : invoiceNumber;

  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <MaterialIcons name="shopping-bag" size={16} color="#837469" />
            <Text style={styles.headerDate}>Belanja • {shortDate}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{statusText}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardBody}>
          <Image source={{ uri: displayImage }} style={styles.productImage} resizeMode="cover" />
          
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>{displayName}</Text>
            <Text style={styles.productMeta}>{displaySubtitle}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.totalLabel}>Total Belanja</Text>
            <Text style={styles.totalPrice}>Rp {order.totalPrice.toLocaleString("id-ID")}</Text>
          </View>
          <TouchableOpacity style={styles.detailBtn} onPress={() => setDetailVisible(true)} activeOpacity={0.8}>
            <Text style={styles.detailBtnText}>Lihat Detail</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={isDetailVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detail Pesanan</Text>
              <TouchableOpacity onPress={() => setDetailVisible(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color="#1C1C19" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              
              <View style={styles.modalSection}>
                <View style={styles.statusRow}>
                  <MaterialIcons name={statusIcon as any} size={24} color={statusColor} />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={[styles.statusTextBig, { color: statusColor }]}>{statusText}</Text>
                    <Text style={styles.detailLabel}>{invoiceNumber}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.sectionDivider} />

              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Info Pengiriman</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabelFlex}>Tanggal Pesanan</Text>
                  <Text style={styles.detailValueFlex}>{orderDate}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabelFlex}>Alamat</Text>
                  <Text style={styles.detailValueFlex}>{order.address || "Kawasan Cikarang Festival (Cifest), Bekasi"}</Text>
                </View>
              </View>
              <View style={styles.sectionDivider} />

              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Rincian Pesanan</Text>
                
                <View style={styles.itemRow}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemName}>{displayName}</Text>
                    <Text style={styles.itemQty}>{matchedProduct ? "1" : "Multi"} Item • Detail dikelola sistem</Text>
                  </View>
                  <Text style={styles.itemTotalPrice}>
                    Rp {order.totalPrice.toLocaleString("id-ID")}
                  </Text>
                </View>
              </View>
              <View style={styles.sectionDivider} />

              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Rincian Pembayaran</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabelFlex}>Metode Pembayaran</Text>
                  <Text style={styles.detailValueFlex}>Sistem E-Payment</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabelFlex}>Total Harga</Text>
                  <Text style={styles.detailValueFlex}>Rp {order.totalPrice.toLocaleString("id-ID")}</Text>
                </View>
                
                <View style={styles.dashedDivider} />
                
                <View style={styles.detailRow}>
                  <Text style={styles.totalTextBig}>Total Belanja</Text>
                  <Text style={styles.totalPriceBig}>Rp {order.totalPrice.toLocaleString("id-ID")}</Text>
                </View>
              </View>

            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFFFFF", marginHorizontal: 20, marginBottom: 16, borderRadius: 16, borderWidth: 1, borderColor: "#F0ECE6", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerDate: { fontSize: 12, color: "#837469", fontWeight: "500" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: "#F0ECE6", marginHorizontal: 16 },
  cardBody: { flexDirection: "row", padding: 16, alignItems: "center" },
  productImage: { width: 56, height: 56, borderRadius: 10, backgroundColor: "#F4F0EB", marginRight: 16 },
  productInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: "bold", color: "#1C1C19", marginBottom: 4 },
  productMeta: { fontSize: 12, color: "#D97706", fontWeight: "500" },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, borderTopWidth: 1, borderTopColor: "#F0ECE6" },
  totalLabel: { fontSize: 11, color: "#837469", marginBottom: 2 },
  totalPrice: { fontSize: 14, fontWeight: "bold", color: "#1C1C19" },
  detailBtn: { backgroundColor: "#FDF9F4", borderWidth: 1, borderColor: "#EAE5DD", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  detailBtnText: { color: "#D97706", fontSize: 13, fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, height: "85%", paddingHorizontal: 24, paddingTop: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#F0ECE6" },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#1C1C19" },
  closeBtn: { padding: 4, backgroundColor: "#F4F0EB", borderRadius: 20 },
  modalSection: { paddingVertical: 12 },
  sectionTitle: { fontSize: 15, fontWeight: "bold", color: "#1C1C19", marginBottom: 16 },
  sectionDivider: { height: 6, backgroundColor: "#F9FAF8", marginHorizontal: -24 },
  statusRow: { flexDirection: "row", alignItems: "center" },
  statusTextBig: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  detailLabelFlex: { flex: 1, fontSize: 13, color: "#837469", paddingRight: 16 },
  detailValueFlex: { flex: 2, fontSize: 13, color: "#1C1C19", fontWeight: "500", textAlign: "right", lineHeight: 20 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  itemLeft: { flex: 1, paddingRight: 16 },
  itemName: { fontSize: 14, fontWeight: "600", color: "#1C1C19", marginBottom: 4, lineHeight: 20 },
  itemQty: { fontSize: 12, color: "#837469", fontStyle: "italic" },
  itemTotalPrice: { fontSize: 14, fontWeight: "600", color: "#1C1C19" },
  dashedDivider: { height: 1, borderWidth: 1, borderColor: "#EAE5DD", borderStyle: "dashed", marginVertical: 16 },
  totalTextBig: { fontSize: 15, fontWeight: "bold", color: "#1C1C19" },
  totalPriceBig: { fontSize: 18, fontWeight: "bold", color: "#D97706" },
  detailLabel: { fontSize: 12, color: "#837469" },
});