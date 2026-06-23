import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: "#D97706", 
        tabBarInactiveTintColor: "#A89F91", 
        headerShown: false, 
        tabBarStyle: {
          backgroundColor: "#FDF9F4", 
          borderTopWidth: 1,
          borderTopColor: "#E6E2DD",
          paddingBottom: 5,
          paddingTop: 3,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="shopping-cart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="list-alt" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <FontAwesome size={22} name="user" color={color} />,
        }}
      />
      
      {/* KUNCI RAHASIA: Sembunyiin Address dari Navbar */}
      <Tabs.Screen
        name="address"
        options={{
          href: null, 
        }}
      />

      {/* Sembunyiin Edit Profile dari Navbar */}
      <Tabs.Screen
        name="edit-profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}