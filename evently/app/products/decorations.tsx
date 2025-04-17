import React from "react";
import { Products } from "@/app/products/Products";
import { Stack } from "expo-router";

const Decorations = () => {
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
      <Products productType="Decoration" />
    </>
  );
};

export default Decorations;
