import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function menu() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: "speedometer",
      onPress: () => router.push("/dashboard"),
    },
    {
      title: "Users",
      icon: "people",
      subItems: [
        {
          title: "Organizers",
          onPress: () => router.push("/users/organizers"),
        },
        {
          title: "Photographers",
          onPress: () => router.push("/users/photographers"),
        },
        { title: "Attendees", onPress: () => router.push("/users/attendees") },
      ],
    },
    {
      title: "Events",
      icon: "calendar",
      onPress: () => router.push("/events"),
    },
    {
      title: "Products",
      icon: "pricetags",
      onPress: () => router.push("/products"),
    },
    {
      title: "Settings",
      icon: "settings",
      onPress: () => router.push("/settings"),
    },
    {
      title: "Logout",
      icon: "log-out",
      onPress: handleLogout,
    },
  ];

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Menu</Text>

        {menuItems.map((item, index) => (
          <View key={index} style={styles.menuSection}>
            <TouchableOpacity style={styles.menuButton} onPress={item.onPress}>
              <View style={styles.buttonContent}>
                <Ionicons name={item.icon as any} size={24} color="#4a6fa5" />
                <Text style={styles.buttonText}>{item.title}</Text>
              </View>
              {item.subItems && (
                <Ionicons name="chevron-down" size={20} color="#666" />
              )}
            </TouchableOpacity>

            {item.subItems && (
              <View style={styles.subMenu}>
                {item.subItems.map((subItem, subIndex) => (
                  <TouchableOpacity
                    key={subIndex}
                    style={styles.subMenuItem}
                    onPress={subItem.onPress}
                  >
                    <Text style={styles.subMenuText}>{subItem.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuSection: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButton: {
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    marginLeft: 15,
    color: "#34495e",
    fontWeight: "500",
  },
  subMenu: {
    paddingLeft: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  subMenuItem: {
    paddingVertical: 15,
    paddingLeft: 45,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  subMenuText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
