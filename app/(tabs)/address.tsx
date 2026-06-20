import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet, Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

// Tipe data buat alamat
interface Address {
  id: string;
  name: string;
  phone: string;
  detail: string;
  isMain: boolean;
}

export default function AddressScreen() {
  const router = useRouter();

  // State Daftar Alamat (Defaultnya ada 1 alamat utama)
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Nabil Putra",
      phone: "+62 812-3456-7890",
      detail: "Kawasan Cikarang Festival (Cifest), Cikarang Selatan, Kabupaten Bekasi, Jawa Barat 17530",
      isMain: true,
    }
  ]);

  // State buat Modal Form
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // State buat Inputan Form
  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDetail, setFormDetail] = useState("");

  // Buka Form Tambah Baru
  const handleAddNew = () => {
    setIsEditing(false);
    setFormId(Date.now().toString()); // Bikin ID acak
    setFormName("");
    setFormPhone("");
    setFormDetail("");
    setModalVisible(true);
  };

  // Buka Form Edit
  const handleEdit = (address: Address) => {
    setIsEditing(true);
    setFormId(address.id);
    setFormName(address.name);
    setFormPhone(address.phone);
    setFormDetail(address.detail);
    setModalVisible(true);
  };

  // Simpan Data
  const handleSave = () => {
    if (!formName || !formPhone || !formDetail) {
      alert("Semua kolom harus diisi cuy!");
      return;
    }

    if (isEditing) {
      // Update alamat yang udah ada
      setAddresses(addresses.map(addr => 
        addr.id === formId 
          ? { ...addr, name: formName, phone: formPhone, detail: formDetail } 
          : addr
      ));
    } else {
      // Tambah alamat baru (otomatis bukan utama)
      const newAddress: Address = {
        id: formId,
        name: formName,
        phone: formPhone,
        detail: formDetail,
        isMain: addresses.length === 0, // Kalau kosong, jadikan utama
      };
      setAddresses([...addresses, newAddress]);
    }
    setModalVisible(false);
  };

  // Jadikan Alamat Utama
  const handleSetMain = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isMain: addr.id === id
    })));
  };

  // Hapus Alamat
  const handleDelete = (id: string) => {
    const updated = addresses.filter(addr => addr.id !== id);
    // Kalau yang dihapus alamat utama, jadikan yang pertama sebagai utama
    if (updated.length > 0 && !updated.some(addr => addr.isMain)) {
      updated[0].isMain = true;
    }
    setAddresses(updated);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color="#594232" />
        </TouchableOpacity>
        <View style={styles.headerTextCenter}>
          <Text style={styles.headerTitle}>Alamat Pengiriman</Text>
          <Text style={styles.headerSubtitle}>Pilih alamat untuk menerima pesanan</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.headerDivider} />

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Render Daftar Alamat */}
        {addresses.map((item) => (
          <View key={item.id} style={[styles.addressCard, item.isMain && styles.addressCardMain]}>
            
            {/* Bagian Atas Card */}
            <View style={styles.cardTopRow}>
              {item.isMain ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Alamat Utama</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={() => handleSetMain(item.id)} style={styles.setMainBtn}>
                  <Text style={styles.setMainText}>Jadikan Utama</Text>
                </TouchableOpacity>
              )}
              
              {/* Tombol Hapus kalau bukan alamat utama */}
              {!item.isMain && (
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.contactRow}>
              <Text style={styles.nameText}>📍 {item.name}</Text>
              <Text style={styles.phoneText}>{item.phone}</Text>
            </View>

            <View style={styles.addressBlock}>
              <Text style={styles.addressLine}>{item.detail}</Text>
            </View>

            <View style={styles.cardDivider} />

            <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)} activeOpacity={0.6}>
              <Text style={styles.editText}>✏ Edit Alamat</Text>
            </TouchableOpacity>
            
          </View>
        ))}

        {/* Tombol Tambah Alamat Baru */}
        <TouchableOpacity style={styles.addCard} onPress={handleAddNew} activeOpacity={0.7}>
          <Text style={styles.addCardTitle}>＋ Tambah Alamat Baru</Text>
          <Text style={styles.addCardSubtitle}>Kelola alamat pengiriman lainnya</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* POP-UP MODAL FORM (Tampil pas diedit/ditambah) */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{isEditing ? "Edit Alamat" : "Tambah Alamat Baru"}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#837469" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Nama Penerima</Text>
            <TextInput 
              style={styles.inputField} 
              placeholder="Contoh: Nabil Putra" 
              value={formName} 
              onChangeText={setFormName} 
            />

            <Text style={styles.inputLabel}>Nomor Handphone</Text>
            <TextInput 
              style={styles.inputField} 
              placeholder="Contoh: 081234567890" 
              keyboardType="phone-pad"
              value={formPhone} 
              onChangeText={setFormPhone} 
            />

            <Text style={styles.inputLabel}>Detail Alamat</Text>
            <TextInput 
              style={[styles.inputField, styles.textArea]} 
              placeholder="Tuliskan alamat lengkap..." 
              multiline
              numberOfLines={3}
              value={formDetail} 
              onChangeText={setFormDetail} 
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveBtnText}>Simpan Alamat</Text>
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FDF9F4" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, backgroundColor: "#FDF9F4" },
  backBtn: { padding: 8 },
  headerTextCenter: { alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1C1C19", marginBottom: 2 },
  headerSubtitle: { fontSize: 12, color: "#837469" },
  headerDivider: { height: 1, backgroundColor: "#E5DDD4" },
  container: { flex: 1 },
  content: { padding: 24 },
  
  // Card
  addressCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#E6E2DD", marginBottom: 16, shadowColor: "#594232", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  addressCardMain: { borderColor: "#D97706", borderWidth: 1.5 }, // Highlight card utama
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  badge: { backgroundColor: "#F6E8D5", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  badgeText: { color: "#A16207", fontSize: 11, fontWeight: "bold" },
  setMainBtn: { backgroundColor: "#F4F0EB", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  setMainText: { color: "#837469", fontSize: 11, fontWeight: "bold" },
  contactRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  nameText: { fontSize: 16, fontWeight: "bold", color: "#1C1C19", marginRight: 8 },
  phoneText: { fontSize: 14, color: "#837469" },
  addressBlock: { marginBottom: 16 },
  addressLine: { fontSize: 14, color: "#594232", lineHeight: 22 },
  cardDivider: { height: 1, backgroundColor: "#E6E2DD", marginBottom: 12 },
  editBtn: { paddingVertical: 4 },
  editText: { color: "#D97706", fontSize: 14, fontWeight: "600" },
  
  addCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#E6E2DD", justifyContent: "center", marginTop: 8 },
  addCardTitle: { fontSize: 15, fontWeight: "bold", color: "#1C1C19", marginBottom: 4 },
  addCardSubtitle: { fontSize: 13, color: "#837469" },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(28, 28, 25, 0.6)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#1C1C19" },
  inputLabel: { fontSize: 13, fontWeight: "bold", color: "#594232", marginBottom: 8 },
  inputField: { backgroundColor: "#FDF9F4", borderWidth: 1, borderColor: "#E6E2DD", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: "#1C1C19", marginBottom: 16 },
  textArea: { height: 100, textAlignVertical: "top" },
  saveBtn: { backgroundColor: "#D97706", paddingVertical: 16, borderRadius: 14, alignItems: "center", marginTop: 8 },
  saveBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});