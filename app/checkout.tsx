import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { PaymentMethod, useShop } from "../context/ShopContext";

export default function CheckoutScreen() {
  const { paymentMethods, checkout, fetchPaymentMethods, user, cart } = useShop();
  const router = useRouter();

  // State Data (Bisa diubah lewat Modal)
  const [contactName, setContactName] = useState(user?.name || "Nabil Putra Alamsyah");
  const [contactEmail, setContactEmail] = useState(user?.email || "alam00912323@gmail.com");
  const [contactPhone, setContactPhone] = useState("+62 812-3456-7890");
  const [deliveryAddress, setDeliveryAddress] = useState("Kawasan Cikarang Festival (Cifest)\nCikarang Selatan\nKabupaten Bekasi\nJawa Barat 17530");
  
  const [schedule, setSchedule] = useState("08:00 - 11:00 (Pagi)");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isGift, setIsGift] = useState(false);

  // State Modal Visibility
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isContactModalVisible, setContactModalVisible] = useState(false);
  const [isAddressModalVisible, setAddressModalVisible] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedMethod) {
      const defaultPay = paymentMethods.find(p => p.name.toLowerCase().includes('dana') || p.name.toLowerCase().includes('gopay')) || paymentMethods[0];
      setSelectedMethod(defaultPay);
    }
  }, [paymentMethods]);

  // Kalkulasi Harga & Item
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.product?.productPrice || 0) * item.quantity, 0);
  const tax = subtotal * 0.10;
  const finalTotal = subtotal + tax;

  const handleProcessCheckout = async () => {
    if (!selectedMethod) return Alert.alert("Peringatan", "Pilih metode pembayarannya dulu.");
    
    // Alamat dikirim dengan menghapus enter/newline jadi 1 baris string
    const addressString = deliveryAddress.replace(/\n/g, ", ");
    const success = await checkout(addressString, selectedMethod.id);
    
    if (success) {
      Alert.alert(
        "Pembayaran Berhasil! 🎉",
        "Pesanan lu udah masuk ke dapur ButterHouse.",
        [{ text: "Lihat Pesanan", onPress: () => router.replace("/(tabs)/history") }]
      );
    }
  };

  const handleUbahJadwal = () => {
    Alert.alert("Jadwal Pengiriman", "Pilih waktu pengiriman:", [
      { text: "Pagi (08:00 - 11:00)", onPress: () => setSchedule("08:00 - 11:00 (Pagi)") },
      { text: "Siang (11:00 - 14:00)", onPress: () => setSchedule("11:00 - 14:00 (Siang)") },
      { text: "Sore (15:00 - 18:00)", onPress: () => setSchedule("15:00 - 18:00 (Sore)") },
      { text: "Batal", style: "cancel" }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

      {/* HEADER ELEGAN */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#1C1C19" />
        </TouchableOpacity>
        <View style={styles.headerTextCenter}>
          <Text style={styles.headerTitle}>Pengiriman & Pembayaran</Text>
          <Text style={styles.headerSubtitle}>Lengkapi pesanan Anda sebelum pembayaran</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.headerDivider} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* 1. KONTAK PENERIMA */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Kontak Penerima</Text>
            <TouchableOpacity onPress={() => setContactModalVisible(true)}><Text style={styles.editText}>Ubah</Text></TouchableOpacity>
          </View>
          <Text style={styles.primaryText}>{contactName}</Text>
          <Text style={styles.secondaryText}>{contactEmail}</Text>
          <Text style={styles.secondaryText}>{contactPhone}</Text>
        </View>

        {/* 2. ALAMAT PENGIRIMAN */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.titleWithIcon}>
              <Ionicons name="location-outline" size={18} color="#D97706" />
              <Text style={styles.sectionTitle}>Alamat Pengiriman</Text>
            </View>
            <TouchableOpacity onPress={() => setAddressModalVisible(true)}><Text style={styles.editText}>Ubah</Text></TouchableOpacity>
          </View>
          <Text style={styles.addressLine}>{deliveryAddress}</Text>
        </View>

        {/* 3. JADWAL PENGIRIMAN */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.titleWithIcon}>
              <Ionicons name="calendar-outline" size={16} color="#837469" />
              <Text style={styles.sectionTitle}>Jadwal Pengiriman</Text>
            </View>
            <TouchableOpacity onPress={handleUbahJadwal}><Text style={styles.editText}>Ubah</Text></TouchableOpacity>
          </View>
          <Text style={styles.primaryText}>20 Juni 2026</Text>
          <Text style={styles.secondaryText}>{schedule}</Text>
        </View>

        {/* 4. METODE PEMBAYARAN */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
          <Text style={styles.paymentCategoryLabel}>
            {selectedMethod?.type === "wallet" ? "E-Wallet" : "Transfer Bank"}
          </Text>
          <TouchableOpacity 
            style={styles.paymentSelector} 
            onPress={() => setPaymentModalVisible(true)}
            activeOpacity={0.7}
          >
            {selectedMethod ? (
              <View style={styles.selectedPaymentRow}>
                {selectedMethod.logoUrl ? (
                  <Image source={{ uri: selectedMethod.logoUrl }} style={styles.paymentLogoMini} resizeMode="contain" />
                ) : (
                  <View style={styles.paymentIconFallback}>
                    <FontAwesome5 name={selectedMethod.type === "wallet" ? "wallet" : "credit-card"} size={14} color="#785317" />
                  </View>
                )}
                <Text style={styles.paymentMethodName}>{selectedMethod.name}</Text>
              </View>
            ) : (
              <Text style={styles.secondaryText}>Pilih Metode Pembayaran</Text>
            )}
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#1C1C19" />
          </TouchableOpacity>
        </View>

        {/* 5. RINGKASAN PESANAN */}
        <View style={styles.card}>
          <View style={styles.summaryHeader}>
            <Text style={styles.sectionTitle}>Ringkasan Pesanan</Text>
            <Text style={styles.summaryItemCount}>{totalItems} Produk</Text>
          </View>
          
          {cart.map((item) => (
            <View key={item.id} style={styles.summaryItemRow}>
              <Image source={{ uri: item.product?.productImage || "https://images.unsplash.com/photo-1549903072-7e6e0829faa1?w=200" }} style={styles.summaryThumbnail} />
              <View style={styles.summaryItemCenter}>
                <Text style={styles.summaryItemName} numberOfLines={2}>{item.product?.productName}</Text>
                <Text style={styles.summaryItemQty}>{item.quantity}x</Text>
              </View>
              <Text style={styles.summaryItemPrice}>
                Rp {((item.product?.productPrice || 0) * item.quantity).toLocaleString("id-ID")}
              </Text>
            </View>
          ))}
          
          <View style={styles.calcDivider} />
          
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Subtotal</Text>
            <Text style={styles.calcValue}>Rp {subtotal.toLocaleString("id-ID")}</Text>
          </View>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Pajak & Layanan (10%)</Text>
            <Text style={styles.calcValue}>Rp {tax.toLocaleString("id-ID")}</Text>
          </View>
        </View>

        {/* 6. OPSI TAMBAHAN (GIFT HUMANIS) */}
        <TouchableOpacity style={[styles.card, styles.giftToggleRow]} onPress={() => setIsGift(!isGift)} activeOpacity={0.7}>
          <View style={styles.giftLeft}>
            <Ionicons name="gift-outline" size={20} color="#D97706" />
            <View>
              <Text style={styles.primaryText}>Kirim sebagai hadiah</Text>
              <Text style={styles.giftSubtitle}>Tambahkan ucapan pada pesanan hadiah</Text>
            </View>
          </View>
          <MaterialIcons name={isGift ? "check-box" : "check-box-outline-blank"} size={24} color={isGift ? "#D97706" : "#EAE5DD"} />
        </TouchableOpacity>

        {/* Jarak untuk Sticky Footer */}
        <View style={styles.footerDivider} />
      </ScrollView>

      {/* 7. STICKY FOOTER BAYAR */}
      <View style={styles.footerTopBorder} />
      <View style={styles.bottomBar}>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalPrice}>Rp {finalTotal.toLocaleString("id-ID")}</Text>
        </View>
        <TouchableOpacity style={styles.payBtn} onPress={handleProcessCheckout} activeOpacity={0.8}>
          <Text style={styles.payBtnText}>Selesaikan Pesanan</Text>
        </TouchableOpacity>
      </View>

      {/* --- MODAL PILIH PEMBAYARAN --- */}
      <Modal visible={isPaymentModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Metode Pembayaran</Text>
              <TouchableOpacity onPress={() => setPaymentModalVisible(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color="#1C1C19" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={paymentMethods}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.paymentModalItem}
                  onPress={() => {
                    setSelectedMethod(item);
                    setPaymentModalVisible(false);
                  }}
                >
                  {item.logoUrl ? (
                    <Image source={{ uri: item.logoUrl }} style={styles.paymentLogoList} resizeMode="contain" />
                  ) : (
                    <View style={styles.paymentIconFallback}>
                      <FontAwesome5 name={item.type === "wallet" ? "wallet" : "credit-card"} size={14} color="#785317" />
                    </View>
                  )}
                  <View style={styles.paymentModalTextBox}>
                    <Text style={styles.primaryText}>{item.name}</Text>
                    <Text style={styles.secondaryText}>{item.type === "wallet" ? "E-Wallet" : "Transfer Bank"}</Text>
                  </View>
                  {selectedMethod?.id === item.id && (
                    <MaterialIcons name="check-circle" size={22} color="#D97706" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* --- MODAL UBAH KONTAK --- */}
      <Modal visible={isContactModalVisible} animationType="fade" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ubah Kontak Penerima</Text>
              <TouchableOpacity onPress={() => setContactModalVisible(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color="#1C1C19" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Nama Penerima</Text>
            <TextInput style={styles.inputField} value={contactName} onChangeText={setContactName} />
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput style={styles.inputField} value={contactEmail} onChangeText={setContactEmail} keyboardType="email-address" autoCapitalize="none" />
            <Text style={styles.inputLabel}>Nomor Handphone</Text>
            <TextInput style={styles.inputField} value={contactPhone} onChangeText={setContactPhone} keyboardType="phone-pad" />
            <TouchableOpacity style={styles.modalSaveBtn} onPress={() => setContactModalVisible(false)}>
              <Text style={styles.payBtnText}>Simpan Kontak</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- MODAL UBAH ALAMAT --- */}
      <Modal visible={isAddressModalVisible} animationType="fade" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ubah Alamat Pengiriman</Text>
              <TouchableOpacity onPress={() => setAddressModalVisible(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color="#1C1C19" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Alamat Lengkap</Text>
            <TextInput 
              style={[styles.inputField, { height: 100, textAlignVertical: "top" }]} 
              value={deliveryAddress} 
              onChangeText={setDeliveryAddress} 
              multiline 
            />
            <TouchableOpacity style={styles.modalSaveBtn} onPress={() => setAddressModalVisible(false)}>
              <Text style={styles.payBtnText}>Simpan Alamat</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const serifFamily = Platform.OS === "ios" ? "Georgia" : "serif";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" }, 
  
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, backgroundColor: "#FFFFFF" },
  backBtn: { padding: 8 },
  headerTextCenter: { alignItems: "center", flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#1C1C19" },
  headerSubtitle: { fontSize: 11, color: "#837469", marginTop: 2 },
  headerDivider: { height: 1, backgroundColor: "#F0ECE6" },

  container: { flex: 1, backgroundColor: "#FAF7F2", paddingTop: 12 },
  
  card: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F0ECE6",
  },
  
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  titleWithIcon: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#1C1C19" },
  editText: { fontSize: 13, fontWeight: "bold", color: "#D97706" },

  primaryText: { fontSize: 14, fontWeight: "600", color: "#1C1C19", marginBottom: 4 },
  secondaryText: { fontSize: 13, color: "#837469", lineHeight: 20 },
  addressLine: { fontSize: 13, color: "#594232", lineHeight: 22 },

  paymentCategoryLabel: { fontSize: 11, color: "#A89F91", marginTop: 8, marginBottom: 4, fontWeight: "600" },
  paymentSelector: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#EAE5DD", borderRadius: 10, height: 56 },
  selectedPaymentRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  paymentLogoMini: { width: 40, height: 40 },
  paymentIconFallback: { width: 36, height: 36, borderRadius: 6, backgroundColor: "#F6E8D5", alignItems: "center", justifyContent: "center" },
  paymentMethodName: { fontSize: 14, fontWeight: "bold", color: "#1C1C19" },

  summaryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 },
  summaryItemCount: { fontSize: 12, color: "#837469", fontWeight: "500" },
  summaryItemRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  summaryThumbnail: { width: 40, height: 40, borderRadius: 8, backgroundColor: "#F4F0EB", marginRight: 12 },
  summaryItemCenter: { flex: 1, paddingRight: 12 },
  summaryItemName: { fontSize: 13, color: "#1C1C19", fontWeight: "600", marginBottom: 2 },
  summaryItemQty: { fontSize: 12, color: "#837469" },
  summaryItemPrice: { fontSize: 13, fontWeight: "600", color: "#1C1C19" },
  
  calcDivider: { height: 1, backgroundColor: "#EAE5DD", marginBottom: 12, marginTop: 4 },
  calcRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  calcLabel: { fontSize: 12, color: "#837469" },
  calcValue: { fontSize: 13, fontWeight: "500", color: "#594232" },

  giftToggleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  giftLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  giftSubtitle: { fontSize: 11, color: "#A89F91", marginTop: 2 },

  footerDivider: { height: 80, backgroundColor: "#FAF7F2" },
  footerTopBorder: { height: 1, backgroundColor: "#EAE5DD", width: "100%" },
  
  bottomBar: { 
    backgroundColor: "#FFFFFF", 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 20, 
    paddingTop: 12, 
    paddingBottom: Platform.OS === 'ios' ? 32 : 16, 
  },
  totalBox: { flex: 1 },
  totalLabel: { fontSize: 11, color: "#837469", letterSpacing: 1, fontWeight: "700", marginBottom: 2 },
  totalPrice: { fontFamily: serifFamily, fontSize: 20, fontWeight: "bold", color: "#D97706" },
  
  payBtn: { backgroundColor: "#6F4315", paddingHorizontal: 24, justifyContent: "center", borderRadius: 10, height: 52 },
  payBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold", textAlign: "center" },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.4)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: "80%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 16, fontWeight: "bold", color: "#1C1C19" },
  closeBtn: { padding: 4 },
  
  inputLabel: { fontSize: 12, fontWeight: "bold", color: "#594232", marginBottom: 8 },
  inputField: { backgroundColor: "#FAF7F2", borderWidth: 1, borderColor: "#EAE5DD", borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: "#1C1C19", marginBottom: 16 },
  modalSaveBtn: { backgroundColor: "#D97706", paddingVertical: 14, borderRadius: 10, marginTop: 8 },
  
  paymentModalItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F4F0EB" },
  paymentLogoList: { width: 40, height: 40 },
  paymentModalTextBox: { flex: 1, marginLeft: 16 },
});