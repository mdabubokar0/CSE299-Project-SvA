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

export default function Menu() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Define all possible menu items with role restrictions
  const allMenuItems = [
    {
      title: "Dashboard",
      icon: "speedometer",
      onPress: () => router.push("/dashboard"),
      roles: ["admin", "organizer", "photographer", "attendee"], // All roles
    },
    {
      title: "Users",
      icon: "people",
      roles: ["admin"], // Only admin
      subItems: [
        {
          title: "Organizers",
          onPress: () => router.push("/users/organizers"),
          roles: ["admin"],
        },
        {
          title: "Photographers",
          onPress: () => router.push("/users/photographers"),
          roles: ["admin"],
        },
        {
          title: "Attendees",
          onPress: () => router.push("/users/attendees"),
          roles: ["admin"],
        },
      ],
    },
    {
      title: "Events",
      icon: "calendar",
      roles: ["organizer", "attendee"], // These roles
      subItems: [
        {
          title: "Concerts",
          onPress: () => router.push("/events/concerts"),
          roles: ["organizer", "attendee"],
        },
        {
          title: "Gaming",
          onPress: () => router.push("/events/gaming"),
          roles: ["organizer", "attendee"],
        },
        {
          title: "Anime",
          onPress: () => router.push("/events/anime"),
          roles: ["organizer", "attendee"],
        },
        {
          title: "Workshops",
          onPress: () => router.push("/events/workshops"),
          roles: ["organizer", "attendee"],
        },
        {
          title: "Create Event",
          onPress: () => router.push("/events/create"),
          roles: ["organizer"],
        },
      ],
    },
    {
      title: "Products",
      icon: "pricetags",
      roles: ["admin"], // Only admin
      subItems: [
        {
          title: "Drinks",
          onPress: () => router.push("/products/drinks"),
          roles: ["admin"],
        },
        {
          title: "Snacks",
          onPress: () => router.push("/products/snacks"),
          roles: ["admin"],
        },
        {
          title: "Venues",
          onPress: () => router.push("/products/venues"),
          roles: ["admin"],
        },
        {
          title: "Transportation",
          onPress: () => router.push("/products/transportation"),
          roles: ["admin"],
        },
        {
          title: "Decorations",
          onPress: () => router.push("/products/decorations"),
          roles: ["admin"],
        },
        {
          title: "Create Product",
          onPress: () => router.push("/products/create"),
          roles: ["admin"],
        },
      ],
    },
    {
      title: "Hiring",
      icon: "briefcase",
      onPress: () => router.push("/hiring"),
      roles: ["photographer"], // Only photographer
    },
    {
      title: "Settings",
      icon: "settings",
      onPress: () => router.push("/settings"),
      roles: ["admin", "organizer", "photographer", "attendee"], // All roles
    },
    {
      title: "Logout",
      icon: "log-out",
      onPress: handleLogout,
      roles: ["admin", "organizer", "photographer", "attendee"], // All roles
    },
  ];

  // Filter menu items based on user role
  const getFilteredMenuItems = () => {
    if (!user || typeof user.role !== "string") return [];

    return allMenuItems
      .filter((item) => item.roles.includes(user.role as string))
      .map((item) => {
        if (item.subItems) {
          return {
            ...item,
            subItems: item.subItems.filter((subItem) =>
              subItem.roles.includes(user.role as string)
            ),
          };
        }
        return item;
      });
  };

  const menuItems = getFilteredMenuItems();

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Menu</Text>

        {menuItems.map((item, index) => (
          <View key={index} style={styles.menuSection}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={item.subItems ? undefined : item.onPress}
            >
              <View style={styles.buttonContent}>
                <Ionicons name={item.icon as any} size={24} color="#010101" />
                <Text style={styles.buttonText}>{item.title}</Text>
              </View>
              {item.subItems && (
                <Ionicons name="chevron-down" size={20} color="#010101" />
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
    color: "#010101",
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
