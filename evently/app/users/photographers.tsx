import React from "react";
import { Users } from "@/app/users/Users";
import { Stack } from "expo-router";

const Photographers = () => {
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
      <Users userType="photographer" />
    </>
  );
};

export default Photographers;
