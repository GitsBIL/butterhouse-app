import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

export interface Product {
  id: number;
  categoryId: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  productStock: number;
  productImage?: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface Category {
  id: number;
  categoryName: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  type: "wallet" | "bank";
  logoUrl?: string;
}

export interface Purchase {
  id: number;
  address: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  paymentMethod?: PaymentMethod;
  items?: {
    id: number;
    quantity: number;
    productName: string;
    productPrice: number;
  }[];
}

interface ShopContextType {
  token: string | null;
  user: any | null;
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  paymentMethods: PaymentMethod[];
  purchases: Purchase[];
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchCart: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  fetchPurchases: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<boolean>;
  updateCartQty: (cartId: number, qty: number) => Promise<void>;
  removeFromCart: (cartId: number) => Promise<void>;
  checkout: (address: string, paymentMethodId: number) => Promise<boolean>;
  createPaymentMethod: (name: string, type: "wallet" | "bank", logoUrl: string) => Promise<boolean>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const BASE_URL = "https://shop.tandurkarya.com";
  const PROJECT_ID = 15;

  const BROWSER_AGENT = "Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36";

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([{ id: 0, categoryName: "Semua" }]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*", 
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "Connection": "keep-alive",
    "User-Agent": BROWSER_AGENT,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        const savedToken = await AsyncStorage.getItem("userToken");
        if (savedToken) {
          setToken(savedToken);
          
          // FIX 1: Paksa pakai savedToken langsung biar nggak nunggu state
          const profileRes = await fetch(`${BASE_URL}/auth/me`, {
            headers: {
              ...getHeaders(),
              Authorization: `Bearer ${savedToken}`,
            }, 
          });

          const textRes = await profileRes.text();
          
          try {
            const profileData = JSON.parse(textRes);
            if (profileRes.ok && profileData.success) {
              setUser(profileData.data);
            } else {
              await AsyncStorage.removeItem("userToken");
              setToken(null);
              setUser(null);
            }
          } catch (parseErr) {
            console.log("Token Expired atau Server ngirim HTML pas verifikasi token.");
            await AsyncStorage.removeItem("userToken");
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.log("Gagal memuat token (Abaikan jika di Web)", err);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ projectId: PROJECT_ID, name, email, password }),
      });

      const textRes = await res.text();
      let data;
      try {
        data = JSON.parse(textRes);
      } catch (err) {
        throw new Error("Server API bermasalah. Cek terminal VSCode untuk detail HTML-nya.");
      }

      if (!res.ok) throw new Error(data.message || "Registrasi Gagal");
      Alert.alert("Sukses", "Akun berhasil terdaftar!");
      return true;
    } catch (err: any) {
      Alert.alert("Register Error", err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const textRes = await res.text();
      let data;
      try {
        data = JSON.parse(textRes);
      } catch (err) {
        throw new Error("Server mengirim halaman HTML, bukan data login. Kemungkinan Endpoint salah atau diblokir WAF.");
      }

      if (!res.ok) throw new Error(data.message || "Login Gagal. Pastikan email & password benar.");

      setToken(data.data.token);
      await AsyncStorage.setItem("userToken", data.data.token);

      // FIX 2: Paksa pakai token yang baru didapet dari login
      const profileRes = await fetch(`${BASE_URL}/auth/me`, {
        headers: {
          ...getHeaders(),
          Authorization: `Bearer ${data.data.token}`
        }, 
      });
      
      const profileText = await profileRes.text();
      try {
        const profileData = JSON.parse(profileText);
        setUser(profileData.data);
      } catch (e) {
        console.log("Gagal ngambil data profil setelah login.");
      }
      
      return true;
    } catch (err: any) {
      Alert.alert("Login Error", err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
    } catch (err) {
      console.log("Gagal menghapus session token", err);
    }
    setToken(null);
    setUser(null);
    setCart([]);
    setPurchases([]);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/categories`, { headers: getHeaders() });
      if(res.ok) {
        const data = await res.json();
        if (data.success) setCategories([{ id: 0, categoryName: "Semua" }, ...data.data]);
      }
    } catch (err) { console.log("Error Categories:", err); }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/products`, { headers: getHeaders() });
      if(res.ok) {
        const data = await res.json();
        if (data.success) setProducts(data.data);
      }
    } catch (err) { console.log("Error Products:", err); }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch(`${BASE_URL}/carts`, { headers: getHeaders() });
      if(res.ok) {
        const data = await res.json();
        if (data.success) setCart(data.data);
      }
    } catch (err) { console.log("Error Cart:", err); }
  };

  const fetchPaymentMethods = async () => {
    try {
      const res = await fetch(`${BASE_URL}/payment-methods`, { headers: getHeaders() });
      if(res.ok) {
        const data = await res.json();
        if (data.success) setPaymentMethods(data.data);
      }
    } catch (err) { console.log("Error Payments:", err); }
  };

  const fetchPurchases = async () => {
    try {
      const res = await fetch(`${BASE_URL}/purchases`, { headers: getHeaders() });
      if(res.ok) {
        const data = await res.json();
        if (data.success) setPurchases(data.data);
      }
    } catch (err) { console.log("Error Purchases:", err); }
  };

  const addToCart = async (productId: number, quantity: number): Promise<boolean> => {
    try {
      const res = await fetch(`${BASE_URL}/carts`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ productId, quantity }),
      });
      if (!res.ok) throw new Error("Gagal menambahkan item");
      await fetchCart();
      return true;
    } catch (err: any) {
      Alert.alert("Cart Error", err.message);
      return false;
    }
  };

  const updateCartQty = async (cartId: number, qty: number) => {
    if (qty <= 0) return removeFromCart(cartId);
    try {
      const res = await fetch(`${BASE_URL}/carts/${cartId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ quantity: qty }),
      });
      if (!res.ok) throw new Error("Gagal memperbarui kuantitas");
      await fetchCart();
    } catch (err: any) {
      Alert.alert("Update Cart Error", err.message);
    }
  };

  const removeFromCart = async (cartId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/carts/${cartId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Gagal menghapus item");
      await fetchCart();
    } catch (err: any) {
      Alert.alert("Delete Error", err.message);
    }
  };

  const checkout = async (address: string, paymentMethodId: number): Promise<boolean> => {
    try {
      const res = await fetch(`${BASE_URL}/purchases`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ address, paymentMethodId }),
      });
      
      const textRes = await res.text();
      let data;
      try { data = JSON.parse(textRes); } 
      catch (e) { throw new Error("Gagal checkout, server error."); }

      if (!res.ok) throw new Error(data.message || "Proses checkout gagal");

      setCart([]);
      await fetchPurchases();
      return true;
    } catch (err: any) {
      Alert.alert("Checkout Gagal", err.message);
      return false;
    }
  };

  const createPaymentMethod = async (name: string, type: "wallet" | "bank", logoUrl: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/payment-methods`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name, type, logoUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat metode pembayaran");
      await fetchPaymentMethods();
      return true;
    } catch (err: any) {
      Alert.alert("Error", err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        token, user, products, categories, cart, paymentMethods, purchases, loading,
        login, register, logout, fetchProducts, fetchCategories, fetchCart,
        fetchPaymentMethods, fetchPurchases, addToCart, updateCartQty, removeFromCart,
        checkout, createPaymentMethod,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop harus dibungkus di dalam ShopProvider");
  return context;
};