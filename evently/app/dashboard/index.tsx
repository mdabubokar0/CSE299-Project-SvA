import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import CardItem from "./CardItem";
import { API_URL } from "@/context/api";
import { Stack } from "expo-router";
import Tickets from "./Tickets";
import { useAuth } from "@/context/AuthContext";

const screenWidth = Dimensions.get("window").width;

const index = () => {
  const [organizers, setOrganizers] = useState(0);
  const [photographers, setPhotographers] = useState(0);
  const [attendees, setAttendees] = useState(0);
  const [events, setEvents] = useState(0);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [organizerRes, photographerRes, attendeeRes, eventRes] =
        await Promise.all([
          axios.get(`${API_URL}/api/organizer/count`),
          axios.get(`${API_URL}/api/photographer/count`),
          axios.get(`${API_URL}/api/attendee/count`),
          axios.get(`${API_URL}/event/count`),
        ]);

      setOrganizers(organizerRes.data.count);
      setPhotographers(photographerRes.data.count);
      setAttendees(attendeeRes.data.count);
      setEvents(eventRes.data.count);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: [
          100000, 150000, 120000, 180000, 220000, 210000, 250000, 270000,
          300000, 320000, 350000, 400000,
        ],
        color: () => "#36A2EB",
        strokeWidth: 2,
      },
    ],
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerBackTitle: "Back",
          headerTintColor: "#000",
        }}
      />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <View style={styles.cardsContainer}>
              {(user as { role: string }).role === "admin" && (
                <>
                  <CardItem title="Organizers" count={organizers} />
                  <CardItem title="Photographers" count={photographers} />
                  <CardItem title="Attendees" count={attendees} />
                  <CardItem title="Events" count={events} />
                </>
              )}
              {(user as { role: string }).role === "organizer" && (
                <>
                  <CardItem title="Events Created" count={events} />
                  <CardItem title="Hired" count="12" /> {/* Example value */}
                  <CardItem title="Tickets Sold" count="200" />{" "}
                  {/* Example value */}
                </>
              )}
              {(user as { role: string }).role === "photographer" && (
                <>
                  <CardItem title="Got Hired" count="10" />{" "}
                  {/* Example value */}
                  <CardItem title="Rejected" count="5" /> {/* Example value */}
                  <CardItem title="Charge" count="10000" />
                </>
              )}
              {(user as { role: string }).role === "attendee" && <Tickets />}{" "}
              {/* Assuming this is a component for tickets */}
            </View>

            {(user as { role: string }).role !== "attendee" && (
              <>
                <Text style={styles.chartTitle}>Monthly Revenue</Text>
                <LineChart
                  data={lineData}
                  width={screenWidth - 32}
                  height={220}
                  chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
                    labelColor: () => "#333",
                    propsForDots: {
                      r: "4",
                      strokeWidth: "2",
                      stroke: "#36A2EB",
                    },
                  }}
                  bezier
                  style={styles.chart}
                />
              </>
            )}
          </>
        )}
      </ScrollView>
    </>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 8,
  },
  chart: {
    borderRadius: 8,
  },
});
