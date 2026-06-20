import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet, Text,
  TouchableOpacity,
  View
} from "react-native";
import { useShop } from "../../context/ShopContext";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { products, addToCart } = useShop();

  const [quantity, setQuantity] = useState(1);

  // Cari produk berdasarkan parameter ID
  const product = products?.find((p) => p.id == (id as any));

  // --- TARIK DATA ASLI DARI CONTEXT LU ---
  const safeName = product?.productName || "Heritage Sourdough";
  const safePrice = Number(product?.productPrice || 12000); 
  const safeImage = product?.productImage || "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600";
  const safeDesc = product?.productDescription || "Our signature loaf is crafted using a deeply nurtured natural starter, ancient grain organic flour, and a touch of artisanal sea salt. The extended fermentation process unlocks a rich depth of flavor and creates an open, chewy crumb structure encased in a deeply blistered, satisfyingly crunchy crust.";

  // Kalau produknya bener-bener gak ketemu
  if (!product) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#D97706" />
        <Text style={styles.errorTitle}>Produk Tidak Ditemukan</Text>
        <TouchableOpacity style={styles.backBtnError} onPress={() => router.back()}>
          <Text style={styles.backBtnErrorText}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Fungsi Tambah ke Keranjang Sesuai Context Lu
  const handleAddToCart = async () => {
    if (addToCart && product.id) {
      // Panggil API dosen lu: productId dan quantity
      const success = await addToCart(product.id, quantity);
      
      if (success) {
        Alert.alert("Berhasil Masuk Keranjang! 🥐", `${quantity}x ${safeName} siap dicheckout.`, [
          { text: "Lanjut Belanja", style: "cancel" },
          { text: "Lihat Cart", onPress: () => router.push("/cart") }
        ]);
      }
    }
  };

  const totalPrice = safePrice * quantity;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER GAMBAR (Sesuai Referensi) */}
        <ImageBackground source={{ uri: safeImage }} style={styles.imageContainer}>
          <View style={styles.imageOverlay}>
            
            <View style={styles.topNav}>
              <TouchableOpacity style={styles.glassBtn} onPress={() => router.back()}>
                <MaterialIcons name="arrow-back" size={20} color="#594232" />
              </TouchableOpacity>
              <View style={styles.topNavRight}>
                <TouchableOpacity style={styles.glassBtn}>
                  <MaterialIcons name="favorite-border" size={20} color="#594232" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.glassBtn}>
                  <MaterialIcons name="share" size={20} color="#594232" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.chefBadge}>
              <Text style={styles.chefBadgeText}>CHEF'S RECOMMENDATION</Text>
            </View>

          </View>
        </ImageBackground>

        {/* KONTEN DETAIL PRODUK */}
        <View style={styles.contentContainer}>
          
          <Text style={styles.titleText}>{safeName}</Text>
          <Text style={styles.subtitleText}>A 48-hour fermented masterpiece with a complex, tangy crumb.</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceText}>Rp {safePrice.toLocaleString("id-ID")}</Text>
            <View style={styles.freshBadge}>
              <Text style={styles.freshBadgeText}>Fresh batch at 15:00</Text>
            </View>
          </View>

          <Text style={styles.descriptionText}>{safeDesc}</Text>

          <Text style={styles.sectionHeader}>Product Details</Text>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailBox}>
              <MaterialIcons name="shopping-bag" size={18} color="#594232" style={styles.detailIcon} />
              <Text style={styles.detailLabel}>WEIGHT</Text>
              <Text style={styles.detailValue}>850g</Text>
            </View>
            <View style={styles.detailBox}>
              <MaterialIcons name="thermostat" size={18} color="#594232" style={styles.detailIcon} />
              <Text style={styles.detailLabel}>STORAGE</Text>
              <Text style={styles.detailValue}>Room Temp</Text>
            </View>
          </View>

          <View style={styles.infoBoxFull}>
            <Text style={styles.detailLabel}>INGREDIENTS</Text>
            <Text style={styles.detailValueLine}>Organic Stoneground Wheat Flour, Filtered Water, Natural Starter, Celtic Sea Salt.</Text>
          </View>

          <View style={styles.allergenBox}>
            <View style={styles.allergenIconWrapper}>
              <MaterialIcons name="info-outline" size={18} color="#B91C1C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>ALLERGENS</Text>
              <Text style={styles.detailValueLine}>
                Contains <Text style={{ fontWeight: "bold" }}>Wheat</Text>. Crafted in a facility that also handles nuts and dairy.
              </Text>
            </View>
          </View>

          <View style={styles.reviewHeaderRow}>
            <Text style={styles.sectionHeader}>Tastemaker{"\n"}Reviews</Text>
            <View style={styles.ratingBox}>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map((_, i) => <MaterialIcons key={i} name="star" size={14} color="#A16207" />)}
              </View>
              <Text style={styles.ratingNumberText}>4.8 <Text style={styles.reviewCount}>(124)</Text></Text>
            </View>
          </View>

          <View style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <View>
                <Text style={styles.reviewerName}>Eleanor V.</Text>
                <Text style={styles.verifiedText}>Verified Buyer</Text>
              </View>
              <Text style={styles.reviewTime}>2 days ago</Text>
            </View>
            <Text style={styles.reviewContent}>
              "Absolutely phenomenal crust and the crumb is perfectly open. Best sourdough I've had outside of Paris. Pairs wonderfully with cultured butter."
            </Text>
          </View>

          <TouchableOpacity style={{ marginBottom: 32 }}>
            <Text style={styles.readAllReviews}>Read all 124 reviews</Text>
          </TouchableOpacity>
          
        </View>
      </ScrollView>

      {/* STICKY BOTTOM ACTION BAR */}
      <View style={styles.bottomBar}>
        
        {/* Kontrol Jumlah Barang */}
        <View style={styles.qtyContainer}>
          <TouchableOpacity 
            style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]} 
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <MaterialIcons name="remove" size={20} color={quantity <= 1 ? "#D5C3B6" : "#594232"} />
          </TouchableOpacity>
          
          <Text style={styles.qtyText}>{quantity}</Text>
          
          <TouchableOpacity 
            style={styles.qtyBtn} 
            onPress={() => setQuantity(quantity + 1)}
          >
            <MaterialIcons name="add" size={20} color="#594232" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart} activeOpacity={0.8}>
          <Text style={styles.addToCartText}>Add to Cart • Rp {totalPrice.toLocaleString("id-ID")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const serifFamily = Platform.OS === "ios" ? "Georgia" : "serif";

const styles = StyleSheet.create({
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FAF7F2" },
  errorTitle: { fontSize: 18, fontWeight: "bold", color: "#1C1C19", marginTop: 16, marginBottom: 24 },
  backBtnError: { backgroundColor: "#6F4315", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  backBtnErrorText: { color: "#FFFFFF", fontWeight: "bold" },

  container: { flex: 1, backgroundColor: "#FAF7F2" },
  scrollContent: { paddingBottom: 110 },
  
  imageContainer: { width: "100%", height: 380 },
  imageOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.15)", justifyContent: "space-between", paddingTop: 50, paddingBottom: 40, paddingHorizontal: 20 },
  topNav: { flexDirection: "row", justifyContent: "space-between" },
  topNavRight: { flexDirection: "row", gap: 12 },
  glassBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(250, 247, 242, 0.9)", alignItems: "center", justifyContent: "center" },
  
  chefBadge: { backgroundColor: "#785317", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  chefBadgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "bold", letterSpacing: 1 },

  contentContainer: { flex: 1, backgroundColor: "#FAF7F2", borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24, paddingHorizontal: 24, paddingTop: 32 },
  
  titleText: { fontFamily: serifFamily, fontSize: 32, fontWeight: "700", color: "#593612", lineHeight: 36, marginBottom: 6 },
  subtitleText: { fontSize: 13, color: "#837469", fontStyle: "italic", marginBottom: 16 },
  
  priceRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  priceText: { fontFamily: serifFamily, fontSize: 28, fontWeight: "bold", color: "#1C1C19", marginRight: 12 },
  freshBadge: { backgroundColor: "#F7E1D7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  freshBadgeText: { color: "#B45309", fontSize: 10, fontWeight: "bold" },
  
  descriptionText: { fontSize: 14, color: "#594232", lineHeight: 22, marginBottom: 32 },
  
  sectionHeader: { fontFamily: serifFamily, fontSize: 20, fontWeight: "bold", color: "#593612", marginBottom: 16 },
  
  detailsGrid: { flexDirection: "row", gap: 12, marginBottom: 12 },
  detailBox: { flex: 1, backgroundColor: "#F3EDE6", padding: 16, borderRadius: 12 },
  detailIcon: { marginBottom: 8 },
  detailLabel: { fontSize: 10, fontWeight: "bold", color: "#594232", letterSpacing: 1, marginBottom: 4 },
  detailValue: { fontSize: 14, fontWeight: "bold", color: "#1C1C19" },
  
  infoBoxFull: { backgroundColor: "#F3EDE6", padding: 16, borderRadius: 12, marginBottom: 12 },
  detailValueLine: { fontSize: 13, color: "#594232", lineHeight: 20 },
  
  allergenBox: { flexDirection: "row", backgroundColor: "#F3EDE6", padding: 16, borderRadius: 12, marginBottom: 32, gap: 12 },
  allergenIconWrapper: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#FEE2E2", alignItems: "center", justifyContent: "center", marginTop: 2 },
  
  reviewHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  ratingBox: { alignItems: "flex-end" },
  starsRow: { flexDirection: "row", gap: 2, marginBottom: 4 },
  ratingNumberText: { fontSize: 12, fontWeight: "bold", color: "#1C1C19" },
  reviewCount: { color: "#837469", fontWeight: "normal" },
  
  reviewCard: { backgroundColor: "#FFFFFF", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#E6E2DD", marginBottom: 16 },
  reviewTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  reviewerName: { fontSize: 13, fontWeight: "bold", color: "#1C1C19" },
  verifiedText: { fontSize: 11, color: "#837469" },
  reviewTime: { fontSize: 11, color: "#A89F91" },
  reviewContent: { fontSize: 13, color: "#594232", lineHeight: 20, fontStyle: "italic" },
  
  readAllReviews: { fontSize: 13, fontWeight: "bold", color: "#785317", textDecorationLine: "underline" },

  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#FAF7F2", flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32, borderTopWidth: 1, borderTopColor: "#E6E2DD", gap: 12 },
  
  qtyContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 12, borderWidth: 1, borderColor: "#E6E2DD" },
  qtyBtn: { padding: 12, alignItems: "center", justifyContent: "center" },
  qtyBtnDisabled: { opacity: 0.5 },
  qtyText: { fontSize: 16, fontWeight: "bold", color: "#1C1C19", minWidth: 24, textAlign: "center" },

  addToCartBtn: { flex: 1, flexDirection: "row", backgroundColor: "#6F4315", paddingVertical: 14, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  addToCartText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
});