import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";

const API_BASE_URL = "http://172.20.10.2:8081";

interface Event {
  id: number;
  title: string;
  thumbnail: string;
  ticket: number;
  category: string;
}

interface Photographer {
  id: number;
  photographer_name: string;
  picture: string;
  hourly_charge: number;
}

export default function Index() {
  const [events, setEvents] = useState<Event[]>([]);
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, photographersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/event/list`),
          axios.get(`${API_BASE_URL}/photographer/list`),
        ]);

        setEvents(eventsRes.data);
        setPhotographers(photographersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Filter events based on category
  const concerts = events.filter((event) => event.category === "Concert");
  const gaming = events.filter((event) => event.category === "Gaming");
  const anime = events.filter((event) => event.category === "Anime");
  const workshops = events.filter((event) => event.category === "Workshop");

  return (
    <ScrollView style={styles.container}> {/* Wrap the entire content with ScrollView */}
      {/* Concerts Section */}
      {concerts.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Concerts</Text>
          <FlatList
            data={concerts}
            horizontal
            keyExtractor={(item: Event) => item.id.toString()}
            renderItem={({ item }: { item: Event }) => <EventCard event={item} />}
            showsHorizontalScrollIndicator={false}
          />
        </>
      )}

      {/* Gaming Section */}
      {gaming.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Gaming</Text>
          <FlatList
            data={gaming}
            horizontal
            keyExtractor={(item: Event) => item.id.toString()}
            renderItem={({ item }: { item: Event }) => <EventCard event={item} />}
            showsHorizontalScrollIndicator={false}
          />
        </>
      )}

      {/* Anime Section */}
      {anime.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Anime</Text>
          <FlatList
            data={anime}
            horizontal
            keyExtractor={(item: Event) => item.id.toString()}
            renderItem={({ item }: { item: Event }) => <EventCard event={item} />}
            showsHorizontalScrollIndicator={false}
          />
        </>
      )}

      {/* Workshops Section */}
      {workshops.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Workshops</Text>
          <FlatList
            data={workshops}
            horizontal
            keyExtractor={(item: Event) => item.id.toString()}
            renderItem={({ item }: { item: Event }) => <EventCard event={item} />}
            showsHorizontalScrollIndicator={false}
          />
        </>
      )}

      {/* Photographers Section */}
      <Text style={styles.sectionTitle}>Photographers</Text>
      <FlatList
        data={photographers}
        horizontal
        keyExtractor={(item: Photographer) => item.id.toString()}
        renderItem={({ item }: { item: Photographer }) => (
          <PhotographerCard photographer={item} />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
}

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const imageUrl = event.thumbnail.startsWith("http")
    ? event.thumbnail
    : `http://172.20.10.2:8081${event.thumbnail}`;

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.cardTitle}>{event.title}</Text>
      <Text style={styles.cardSubtitle}>Price: {event.ticket}</Text>
    </View>
  );
};

const PhotographerCard: React.FC<{ photographer: Photographer }> = ({
  photographer,
}) => {
  const imageUrl = photographer.picture.startsWith("http")
    ? photographer.picture
    : `http://172.20.10.2:8081${photographer.picture}`;

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.cardTitle}>{photographer.photographer_name}</Text>
      <Text style={styles.cardSubtitle}>
        Hourly Charge : ৳{photographer.hourly_charge}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginRight: 15,
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 170,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "gray",
  },
});
