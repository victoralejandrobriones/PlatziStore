/**
 * AppNavigator.tsx
 *
 * Configura la navegación principal de la aplicación utilizando
 * React Navigation. Define las pantallas disponibles y establece
 * las opciones visuales compartidas por el encabezado.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import CartScreen from '../screens/CartScreen';

/**
 * Navegador de tipo Stack utilizado para gestionar la navegación
 * entre las pantallas de la aplicación.
 */
const Stack = createNativeStackNavigator();

/**
 * Componente encargado de definir la estructura de navegación.
 *
 * Registra todas las pantallas de la aplicación y configura
 * las opciones globales del encabezado.
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          // Estilos compartidos por todas las pantallas del Stack.
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        {/* Pantalla principal que muestra el catálogo de productos. */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Platzi Store' }}
        />

        {/* Pantalla que muestra la información detallada de un producto. */}
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: 'Detalle' }}
        />

        {/* Pantalla del carrito de compras. */}
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: 'Carrito' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}