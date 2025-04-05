import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  count: number | string;
};

const CardItem = ({ title, count }: Props) => {
  return (
    <View style={styles.card}>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default CardItem;

const styles = StyleSheet.create({
  card: {
    width: "49%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  count: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  title: {
    marginTop: 6,
    fontSize: 16,
    color: "#777",
  },
});
