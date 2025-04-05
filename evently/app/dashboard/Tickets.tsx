import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import axios, { AxiosError } from "axios";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/context/api";

interface Ticket {
  id: string;
  transaction_id: string;
  event_title: string;
  event_date: string;
  event_venue: string;
  amount: number;
  purchase_date: string;
  thumbnail?: string;
}

interface ApiResponse {
  success: boolean;
  tickets: Omit<Ticket, "id">[];
}

const Tickets: React.FC = () => {
  const navigation = useNavigation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const token = user?.token || ""; // A fallback empty string or handle the null case

  const formatAmount = useCallback((amount: number): string => {
    return isNaN(amount) ? "0.00" : amount.toFixed(2);
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString || "Unknown date";
    }
  }, []);

  const fetchTickets = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get<ApiResponse>(`${API_URL}/api/ticket`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        const formattedTickets = res.data.tickets.map((ticket) => ({
          ...ticket,
          id: ticket.transaction_id || Math.random().toString(36).substring(7),
          amount:
            typeof ticket.amount === "string"
              ? parseFloat(ticket.amount)
              : Number(ticket.amount) || 0,
        }));
        setTickets(formattedTickets);
      } else {
        setError("Failed to load tickets");
      }
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error loading tickets", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchTickets);
    fetchTickets();
    return unsubscribe;
  }, [fetchTickets, navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTickets();
  }, [fetchTickets]);

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#36A2EB" />
      </SafeAreaView>
    );
  }

  const TicketDetailRow: React.FC<{ icon: string; text: string }> = ({
    icon,
    text,
  }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">
        {text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#36A2EB"]}
            tintColor="#36A2EB"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Tickets</Text>
          <View style={{ width: 24 }} />
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={fetchTickets}
              style={styles.retryButton}
              activeOpacity={0.7}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && tickets.length === 0 && !error && (
          <View style={styles.emptyContainer}>
            <Text style={styles.ticketIcon}>🎟️</Text>
            <Text style={styles.emptyText}>No tickets found</Text>
            <TouchableOpacity
              onPress={fetchTickets}
              style={styles.refreshButton}
              activeOpacity={0.7}
            >
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        )}

        {tickets.map((ticket) => (
          <View style={styles.ticketCard} key={ticket.id}>
            {ticket.thumbnail && (
              <Image
                source={{ uri: ticket.thumbnail }}
                style={styles.eventImage}
                resizeMode="cover"
              />
            )}

            <View style={styles.ticketContent}>
              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                {ticket.event_title || "Untitled Event"}
              </Text>

              <TicketDetailRow icon="📅" text={formatDate(ticket.event_date)} />
              <TicketDetailRow
                icon="📍"
                text={ticket.event_venue || "Venue not specified"}
              />
              <TicketDetailRow
                icon="💵"
                text={`৳${formatAmount(ticket.amount)}`}
              />
              <TicketDetailRow
                icon="🕒"
                text={`Purchased on ${formatDate(ticket.purchase_date)}`}
              />

              <View style={styles.qrWrapper}>
                <QRCode
                  value={`${API_URL}/tickets/${ticket.transaction_id}`}
                  size={120}
                  color="black"
                  backgroundColor="white"
                />
                <Text style={styles.qrLabel}>Scan for event entry</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// ... (keep your existing styles unchanged)

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  container: {
    paddingBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
  backButton: {
    fontSize: 24,
    color: "#333",
  },
  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  eventImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  ticketContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  qrWrapper: {
    marginTop: 16,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  qrLabel: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  errorIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  errorText: {
    color: "#D32F2F",
    marginVertical: 8,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#D32F2F",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryText: {
    color: "white",
    fontWeight: "500",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  ticketIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginBottom: 8,
  },
  refreshButton: {
    backgroundColor: "#36A2EB",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 16,
  },
  refreshText: {
    color: "white",
    fontWeight: "500",
  },
});

export default Tickets;
