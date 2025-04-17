import React from 'react';
import { Products } from '@/app/products/Products';
import { Stack } from 'expo-router';

const Venues = () => {
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
      <Products productType="Venue" />
    </>
  );
};

export default Venues;
