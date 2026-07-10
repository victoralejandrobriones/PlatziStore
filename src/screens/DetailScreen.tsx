/**
 * DetailScreen.tsx
 *
 * Pantalla encargada de mostrar la información completa de un producto
 * seleccionado desde el catálogo. Permite visualizar sus detalles y
 * agregarlo al carrito de compras.
 */

import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { Product } from '../api/api';

/**
 * Propiedades recibidas por la pantalla de detalle.
 *
 * El producto es enviado como parámetro mediante React Navigation.
 */
type DetailScreenProps = {
  route: {
    params?: {
      product?: Product;
    };
  };
  navigation: any;
};

/**
 * Pantalla que muestra la información detallada de un producto.
 *
 * Presenta la imagen principal, nombre, categoría, precio y descripción,
 * además de permitir agregar el producto al carrito.
 */
export default function DetailScreen({ route, navigation }: DetailScreenProps) {
  const { product } = route.params || {};
  const { addToCart } = useCart();

  // Si no se recibió un producto válido, se muestra un mensaje de error.
  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>No hay información disponible.</Text>
      </View>
    );
  }

  // Se utiliza la primera imagen disponible como imagen principal.
  const imageUrl = product.images?.[0];

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.category}>
          {product.category?.name || 'General'}
        </Text>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            // Agrega el producto al carrito y redirige al usuario
            // para visualizar los artículos seleccionados.
            addToCart(product);
            navigation.navigate('Cart');
          }}
        >
          <Text style={styles.addButtonText}>Agregar al carrito</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  category: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  error: {
    color: '#b91c1c',
    fontSize: 16,
  },
});