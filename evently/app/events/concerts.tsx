import React from "react";
import { Events } from "@/app/events/Events";
import { Stack } from "expo-router";

const Concerts = () => {
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
      <Events eventType="Concert" />
    </>
  );
};

export default Concerts;
