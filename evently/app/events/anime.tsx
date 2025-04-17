import React from "react";
import { Events } from "@/app/events/Events";
import { Stack } from "expo-router";

const Anime = () => {
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
      <Events eventType="Anime" />
    </>
  );
};

export default Anime;
