import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ShopProvider, useShop } from "../context/ShopContext";

function RootContent() {
  const { token, login, register, loading } = useShop();
  const [isLoginView, setIsLoginView] = useState(true);

  // State Form Input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State Custom Alert
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: "", message: "", isError: true });

  const showCustomAlert = (title: string, message: string, isError = true) => {
    setAlertConfig({ visible: true, title, message, isError });
  };

  const handleSubmit = async () => {
    if (!email || !password || (!isLoginView && !name)) {
      showCustomAlert("Form Tidak Lengkap", "Mohon isi semua bidang form yang tersedia untuk melanjutkan.");
      return;
    }

    if (!isLoginView) {
      if (password.length < 6) {
        showCustomAlert("Keamanan Sandi", "Kata sandi harus terdiri dari minimal 6 karakter.");
        return;
      }
      if (password !== confirmPassword) {
        showCustomAlert("Konfirmasi Gagal", "Kata sandi dan konfirmasi tidak cocok. Silakan periksa kembali.");
        return;
      }
    }

    if (isLoginView) {
      const success = await login(email, password);
      if (!success) {
        showCustomAlert("Gagal Masuk", "Email atau kata sandi salah. Silakan coba lagi.");
      }
    } else {
      const success = await register(name, email, password);
      if (success) {
        setIsLoginView(true);
        setPassword("");
        setConfirmPassword("");
        showCustomAlert("Berhasil!", "Akun Anda berhasil didaftarkan. Silakan masuk untuk mulai berbelanja.", false);
      } else {
        showCustomAlert("Registrasi Gagal", "Terjadi kesalahan saat mendaftar. Pastikan email belum digunakan.");
      }
    }
  };

  // 🔒 GATEKEEPER: Jika token tidak ada, kunci layar dengan Form Premium
  if (!token) {
    return (
      <ImageBackground 
        source={{ uri: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80" }} 
        style={styles.bgContainer}
        imageStyle={{ opacity: 0.15 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.brandingHeader}>
            <View style={styles.logoCircle}>
              <MaterialIcons name="bakery-dining" size={40} color="#8B5A2B" />
            </View>
            <Text style={styles.brandTitle}>ButterHouse</Text>
            <Text style={styles.brandSubtitle}>Freshly Baked Every Morning</Text>
          </View>

          <View style={styles.authCard}>
            <Text style={styles.authTitle}>
              {isLoginView ? "Selamat Datang Kembali" : "Bergabung dengan Kami"}
            </Text>
            <Text style={styles.authSubtitle}>
              {isLoginView 
                ? "Masuk untuk melanjutkan pesanan dan melihat riwayat pembelianmu" 
                : "Daftar sekarang untuk menikmati pastry premium setiap hari"}
            </Text>

            {!isLoginView && (
              <TextInput
                placeholder="Nama Lengkap"
                placeholderTextColor="#A89B8F"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
            )}
            
            <TextInput
              placeholder="Alamat Email"
              placeholderTextColor="#A89B8F"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              style={styles.input}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Kata Sandi"
                placeholderTextColor="#A89B8F"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#A89B8F" />
              </TouchableOpacity>
            </View>

            {!isLoginView ? (
              <>
                <Text style={styles.passwordRule}>Minimal 6 karakter</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Konfirmasi Kata Sandi"
                    placeholderTextColor="#A89B8F"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    style={styles.passwordInput}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeBtn}>
                    <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={20} color="#A89B8F" />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <TouchableOpacity style={styles.forgotBtn} onPress={() => showCustomAlert("Info", "Fitur pemulihan kata sandi sedang dalam pengembangan tim kami.", false)}>
                <Text style={styles.forgotText}>Lupa Kata Sandi?</Text>
              </TouchableOpacity>
            )}

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8B5A2B" />
              </View>
            ) : (
              <TouchableOpacity onPress={handleSubmit} style={styles.authBtn} activeOpacity={0.8}>
                <Text style={styles.authBtnText}>
                  {isLoginView ? "Lanjutkan" : "Daftar Akun"}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                setIsLoginView(!isLoginView);
                setPassword("");
                setConfirmPassword("");
              }}
              style={styles.switchBtn}
            >
              <Text style={styles.switchText}>
                {isLoginView
                  ? "Belum punya akun? Daftar"
                  : "Sudah punya akun? Masuk"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.trustBadges}>
            <Text style={styles.trustText}>✓ Freshly baked daily</Text>
            <Text style={styles.trustText}>✓ Same day delivery</Text>
            <Text style={styles.trustText}>✓ Premium ingredients</Text>
          </View>

        </ScrollView>

        {/* CUSTOM ALERT MODAL */}
        <Modal visible={alertConfig.visible} transparent animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalBox}>
              <View style={[styles.iconCircle, { backgroundColor: alertConfig.isError ? "#FEE2E2" : "#ECFDF5" }]}>
                <MaterialIcons name={alertConfig.isError ? "error-outline" : "check"} size={32} color={alertConfig.isError ? "#EF4444" : "#10B981"} />
              </View>
              <Text style={styles.modalTitle}>{alertConfig.title}</Text>
              <Text style={styles.modalDesc}>{alertConfig.message}</Text>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: alertConfig.isError ? "#EF4444" : "#10B981" }]} 
                onPress={() => setAlertConfig({ ...alertConfig, visible: false })}
              >
                <Text style={styles.modalBtnText}>Mengerti</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ImageBackground>
    );
  }

  // 🔓 Jika berhasil login, tampilkan Stack Navigasi Utama Aplikasi
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="product/[id]"
        options={{ headerShown: true, title: "Detail Produk", headerTintColor: "#4A3425" }}
      />
      <Stack.Screen
        name="checkout"
        options={{ headerShown: true, title: "Pengiriman & Pembayaran", headerTintColor: "#4A3425" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ShopProvider>
      <RootContent />
    </ShopProvider>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    backgroundColor: "#F8F5F1",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  brandingHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#8B5A2B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#4A3425",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: "#8B5A2B",
    fontWeight: "600",
    marginTop: 4,
    fontStyle: "italic",
  },
  authCard: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: 420,
    padding: 28,
    borderRadius: 24,
    shadowColor: "#4A3425",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A3425",
    textAlign: "center",
  },
  authSubtitle: {
    fontSize: 13,
    color: "#A89B8F",
    textAlign: "center",
    marginBottom: 24,
    marginTop: 6,
    lineHeight: 20,
  },
  input: {
    backgroundColor: "#F8F5F1",
    borderWidth: 1,
    borderColor: "#EAE5DD",
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 14,
    color: "#4A3425",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F5F1",
    borderWidth: 1,
    borderColor: "#EAE5DD",
    borderRadius: 12,
    height: 50,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#4A3425",
  },
  eyeBtn: {
    paddingHorizontal: 16,
    height: 50,
    justifyContent: "center",
  },
  passwordRule: {
    fontSize: 11,
    color: "#A89B8F",
    marginTop: -10,
    marginBottom: 16,
    marginLeft: 4,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    color: "#8B5A2B",
    fontWeight: "600",
  },
  loadingContainer: {
    height: 50,
    justifyContent: "center",
    marginTop: 8,
  },
  authBtn: {
    backgroundColor: "#8B5A2B",
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#8B5A2B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  authBtnText: { 
    color: "#FFFFFF", 
    fontWeight: "bold", 
    fontSize: 15,
    letterSpacing: 0.5,
  },
  switchBtn: { 
    marginTop: 20, 
    alignItems: "center",
    paddingVertical: 8,
  },
  switchText: { 
    color: "#8B5A2B", 
    fontSize: 13, 
    fontWeight: "600" 
  },
  trustBadges: {
    marginTop: 32,
    alignItems: "center",
    gap: 8,
  },
  trustText: {
    fontSize: 12,
    color: "#A89B8F",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  
  // Custom Alert Modal Styles
  modalBg: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 24 
  },
  modalBox: { 
    backgroundColor: "#FFFFFF", 
    borderRadius: 24, 
    padding: 24, 
    alignItems: "center", 
    width: "100%", 
    maxWidth: 320, 
    elevation: 5 
  },
  iconCircle: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: 16 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#4A3425", 
    marginBottom: 8, 
    textAlign: "center" 
  },
  modalDesc: { 
    fontSize: 14, 
    color: "#837469", 
    textAlign: "center", 
    marginBottom: 24, 
    lineHeight: 20 
  },
  modalBtn: { 
    width: "100%", 
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: "center" 
  },
  modalBtnText: { 
    color: "#FFFFFF", 
    fontSize: 14, 
    fontWeight: "bold" 
  },
});