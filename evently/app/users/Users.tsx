import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@/context/api";
import { useAuth } from "@/context/AuthContext";

interface User {
  id: string;
  name: string;
  username: string;
  role: string;
}

interface Props {
  userType: string;
}

export const Users: React.FC<Props> = ({ userType }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const navigation = useNavigation();
  const { user } = useAuth();
  const token = user?.token;

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, userType]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page,
        limit: pageSize,
      };
      if (userType !== "all") {
        params.role = userType;
      }

      const response = await axios.get(`${API_URL}/api/users`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const filtered =
        userType === "all"
          ? response.data.users
          : response.data.users.filter((user: User) => user.role === userType);

      setUsers(filtered);
      setTotal(filtered.length);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detail}>Username: {item.username}</Text>
      <Text style={styles.detail}>
        Role: {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {userType.charAt(0).toUpperCase() + userType.slice(1)}s
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#1890ff" />
      ) : (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  list: {
    paddingBottom: 32,
  },
  card: {
    marginVertical: 8,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderWidth: 1,
    borderColor: "#c4c4c4",
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
  },
  detail: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
});
