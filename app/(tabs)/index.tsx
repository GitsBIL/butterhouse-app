import { MaterialIcons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ProductCard from "../../components/ProductCard";
import { useShop } from "../../context/ShopContext";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { products, categories, fetchProducts, fetchCategories, user } = useShop();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Recommended");
  const [loadingRefresh, setLoadingRefresh] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoadingRefresh(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoadingRefresh(false);
    };
    loadData();
  }, []);

  // 1. Kategori: Ganti "Semua" jadi "Recommended"
  const cleanCategories = categories.filter(
    (c) => c.categoryName.toLowerCase() !== "semua"
  );
  const displayCategories = [{ id: "ALL", categoryName: "Recommended" }, ...cleanCategories];

  // 2. Logic Filter Produk
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.productName.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      selectedCategory === "Recommended" ||
      p.categoryId === categories.find((c) => c.categoryName === selectedCategory)?.id;
    return matchSearch && matchCat;
  });

  // 3. Ambil 3 produk pertama sebagai Best Sellers
  const bestSellers = products.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* MENGHILANGKAN HEADER "HOME" BAWAAN EXPO ROUTER */}
      <Tabs.Screen options={{ headerShown: false }} />

      {/* HEADER CUSTOM BUTTERHOUSE */}
      <View style={styles.header}>
        {/* View kosong penyeimbang agar title tetap di tengah */}
        <View style={{ width: 28 }} />
        
        <Text style={styles.headerTitle}>ButterHouse</Text>
        
        <TouchableOpacity 
          onPress={() => alert("Belum ada notifikasi baru untukmu hari ini.")}
        >
          <MaterialIcons name="notifications-none" size={28} color="#594232" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* 1. HERO BANNER */}
            <ImageBackground
              source={{
                uri: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
              }}
              style={styles.heroBanner}
              imageStyle={{ opacity: 0.5 }}
            >
              <View style={styles.heroOverlay}>
                <Text style={styles.welcomeText}>Good Morning, {user?.name?.split(" ")[0] || "Artisan"}</Text>
                <Text style={styles.heroTitle}>Freshly baked{"\n"}for you today.</Text>
              </View>
            </ImageBackground>

            {/* 2. SEARCH BAR (Diturunkan agar tidak menimpa banner) */}
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color="#735948" style={styles.searchIcon} />
              <TextInput
                placeholder="Find your favorite pastry..."
                placeholderTextColor="#A89F91"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
              />
            </View>

            {loadingRefresh ? (
              <ActivityIndicator size="large" color="#D97706" style={{ marginTop: 20 }} />
            ) : (
              <>
                {/* 3. BEST SELLER TODAY (Horizontal Scroll) */}
                {search === "" && selectedCategory === "Recommended" && bestSellers.length > 0 && (
                  <View style={styles.bestSellerSection}>
                    <Text style={styles.sectionTitle}>⭐ Best Seller Today</Text>
                    <FlatList
                      data={bestSellers}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item) => `bs-${item.id}`}
                      contentContainerStyle={{ paddingHorizontal: 20 }}
                      renderItem={({ item }) => (
                        <ProductCard
                          product={item}
                          isBestSeller={true}
                          customWidth={width * 0.4}
                          onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.id } })}
                        />
                      )}
                    />
                  </View>
                )}

                {/* 4. CATEGORY CHIPS */}
                <View style={styles.categoryContainer}>
                  <FlatList
                    data={displayCategories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => setSelectedCategory(item.categoryName)}
                        style={[
                          styles.categoryPill,
                          selectedCategory === item.categoryName && styles.categoryPillActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryText,
                            selectedCategory === item.categoryName && styles.categoryTextActive,
                          ]}
                        >
                          {item.categoryName}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                  {/* INFORMASI FRESHNESS HARIAN */}
                  <Text style={styles.freshnessInfo}>
                    Made fresh every morning • {filteredProducts.length} products available
                  </Text>
                </View>
              </>
            )}
          </>
        }
        // 5. ALL PRODUCTS GRID
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isBestSeller={false} 
            onPress={() => router.push({ pathname: "/product/[id]", params: { id: item.id } })}
          />
        )}
        
        ListFooterComponent={
          <>
            {/* 6. OUR STORY SECTION */}
            <View style={styles.storySection}>
              <Text style={styles.storySubtitle}>Since 2018</Text>
              <Text style={styles.storyText}>
                Crafted with traditional fermentation and premium ingredients.
              </Text>
            </View>

            {/* 7. QUICK TRUST SECTION */}
            <View style={styles.trustSection}>
              <View style={styles.trustItem}>
                <MaterialIcons name="check" size={16} color="#D97706" />
                <Text style={styles.trustText}>Freshly baked daily</Text>
              </View>
              <View style={styles.trustItem}>
                <MaterialIcons name="check" size={16} color="#D97706" />
                <Text style={styles.trustText}>Premium ingredients</Text>
              </View>
              <View style={styles.trustItem}>
                <MaterialIcons name="check" size={16} color="#D97706" />
                <Text style={styles.trustText}>Same day delivery</Text>
              </View>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FDF9F4" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FDF9F4",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#594232", 
    fontStyle: "italic",
  },
  heroBanner: { 
    height: 220, 
    justifyContent: "center", 
    backgroundColor: "#1F2937",
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(89, 66, 50, 0.45)", 
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  welcomeText: { 
    color: "#FDF9F4", 
    fontSize: 14, 
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: 34,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDF9F4",
    marginHorizontal: 20,
    marginTop: 20, // Margin diubah positif agar search bar turun rapi di bawah banner
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "#E6E2DD",
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: "#594232", fontSize: 13 },
  
  bestSellerSection: { marginTop: 32 },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#594232", 
    paddingHorizontal: 20,
    marginBottom: 16 
  },
  
  categoryContainer: { paddingTop: 24, paddingBottom: 16 },
  categoryPill: {
    backgroundColor: "#E6E2DD", 
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryPillActive: {
    backgroundColor: "#D97706",
  },
  categoryText: { color: "#594232", fontWeight: "600", fontSize: 13 },
  categoryTextActive: { color: "#FFFFFF" },
  freshnessInfo: {
    color: "#735948",
    fontSize: 12,
    fontStyle: "italic",
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },

  gridRow: { justifyContent: "space-between", paddingHorizontal: 20 },
  
  storySection: {
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 32,
    backgroundColor: "#F4F0EB", 
    marginTop: 16,
  },
  storySubtitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#D97706",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  storyText: {
    fontSize: 16,
    color: "#594232",
    textAlign: "center",
    lineHeight: 24,
    fontStyle: "italic",
  },
  trustSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: "center",
    gap: 8,
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trustText: {
    color: "#735948",
    fontSize: 13,
    fontWeight: "500",
  }
});