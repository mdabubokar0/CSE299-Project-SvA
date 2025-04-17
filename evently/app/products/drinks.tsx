import React from 'react';
import { Products } from '@/app/products/Products';
import { Stack } from 'expo-router';

const Drinks = () => {
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
      <Products productType="Drink" />
    </>
  );
};

export default Drinks;
