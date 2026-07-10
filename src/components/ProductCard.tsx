/**
 * ProductCard.tsx
 *
 * Componente reutilizable encargado de representar un producto dentro del
 * catálogo. Muestra la información básica del producto y notifica cuando
 * el usuario lo selecciona para visualizar su detalle.
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../api/api';

/**
 * Propiedades requeridas por el componente ProductCard.
 */
type ProductCardProps = {
  /**
   * Información del producto a mostrar.
   */
  product: Product;

  /**
   * Función ejecutada cuando el usuario presiona la tarjeta.
   */
  onPress: () => void;
};

/**
 * Tarjeta utilizada para mostrar un resumen de un producto.
 *
 * Presenta la imagen principal, el nombre, la categoría y el precio del
 * producto. Toda la tarjeta es interactiva mediante el componente Pressable.
 *
 * @param product Producto a visualizar.
 * @param onPress Acción a ejecutar al seleccionar la tarjeta.
 */
export default function ProductCard({ product, onPress }: ProductCardProps) {
  // Se utiliza la primera imagen del arreglo como imagen principal.
  const imageUrl = product.images?.[0];

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        <Text style={styles.category}>
          {product.category?.name || 'General'}
        </Text>

        <Text style={styles.price}>
          ${product.price}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#f3f4f6',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563eb',
  },
});