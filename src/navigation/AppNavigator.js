import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import CartScreen from '../screens/CartScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Platzi Store' }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Detalle' }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Carrito' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
