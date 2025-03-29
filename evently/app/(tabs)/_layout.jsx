import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
        <Tabs.Screen name="home" />
        <Tabs.Screen name="calculator" />
        <Tabs.Screen name="forum" />
        <Tabs.Screen name="menu" />
    </Tabs>
  );
}
