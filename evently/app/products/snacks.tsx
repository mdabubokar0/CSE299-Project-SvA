import React from 'react';
import { Products } from '@/app/products/Products';
import { Stack } from 'expo-router';

const Snacks = () => {
  return(
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerBackTitle: "Back",
          headerTintColor: "#000",
        }}
      />
      <Products productType="Snack" />
    </>
  );
};

export default Snacks;
