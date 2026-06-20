import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView, Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet, Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useShop } from "../../context/ShopContext";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useShop();

  const [name, setName] = useState(user?.name || "Nabil Putra Alamsyah");
  const [email, setEmail] = useState(user?.email || "nabil.alamsyah@example.com");
  const [phone, setPhone] = useState("+62 812-3456-7890");

  const handleSave = () => {
    if (!name || !email || !phone) {
      Alert.alert("Perhatian", "Semua kolom harus diisi ya cuy!");
      return;
    }
    
    // Alert sukses dan kembali ke Profile (Data tidak dikirim ke API karena keterbatasan endpoint backend)
    Alert.alert(
      "Berhasil", 
      "Profil lu sukses diupdate secara lokal!", 
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        {/* Header Premium */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <MaterialIcons name="arrow-back" size={24} color="#594232" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.headerDivider} />

        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Avatar Section (TANPA KAMERA BIAR AMAN) */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{name.substring(0, 2).toUpperCase()}</Text>
            </View>
            <Text style={styles.avatarHint}>Foto profil terhubung dengan akun utama</Text>
          </View>

          {/* Form Inputs */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nama Lengkap</Text>
              <TextInput 
                style={styles.inputField} 
                value={name} 
                onChangeText={setName} 
                placeholder="Masukkan nama lengkap"
                placeholderTextColor="#A89F91"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Alamat Email</Text>
              <TextInput 
                style={styles.inputField} 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address"
                placeholder="contoh@email.com"
                placeholderTextColor="#A89F91"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nomor Handphone</Text>
              <TextInput 
                style={styles.inputField} 
                value={phone} 
                onChangeText={setPhone} 
                keyboardType="phone-pad"
                placeholder="0812xxxxxx"
                placeholderTextColor="#A89F91"
              />
            </View>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FDF9F4" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, backgroundColor: "#FDF9F4" },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1C1C19" },
  headerDivider: { height: 1, backgroundColor: "#E6E2DD" },
  container: { flex: 1 },
  content: { padding: 24 },
  
  // Avatar Styles
  avatarSection: { alignItems: "center", marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#6F4315", alignItems: "center", justifyContent: "center", marginBottom: 12, shadowColor: "#594232", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  avatarText: { color: "#FFFFFF", fontSize: 36, fontWeight: "bold" },
  avatarHint: { fontSize: 13, color: "#837469", fontStyle: "italic" },

  // Form Styles
  formSection: { gap: 20 },
  inputGroup: {},
  inputLabel: { fontSize: 13, fontWeight: "bold", color: "#594232", marginBottom: 8, paddingLeft: 4 },
  inputField: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E6E2DD", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: "#1C1C19", shadowColor: "#1C1C19", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  footer: { paddingHorizontal: 24, paddingVertical: 16, backgroundColor: "#FDF9F4", borderTopWidth: 1, borderTopColor: "#E6E2DD" },
  saveBtn: { backgroundColor: "#6F4315", paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  saveBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
});