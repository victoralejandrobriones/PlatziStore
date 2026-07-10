/**
 * CartScreen.tsx
 *
 * Pantalla encargada de mostrar los productos agregados al carrito de compras.
 * Permite visualizar el resumen de la compra, eliminar productos, calcular
 * el total y simular el proceso de pago.
 */

import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';

/**
 * Pantalla del carrito de compras.
 */
export default function CartScreen({ navigation }: { navigation: any }) {
  // Obtiene el estado y las operaciones disponibles del carrito.
  const { items, removeFromCart, clearCart } = useCart();

  // Calcula el importe total de la compra considerando la cantidad
  // de cada producto agregado al carrito.
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  /**
   * Simula el proceso de pago.
   *
   * Una vez finalizada la compra, vacía el carrito, muestra un mensaje
   * de confirmación y regresa a la pantalla anterior.
   */
  function handlePay() {
    clearCart();
    Alert.alert('Pago simulado', 'Tu compra fue procesada correctamente.');
    navigation.goBack();
  }

  // Muestra un estado vacío cuando no existen productos en el carrito.
  if (!items.length) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
        <Text style={styles.emptyText}>Agrega productos desde el catálogo.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemMeta}>
                  Cantidad: {item.quantity}
                </Text>
                <Text style={styles.itemPrice}>
                  ${item.price * item.quantity}
                </Text>
              </View>

              {/* Permite eliminar un producto específico del carrito. */}
              <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Text style={styles.removeText}>Quitar</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Resumen de la compra y acción para simular el pago. */}
        <View style={styles.footer}>
          <Text style={styles.total}>
            Total: ${total.toFixed(2)}
          </Text>

          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePay}
          >
            <Text style={styles.payText}>Pagar</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  itemMeta: {
    color: '#6b7280',
    marginTop: 4,
  },
  itemPrice: {
    color: '#2563eb',
    fontWeight: '700',
    marginTop: 6,
  },
  removeText: {
    color: '#dc2626',
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
    backgroundColor: '#fff',
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  payButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  payText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
  },
});